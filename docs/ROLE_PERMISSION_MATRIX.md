# 🛡️ MAXVISION Optical – Role-Based Access Control (RBAC) Matrix

**Architecture:** Strictly 3 Account Tiers (Developer Superuser, Single Shop Owner, Customers).  
**Interface:** Django Admin for Owner management; React SPA for Customer e-commerce.

---

## Complete Role-Permission Matrix

| Resource / Action | Developer (Superuser) | Shop Owner (`is_staff=True`) | Customer (`is_staff=False`) | Anonymous Public |
| :--- | :---: | :---: | :---: | :---: |
| **Django Admin Portal (`/admin/`)** | Full Access | Business Access | ❌ Forbidden (302/403) | ❌ Forbidden (Redirect) |
| **User & Group Management (`auth.User`, `auth.Group`)** | Full Access | ❌ Forbidden (Hidden & 403) | ❌ Forbidden | ❌ Forbidden |
| **Product Catalog: Browse & Search** | Full Access | Full Access | Read-Only (Public) | Read-Only (Public) |
| **Product Catalog: Create / Edit / Delete** | Full Access | Allowed via Admin | ❌ Blocked (405) | ❌ Blocked (401) |
| **Stock & Pricing Modifications** | Full Access | Allowed via Admin | ❌ Blocked (Server Derived) | ❌ Blocked |
| **Cart: Personal Item Management** | View in Admin | View in Admin | Full Personal CRUD | ❌ 401 Unauthorized |
| **Wishlist: Personal Management** | View in Admin | View in Admin | Full Personal CRUD | ❌ 401 Unauthorized |
| **Checkout & Order Creation** | Full Access | Full Access | Creates Own Order | ❌ 401 Unauthorized |
| **Order: View Fulfillment List** | Full Access | All Orders in Admin | Own Orders Only | ❌ 401 Unauthorized |
| **Order: Update Status (`Pending` ➡️ `Delivered`)** | Full Access | Allowed via Admin | ❌ Blocked | ❌ Blocked |
| **Order: Delete Record** | Allowed | ❌ Forbidden (Guard Enforced) | ❌ Forbidden | ❌ Forbidden |
| **UPI Verification & "Mark Paid" Action** | Full Access | Allowed via Admin Action | ❌ Blocked | ❌ Blocked |
| **StorePaymentSettings: View & Update** | Full Access | Allowed via Admin (Singleton) | Read Active Settings | Read Active Settings |
| **StorePaymentSettings: Delete** | ❌ Blocked (Singleton) | ❌ Blocked (Singleton) | ❌ Blocked | ❌ Blocked |
| **Invoices: Download ReportLab PDF** | Any Order | Any Order (`is_staff`) | Own Order Only (`order.user`) | ❌ 401 Unauthorized |
| **Invoices: Delete Record** | Allowed | ❌ Forbidden (Guard Enforced) | ❌ Forbidden | ❌ Forbidden |
| **Prescriptions: View / Download** | Any Order | Any Order (`is_staff`) | Own Order Only (`order.user`) | ❌ 401 Unauthorized |
| **Prescriptions: Direct URL (`/media/prescriptions/`)**| ❌ Blocked (403)| ❌ Blocked (403) | ❌ Blocked (403) | ❌ Blocked (403) |
| **Prescriptions: Delete Record** | Allowed | ❌ Forbidden (Guard Enforced) | ❌ Forbidden | ❌ Forbidden |
| **OrderStatusHistory: View & Append** | Full Access | View & Add Notes | View via Orders Tracker | ❌ 401 Unauthorized |
| **OrderStatusHistory: Delete or Modify Log** | Allowed | ❌ Forbidden (Guard Enforced) | ❌ Forbidden | ❌ Forbidden |
| **HomeVisitRequest: Create Booking** | Full Access | Allowed | Allowed | Allowed |
| **HomeVisitRequest: Process in Admin** | Full Access | Allowed | ❌ Forbidden | ❌ Forbidden |
| **Customer Profile & Address Book** | View in Admin | View in Admin for Shipping | Personal CRUD (`request.user`) | ❌ 401 Unauthorized |
| **Customer Registration (`/api/auth/register/`)** | N/A | N/A | Normal Registration | Normal Registration |
| **Privilege Escalation Injection on Register** | N/A | N/A | ❌ Rejected (400) | ❌ Rejected (400) |
| **Admin Dashboard Stats (`/api/admin/dashboard-stats/`)**| 200 OK | 200 OK | ❌ 403 Forbidden | ❌ 401 Unauthorized |
| **System Health Check (`/api/health/`)** | 200 OK | 200 OK | 200 OK | 200 OK |

