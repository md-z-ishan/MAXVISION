from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from store.models import (
    Product, StorePaymentSettings, Order, OrderItem,
    Invoice, Prescription, HomeVisitRequest,
    OrderStatusHistory, Address, UserProfile
)

class Command(BaseCommand):
    help = "Idempotently configure the Shop Owner role and assign audited business-only permissions."

    def handle(self, *args, **options):
        self.stdout.write("Configuring 'Shop Owner' role...")

        # 1. Retrieve or create the Shop Owner group
        owner_group, created = Group.objects.get_or_create(name='Shop Owner')
        if created:
            self.stdout.write(self.style.SUCCESS("Created 'Shop Owner' group."))
        else:
            self.stdout.write("Existing 'Shop Owner' group found. Updating permissions...")

        # 2. Define exactly allowed permission codenames per business model
        # Note: Critical records (Order, Invoice, Prescription, OrderStatusHistory) strictly lack delete permissions
        permitted_codenames = [
            # Product: Full management of catalog, images, stock, pricing
            'add_product', 'change_product', 'delete_product', 'view_product',

            # StorePaymentSettings: Manage UPI QR, UPI ID, enable/disable (no delete)
            'view_storepaymentsettings', 'change_storepaymentsettings',

            # Order & Items: View and update fulfillment statuses, verify payments (no delete, no direct manual creation)
            'view_order', 'change_order',
            'view_orderitem', 'change_orderitem',

            # Invoices & Prescriptions: View only (no tampering, no deletion)
            'view_invoice',
            'view_prescription',

            # Doorstep Eye Test Requests: View and update status (no delete)
            'view_homevisitrequest', 'change_homevisitrequest',

            # Order Status History: View audit trail and append notes (no change/delete of existing logs)
            'view_orderstatushistory', 'add_orderstatushistory',

            # Customer fulfillment contact & shipping address information (view only, no delete)
            'view_address',
            'view_userprofile',
        ]

        # 3. Fetch matching Permission objects
        permissions = list(Permission.objects.filter(codename__in=permitted_codenames))

        # Sanity check: Ensure no user/group/permission or delete permissions leaked in
        for perm in permissions:
            if perm.content_type.app_label in ['auth', 'contenttypes', 'sessions', 'admin']:
                raise RuntimeError(f"Security Violation: Leaked system permission {perm.codename}")
            if perm.codename.startswith('delete_') and perm.content_type.model in ['order', 'invoice', 'prescription', 'orderstatushistory']:
                raise RuntimeError(f"Security Violation: Critical record delete permission {perm.codename}")

        # 4. Set permissions (replaces existing permissions for idempotency)
        owner_group.permissions.set(permissions)
        owner_group.save()

        # 5. Output final permission audit list
        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully configured 'Shop Owner' group with {len(permissions)} permissions:\n"))
        for perm in sorted(owner_group.permissions.all(), key=lambda p: (p.content_type.model, p.codename)):
            self.stdout.write(f"  • {perm.content_type.app_label}.{perm.codename} ({perm.name})")

        self.stdout.write(self.style.SUCCESS("\nRole configuration complete & verified."))

