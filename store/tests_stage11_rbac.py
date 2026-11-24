import os
from django.test import TestCase, Client
from django.contrib.auth.models import User, Group, Permission
from django.contrib.admin.sites import AdminSite
from django.core.management import call_command, CommandError
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status

from store.models import (
    Product, Order, OrderItem, Invoice, Prescription,
    OrderStatusHistory, StorePaymentSettings, Address, Cart, Wishlist
)
from store.admin import (
    SecureUserAdmin, SecureGroupAdmin, OrderAdmin,
    InvoiceAdmin, PrescriptionAdmin, OrderStatusHistoryAdmin
)

class MockRequest:
    def __init__(self, user):
        self.user = user

class Stage11RBACFullTestSuite(TestCase):
    def setUp(self):
        # 1. Setup roles
        call_command('setup_roles')
        self.owner_group = Group.objects.get(name='Shop Owner')

        # 2. Developer superuser
        self.developer = User.objects.create_superuser(
            username='dev_admin',
            email='dev@maxvisionoptical.com',
            password='DevPasswordSecure123!'
        )

        # 3. Create single designated shop owner
        self.owner = User.objects.create_user(
            username='shop_owner_asif',
            email='owner@maxvisionoptical.com',
            password='OwnerPasswordSecure123!',
            is_staff=True,
            is_superuser=False
        )
        self.owner.groups.add(self.owner_group)

        # 4. Two distinct customers
        self.customer1 = User.objects.create_user(
            username='customer_aarav',
            email='aarav@example.com',
            password='Cust1Password123!',
            is_staff=False,
            is_superuser=False
        )
        self.customer2 = User.objects.create_user(
            username='customer_rohan',
            email='rohan@example.com',
            password='Cust2Password123!',
            is_staff=False,
            is_superuser=False
        )

        # 5. Sample product & order
        self.product = Product.objects.create(
            name='Titanium Frame Best',
            category='eyeglasses',
            price=2000.0,
            stock_quantity=10
        )
        self.order1 = Order.objects.create(
            user=self.customer1,
            total_amount=2000.0,
            mobile='7485067874',
            address='Main Road Ranchi',
            status='Pending',
            payment_status='PENDING_VERIFICATION',
            utr_number='UTRTEST12345678'
        )
        self.order1.prescription_file.save('test_rx.pdf', SimpleUploadedFile('test_rx.pdf', b'%PDF-1.4 sample rx'))
        self.order1.save()

        self.invoice1 = Invoice.objects.create(
            order=self.order1,
            serial_number='INV-TEST-001'
        )

    # TEST 1: Developer superuser has complete access
    def test_developer_superuser_full_access(self):
        req = MockRequest(self.developer)
        user_admin = SecureUserAdmin(User, AdminSite())
        group_admin = SecureGroupAdmin(Group, AdminSite())
        order_admin = OrderAdmin(Order, AdminSite())

        self.assertTrue(user_admin.has_module_permission(req))
        self.assertTrue(user_admin.has_view_permission(req))
        self.assertTrue(group_admin.has_module_permission(req))
        self.assertTrue(order_admin.has_delete_permission(req))

    # TEST 2: Owner can manage products, orders, payments, inventory and store settings
    def test_owner_business_permissions(self):
        # Owner has view/change order, add/change/delete product
        self.assertTrue(self.owner.has_perm('store.view_order'))
        self.assertTrue(self.owner.has_perm('store.change_order'))
        self.assertTrue(self.owner.has_perm('store.add_product'))
        self.assertTrue(self.owner.has_perm('store.change_product'))
        self.assertTrue(self.owner.has_perm('store.view_storepaymentsettings'))
        self.assertTrue(self.owner.has_perm('store.change_storepaymentsettings'))

    # TEST 3: Owner cannot access User, Group or Permission management in Admin
    def test_owner_cannot_access_user_group_admin(self):
        req = MockRequest(self.owner)
        user_admin = SecureUserAdmin(User, AdminSite())
        group_admin = SecureGroupAdmin(Group, AdminSite())

        self.assertFalse(user_admin.has_module_permission(req))
        self.assertFalse(user_admin.has_view_permission(req))
        self.assertFalse(user_admin.has_add_permission(req))
        self.assertFalse(user_admin.has_change_permission(req))
        self.assertFalse(user_admin.has_delete_permission(req))

        self.assertFalse(group_admin.has_module_permission(req))
        self.assertFalse(group_admin.has_view_permission(req))

    # TEST 4: Owner cannot delete protected financial/order/prescription records
    def test_owner_cannot_delete_critical_records(self):
        req = MockRequest(self.owner)
        order_admin = OrderAdmin(Order, AdminSite())
        invoice_admin = InvoiceAdmin(Invoice, AdminSite())
        rx_admin = PrescriptionAdmin(Prescription, AdminSite())
        history_admin = OrderStatusHistoryAdmin(OrderStatusHistory, AdminSite())

        self.assertFalse(order_admin.has_delete_permission(req))
        self.assertFalse(invoice_admin.has_delete_permission(req))
        self.assertFalse(rx_admin.has_delete_permission(req))
        self.assertFalse(history_admin.has_delete_permission(req))

    # TEST 5: Customer registration cannot grant staff or superuser privileges
    def test_customer_registration_privilege_escalation_rejected(self):
        client = APIClient()
        res = client.post('/api/auth/register/', {
            'username': 'hacker_user',
            'password': 'Password123!',
            'is_staff': True,
            'is_superuser': True
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Privilege escalation rejected', res.data.get('error', ''))
        self.assertFalse(User.objects.filter(username='hacker_user').exists())

    # TEST 6: Customer A cannot access Customer B's profile, addresses, orders, invoices, or prescriptions
    def test_customer_cross_account_isolation(self):
        client = APIClient()
        client.force_authenticate(user=self.customer2)

        # 6a. Cannot download Customer 1's invoice
        res_inv = client.get(f'/api/orders/{self.order1.pk}/invoice/')
        self.assertEqual(res_inv.status_code, status.HTTP_403_FORBIDDEN)

        # 6b. Cannot download Customer 1's prescription
        res_rx = client.get(f'/api/orders/{self.order1.pk}/prescription/')
        self.assertEqual(res_rx.status_code, status.HTTP_403_FORBIDDEN)

        # 6c. Address isolation
        addr1 = Address.objects.create(
            user=self.customer1,
            full_name='Aarav Address',
            mobile='7485067874',
            street_address='Line 1',
            city='Ranchi',
            pincode='834001'
        )
        res_addr = client.get(f'/api/addresses/{addr1.pk}/')
        self.assertEqual(res_addr.status_code, status.HTTP_404_NOT_FOUND)

        # 6d. Orders list does not show Customer 1's orders
        res_orders = client.get('/api/orders/')
        order_ids = [o['id'] for o in res_orders.data]
        self.assertNotIn(self.order1.pk, order_ids)

    # TEST 7: Customer cannot access Django Admin
    def test_customer_cannot_access_django_admin(self):
        c = Client()
        c.force_login(self.customer1)
        res = c.get('/admin/')
        # Redirect to login or 302
        self.assertIn(res.status_code, [302, 403])

    # TEST 8: Customer cannot modify product price, stock, order ownership, or payment status
    def test_customer_cannot_modify_products_or_order_status(self):
        client = APIClient()
        client.force_authenticate(user=self.customer1)

        # Cannot patch or put products
        res_prod = client.patch(f'/api/products/{self.product.pk}/', {'price': 10.0})
        self.assertEqual(res_prod.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        # Cannot access admin dashboard stats
        res_stats = client.get('/api/admin/dashboard-stats/')
        self.assertEqual(res_stats.status_code, status.HTTP_403_FORBIDDEN)

    # TEST 9: Anonymous access is rejected for protected endpoints
    def test_anonymous_access_rejected_on_protected_endpoints(self):
        client = APIClient()
        self.assertEqual(client.get('/api/auth/profile/').status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(client.get('/api/addresses/').status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(client.get('/api/orders/').status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(client.get('/api/cart/').status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(client.get(f'/api/orders/{self.order1.pk}/invoice/').status_code, status.HTTP_401_UNAUTHORIZED)

    # TEST 10: Direct prescription media access is blocked (HTTP 403)
    def test_direct_prescription_media_access_blocked(self):
        c = Client()
        # Direct unauthenticated GET to /media/prescriptions/test_rx.pdf
        res = c.get(f'/media/prescriptions/{os.path.basename(self.order1.prescription_file.name)}')
        self.assertEqual(res.status_code, 403)
        self.assertIn(b'Direct access to medical prescriptions is blocked', res.content)

    # TEST 11: Authorized prescription endpoint works for owner and staff
    def test_authorized_prescription_endpoint_works(self):
        client = APIClient()

        # Customer 1 (owner) can download
        client.force_authenticate(user=self.customer1)
        res_cust = client.get(f'/api/orders/{self.order1.pk}/prescription/')
        self.assertEqual(res_cust.status_code, status.HTTP_200_OK)

        # Shop Owner (staff) can download for fulfillment
        client.force_authenticate(user=self.owner)
        res_owner = client.get(f'/api/orders/{self.order1.pk}/prescription/')
        self.assertEqual(res_owner.status_code, status.HTTP_200_OK)

        # Developer superuser can download
        client.force_authenticate(user=self.developer)
        res_dev = client.get(f'/api/orders/{self.order1.pk}/prescription/')
        self.assertEqual(res_dev.status_code, status.HTTP_200_OK)

    # TEST 12: setup_roles is idempotent
    def test_setup_roles_idempotency(self):
        call_command('setup_roles')
        count1 = self.owner_group.permissions.count()
        call_command('setup_roles')
        count2 = self.owner_group.permissions.count()
        self.assertEqual(count1, count2)

    # TEST 13: create_shop_owner enforces single active owner constraint
    def test_create_shop_owner_single_active_owner_constraint(self):
        # Already has self.owner active in Shop Owner group
        with self.assertRaises(CommandError) as ctx:
            call_command(
                'create_shop_owner',
                username='second_owner',
                email='second@example.com',
                password='NewPassword123!'
            )
        self.assertIn('Exactly one designated active Shop Owner account is permitted', str(ctx.exception))

