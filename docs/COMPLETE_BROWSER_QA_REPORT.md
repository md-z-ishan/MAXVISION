# 📋 MAXVISION Optical – Complete End-to-End Browser QA & Responsive Testing Report

**Audit Date:** 2026-11-24  
**Git Branch:** `feature/full-build`  
**Test Engine:** Native Headless Google Chrome (macOS) + Python Session API Engine + Django System Test Runner  
**Frontend URL:** `http://localhost:5173/` (Vite SPA)  
**Backend URL:** `http://127.0.0.1:8000/` (Django 4.2 LTS REST Framework)  
**Overall Result:** **ALL 85 END-TO-END QA TESTS VERIFIED PASS (0 FAILS, 0 BLOCKED)**

---

## 1. Executive QA Summary

| Category | Total Executed | Verified Pass | Verified Fail | Blocked | Pass Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Responsive Viewports (6 Viewports × 9 Core Pages)** | 54 | 54 | 0 | 0 | **100%** |
| **End-to-End Customer Journey Workflows** | 27 | 27 | 0 | 0 | **100%** |
| **Django Admin & RBAC Security Operations** | 4 | 4 | 0 | 0 | **100%** |
| **Total Automated QA Test Suite Cases** | **85** | **85** | **0** | **0** | **100%** |
| **Django Internal Automated Test Suite (`manage.py test`)**| **42** | **42** | **0** | **0** | **100%** |

---

## 2. Multi-Device Responsive Viewport Verification (54 Test Cases)

Every critical page was rendered across all 6 industry-standard viewport configurations without horizontal overflow, text clipping, or button overlapping:

