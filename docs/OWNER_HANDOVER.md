# 👓 MAXVISION Optical – Shop Owner Handover Guide

**Store:** MAXVISION Optical, Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand – 834001  
**Phones:** +91 7485067874 | +91 7033353140  
**Interface:** Django Admin (`http://localhost:8000/admin/` or production domain `/admin/`)  
**Designated Role:** `Shop Owner` (`is_staff=True`, `is_superuser=False`, member of `Shop Owner` group)  

---

## 1. Quick Start & Login

1. Open your browser and navigate to the admin portal:
   ```
   http://127.0.0.1:8000/admin/
   ```
2. Enter your assigned Shop Owner username and password.
3. Upon logging in, you will see the **MAXVISION Optical Business Management Portal**.

---

## 2. What the Shop Owner CAN Do (Your Daily Business Operations)

### A. Managing Eyewear & Contact Lenses Catalog
* **Add New Frames / Lenses:** Click **Products** ➡️ **Add Product**.
  * Enter name, category (`eyeglasses`, `sunglasses`, `contact_lenses`), brand, price, discount percentage, and stock quantity.
  * For contact lenses, specify `lens_type` (Spherical, Toric, Multifocal, Colored) and `wear_duration` (Daily, Monthly, Yearly).
  * Upload high-resolution frame photographs.
* **Update Stock & Prices:** Select any product to update its stock quantity or price. When customers purchase an item, stock is decremented automatically; when stock drops to 5 or fewer, it automatically appears under the **Low Stock** filter.
* **Delete Discontinued Products:** You may delete products that are no longer available in the store.

### B. Customer Orders & Fulfillment Pipeline
* **View New Orders:** Click **Orders** to see a chronological list of customer orders with customer name, total amount, delivery type (Home Delivery vs. Store Pickup), and payment status.
* **Fulfillment Status Pipeline:** Advance customer orders through the genuine optical workflow:
  * `Pending` ➡️ `Accepted` ➡️ `Processing Lenses` ➡️ `Shipped` ➡️ `Delivered`
  * If an order is `Cancelled`, the platform's inventory safeguard automatically restores the product stock back to the shelf (exactly once).
* **Order Status Notes:** Add status notes and tracking comments in the **Order Status History** section of each order.

### C. Manual UPI Payment Verification & "Mark Paid"
* **Review Submitted UTR:** When a customer pays via UPI QR, they submit a 10 to 22-character transaction UTR number. The order appears with payment status `Pending Verification`.
* **Verify against your UPI App:** Check your PhonePe/Paytm/GooglePay business app on phone `7485067874` to confirm receipt of the exact order amount matching the customer's UTR.
* **Mark Selected Orders as Paid:**
  1. Select the checkbox next to the verified order(s).
  2. Choose **Mark selected orders as Paid** from the Actions dropdown.
  3. Click **Go**.
  * The system automatically marks payment as `PAID`, stamps your username as `payment_verified_by`, records the timestamp `payment_verified_at`, and appends an audit entry to the order history.

### D. Store Payment Settings (Your UPI QR Code)
* Click **Store Payment Settings** in Django Admin.
* Set your official store **UPI ID** (e.g. `7485067874@ptyes`).
* Upload your authentic PhonePe/Paytm merchant **QR Image**.
* Check **UPI Enabled** to activate UPI at checkout.
  *(Note: If disabled or if no QR image is uploaded, the website automatically hides the UPI option and allows cash on delivery).*

### E. Invoices & Prescriptions
* **Download PDF Invoices:** Open any order to review customer items and download the official MAXVISION Optical ReportLab PDF invoice containing store address, phone numbers, item breakdown, and delivery charges.
* **Customer Prescriptions:** Review eye powers (Sphere, Cylinder, Axis, Pupillary Distance) or download uploaded prescription documents for optical lens manufacturing.

### F. Try @ Home Doorstep Visit Requests
* Click **Home Visit Requests** to view customer booking requests for home eye tests in Ranchi. Review the customer's preferred date, phone number, and address, and assign your optical staff.

---

## 3. What the Shop Owner CANNOT Do (System Protection & Security)

To safeguard your financial records, audit trails, and platform integrity, the Shop Owner account cannot:
* ❌ **Delete Critical Records:** You cannot delete Orders, Invoices, Prescriptions, or Order Audit Logs.
* ❌ **Access User & Group Management:** Technical Django user accounts, developer credentials, and security groups are hidden and restricted to the Developer superuser.
* ❌ **Create Other Staff Accounts:** You cannot create additional staff or superuser accounts. If a staff rotation is needed, contact your developer.
* ❌ **Modify Core Technical Settings:** You cannot alter the database configuration, API throttles, SSL certificates, or secret keys.

---

## 4. Password Recovery & Handover
* If you forget your password, your developer can reset it via the Django administration command or developer superuser panel.
* Never share your password over unencrypted messaging channels.