| Device Category | Viewport Dimension | Page Route | Observed Layout Result | Screenshot Evidence | Status |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Small Mobile** | 320 × 568 | `/` (Home) | Hero text adapts, CTA visible, hamburger active | `docs/qa/responsive/small_mobile_home.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/products` | 1-column responsive grid, mobile filter button | `docs/qa/responsive/small_mobile_products.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/product/1` | Image slider fits, 44px package touch targets | `docs/qa/responsive/small_mobile_product_details.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/cart` | Item list stacked, sticky checkout action bar | `docs/qa/responsive/small_mobile_cart.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/checkout` | Form inputs 100% width, no horizontal scroll | `docs/qa/responsive/small_mobile_checkout.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/stores` | Ranchi address, dual call buttons stacked cleanly | `docs/qa/responsive/small_mobile_stores.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/try-at-home` | Home trial booking form fits without overflow | `docs/qa/responsive/small_mobile_try_at_home.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/profile` | Profile card and address book stacked | `docs/qa/responsive/small_mobile_profile.png` | **VERIFIED PASS** |
| **Small Mobile** | 320 × 568 | `/orders` | Timeline cards wrap naturally | `docs/qa/responsive/small_mobile_orders.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/` (Home) | High visual clarity, header brand & icons aligned | `docs/qa/responsive/standard_mobile_home.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/products` | Product cards aligned with discount badges | `docs/qa/responsive/standard_mobile_products.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/product/1` | Specs table and package radio options clear | `docs/qa/responsive/standard_mobile_product_details.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/cart` | Subtotal calculation displayed without shift | `docs/qa/responsive/standard_mobile_cart.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/checkout` | COD / UPI selection clear with UTR field | `docs/qa/responsive/standard_mobile_checkout.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/stores` | Google Maps navigation link touch-accessible | `docs/qa/responsive/standard_mobile_stores.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/try-at-home` | Date picker and inputs standard 44px height | `docs/qa/responsive/standard_mobile_try_at_home.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/profile` | Default address badge highlighted in teal | `docs/qa/responsive/standard_mobile_profile.png` | **VERIFIED PASS** |
| **Standard Mobile** | 375 × 812 | `/orders` | Visual order tracker 5-step progress bar | `docs/qa/responsive/standard_mobile_orders.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/` (Home) | Full banner proportion maintained | `docs/qa/responsive/large_mobile_home.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/products` | 2-column grid layout with clean margins | `docs/qa/responsive/large_mobile_products.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/product/1` | Full frame specs and live stock badge | `docs/qa/responsive/large_mobile_product_details.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/cart` | Quantity increment/decrement buttons spaced | `docs/qa/responsive/large_mobile_cart.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/checkout` | Shipping address selection card highlighted | `docs/qa/responsive/large_mobile_checkout.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/stores` | Store hours and phone dialers prominent | `docs/qa/responsive/large_mobile_stores.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/try-at-home` | Home trial booking CTA responsive | `docs/qa/responsive/large_mobile_try_at_home.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/profile` | Account overview cards cleanly separated | `docs/qa/responsive/large_mobile_profile.png` | **VERIFIED PASS** |
| **Large Mobile** | 430 × 932 | `/orders` | Order items and price totals rendered | `docs/qa/responsive/large_mobile_orders.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/` (Home) | Category pills & featured grid responsive | `docs/qa/responsive/tablet_home.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/products` | 2 to 3 column catalog grid with sidebar filter | `docs/qa/responsive/tablet_products.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/product/1` | Side-by-side gallery and specification pane | `docs/qa/responsive/tablet_product_details.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/cart` | Order summary side pane positioned correctly | `docs/qa/responsive/tablet_cart.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/checkout` | Two-column checkout layout (Inputs vs Summary) | `docs/qa/responsive/tablet_checkout.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/stores` | Showroom location card with directions button | `docs/qa/responsive/tablet_stores.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/try-at-home` | Wide form with clean padding and focus rings | `docs/qa/responsive/tablet_try_at_home.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/profile` | Address grid 2-across with default badge | `docs/qa/responsive/tablet_profile.png` | **VERIFIED PASS** |
| **Tablet** | 768 × 1024 | `/orders` | Order card with complete item list & tracker | `docs/qa/responsive/tablet_orders.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/` (Home) | Desktop header with search bar & category links | `docs/qa/responsive/laptop_home.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/products` | Left-hand filter sidebar + 4-column product grid| `docs/qa/responsive/laptop_products.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/product/1` | High-res image zoom, lens package picker | `docs/qa/responsive/laptop_product_details.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/cart` | Desktop cart table with subtotal summary pane | `docs/qa/responsive/laptop_cart.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/checkout` | Seamless dual checkout (COD / UPI QR + UTR) | `docs/qa/responsive/laptop_checkout.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/stores` | Ranchi showroom information with interactive map | `docs/qa/responsive/laptop_stores.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/try-at-home` | Professional booking portal layout | `docs/qa/responsive/laptop_try_at_home.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/profile` | Full profile overview & address manager | `docs/qa/responsive/laptop_profile.png` | **VERIFIED PASS** |
| **Laptop** | 1366 × 768 | `/orders` | Actionable buttons: Download Invoice & WhatsApp | `docs/qa/responsive/laptop_orders.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/` (Home) | Max-width container prevents ultra-wide stretch | `docs/qa/responsive/desktop_home.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/products` | Perfectly centered 4-column catalog layout | `docs/qa/responsive/desktop_products.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/product/1` | Centered product studio with specifications | `docs/qa/responsive/desktop_product_details.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/cart` | Balanced margins and clear itemized pricing | `docs/qa/responsive/desktop_cart.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/checkout` | Clean two-column checkout experience | `docs/qa/responsive/desktop_checkout.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/stores` | Showroom showcase layout | `docs/qa/responsive/desktop_stores.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/try-at-home` | Centered card layout with professional margins | `docs/qa/responsive/desktop_try_at_home.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/profile` | Balanced desktop user profile view | `docs/qa/responsive/desktop_profile.png` | **VERIFIED PASS** |
| **Desktop** | 1920 × 1080 | `/orders` | Clean list of historical orders with invoices | `docs/qa/responsive/desktop_orders.png` | **VERIFIED PASS** |

---

## 3. Complete Customer Journey & Workflow Verification (27 Test Cases)

| Workflow Area | Test Case Description | Executed Action & Request | Observed Backend / DB Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Registration** | Empty Payload Validation | `POST /api/auth/register/` with `{}` | HTTP 400: `{"error": "Username and password are required."}` | **VERIFIED PASS** |
| **Registration** | Invalid Indian Phone Format | `POST /api/auth/register/` with `mobile: "12345"` | HTTP 400: `{"error": "Please enter a valid 10-digit Indian mobile number..."}` | **VERIFIED PASS** |
| **Registration** | Privilege Escalation Guard | `POST /api/auth/register/` with `is_staff: true` | HTTP 400: `{"error": "Privilege escalation rejected..."}` | **VERIFIED PASS** |
| **Registration** | Valid Customer Registration | `POST /api/auth/register/` with valid test data | HTTP 201: Account created with hashed password in `auth_user` | **VERIFIED PASS** |
| **Registration** | Duplicate Registration Rejection | Repeated registration with same username/mobile | HTTP 400: `{"error": "Username already exists"}` | **VERIFIED PASS** |
| **Authentication** | Invalid Password Rejection | `POST /api/auth/login/` with wrong password | HTTP 401 Unauthorized: Invalid credentials rejected | **VERIFIED PASS** |
| **Authentication** | Valid SimpleJWT Token Issuance | `POST /api/auth/login/` with correct credentials | HTTP 200: Access token and Refresh token issued | **VERIFIED PASS** |
| **Authentication** | Token Refresh Endpoint | `POST /api/auth/refresh/` with valid refresh token | HTTP 200: New valid access token generated | **VERIFIED PASS** |
| **Authentication** | Customer Admin Block | `GET /admin/` while authenticated as Customer | Access denied: Non-staff redirected away from Admin portal | **VERIFIED PASS** |
| **Catalog** | Product Catalog Retrieval | `GET /api/products/` | HTTP 200: Full catalog returned with category and shape attributes | **VERIFIED PASS** |
| **Catalog** | Category Filter: Eyeglasses | `GET /api/products/?category=eyeglasses` | HTTP 200: Correctly filtered eyeglasses | **VERIFIED PASS** |
| **Catalog** | Category Filter: Sunglasses | `GET /api/products/?category=sunglasses` | HTTP 200: Correctly filtered sunglasses | **VERIFIED PASS** |
| **Catalog** | Category Filter: Computer Glasses | `GET /api/products/?category=computer_glasses` | HTTP 200: Correctly filtered blue-cut glasses | **VERIFIED PASS** |
| **Catalog** | Category Filter: Contact Lenses | `GET /api/products/?category=contact_lenses` | HTTP 200: Correctly filtered contact lenses with wear duration | **VERIFIED PASS** |
| **Shopping Cart** | Add to Cart with Single Vision | `POST /api/cart/` with `lens_package="single_vision"` | HTTP 201: Cart item saved with server-validated `lens_price=500.0` | **VERIFIED PASS** |
| **Shopping Cart** | Quantity Increment (Stock Limit) | `PATCH /api/cart/update/<id>/inc/` | HTTP 200: Quantity incremented; capped at available inventory | **VERIFIED PASS** |
| **Shopping Cart** | Quantity Decrement | `PATCH /api/cart/update/<id>/dec/` | HTTP 200: Quantity decremented cleanly | **VERIFIED PASS** |
| **Address Book** | Create Address with Default | `POST /api/addresses/` with `is_default=True` | HTTP 201: Address saved; sibling addresses de-defaulted | **VERIFIED PASS** |
| **Checkout (COD)** | Atomic Checkout Placement | `POST /api/checkout/` with `payment_method="COD"` | HTTP 201: Order created with `payment_status="UNPAID"`, cart cleared | **VERIFIED PASS** |
| **Order Tracking** | Customer Orders History | `GET /api/orders/` | HTTP 200: Customer's orders retrieved with visual status history | **VERIFIED PASS** |
| **Tax Invoice** | Dynamic ReportLab PDF Download | `GET /api/orders/<id>/invoice/` | HTTP 200: Valid PDF binary stream (`%PDF`) with Ranchi store address | **VERIFIED PASS** |
| **Media Security** | Protected Media Direct 403 Guard | `GET /media/prescriptions/dummy.pdf` | HTTP 403 Forbidden: Unauthenticated direct file harvesting blocked | **VERIFIED PASS** |
| **Payment (UPI)** | Missing UTR Rejection | `POST /api/checkout/` (UPI) with empty UTR | HTTP 400: `{"error": "Please enter a valid 10 to 22 character..."}` | **VERIFIED PASS** |
| **Payment (UPI)** | Short UTR Validation (<10 chars) | `POST /api/checkout/` (UPI) with `utr="12345"` | HTTP 400: Invalid format rejected | **VERIFIED PASS** |
| **Payment (UPI)** | Valid 12-Digit UTR Order | `POST /api/checkout/` (UPI) with valid UTR | HTTP 201: Order placed with `payment_status="PENDING_VERIFICATION"` | **VERIFIED PASS** |
| **Try @ Home** | Ranchi Doorstep Eye Visit Booking | `POST /api/home-visit/` with name, address, phone | HTTP 201: `HomeVisitRequest` record created in database | **VERIFIED PASS** |
| **Password Reset** | Token Request & Confirmation | `POST /api/auth/password-reset-request/` & confirm | HTTP 200: One-time token issued and new password updated | **VERIFIED PASS** |

---

## 4. Django Admin & RBAC Security Operations (4 Test Cases)

| Test Area | Policy Check | Verification Finding | Status |
| :--- | :--- | :--- | :---: |
| **Shop Owner Group** | Exactly 18 Business Permissions | Inspected `auth_group_permissions`: contains exactly 18 permissions across Product, Order, OrderItem, Invoice, Prescription, HomeVisitRequest, PaymentSettings, and UserProfile. | **VERIFIED PASS** |
| **User/Group Lockout** | Exclude Technical Administration | Shop Owner permissions contain zero `auth.User` and zero `auth.Group` permissions. `SecureUserAdmin` & `SecureGroupAdmin` return HTTP 403 for non-superusers. | **VERIFIED PASS** |
| **Financial Deletion Guard** | No Deletions on Audit Records | Shop Owner has no delete permissions on `Order`, `Invoice`, `Prescription`, or `OrderStatusHistory`. Django Admin enforces `has_delete_permission = False`. | **VERIFIED PASS** |
| **Stock Restoration Guard** | Atomic Single-Restore on Cancel | Tested order cancellation in `Order.save()`: stock restored by item quantity on first cancel; subsequent updates leave stock unchanged (`stock_restored=True`). | **VERIFIED PASS** |

---

## 5. Automated Regression Verification

* **Django Internal Test Suite:** `python3 manage.py test --noinput` ➡️ **42/42 tests passing in 15.817s**.
* **Django System Checks:** `python3 manage.py check` ➡️ **0 issues identified (0 silenced)**.
* **Frontend Production Build:** `npm run build` ➡️ **Successfully bundled `index-ckjyQCAw.css` (49K) and `index-sKJokySQ.js` (580K)**.
* **Database Migrations:** `python3 manage.py showmigrations` ➡️ **All 9 migrations applied cleanly (`[X]`)**.

---

## 6. Conclusion & Deployment Readiness

All 85 end-to-end browser and API integration test cases have passed without defects. The MAXVISION platform is robust, verified across 6 viewports, secured with 3-tier RBAC, protected against medical data leakage, and ready for commercial operation upon final store owner configuration.

