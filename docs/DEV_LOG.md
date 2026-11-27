# 📝 MAXVISION Optical - Developer Log (DEV_LOG)

---

## [Phase 1] Atomic Stock Deduction & Inventory Protection
**Date:** 2026-11-22  
**Branch:** `feature/checkout-core` (Local branch, no push)  
**Safety Backup:** `backups/db.sqlite3` aur `backups/media/`  

### 1. Kya Add / Edit Hua?
* **Race-Condition-Free Stock Deduction:**
  * `store/api_views.py` me `CheckoutAPI` ko `with transaction.atomic()` se wrap kiya.
  * Stock update conditional query se ho raha hai:
    `Product.objects.filter(pk=item.product_id, stock_quantity__gte=item.quantity).update(stock_quantity=F('stock_quantity') - item.quantity)`
  * Agar koi product out of stock hai ya 0 rows update hoti hain, to transaction instant rollback hoti hai, koi order create nahi hota, cart clear nahi hoti, aur HTTP 400 error return hota hai.
* **Server-Side Total Calculation:**
  * Order total amount strictly server DB se calculate hota hai (`sum(item.subtotal() for item in cart_items)`). Client ka bheja hua amount ignore hota hai.
* **Cancellation Par Stock Restoration (Sirf Ek Baar):**
  * `Order` model me `stock_restored = models.BooleanField(default=False)` add kiya.
  * `Order.save()` method me status `Cancelled` hone par har item ka stock wapas `+` ho jata hai aur `stock_restored = True` mark ho jata hai. Django admin se status change karne par bhi ye trigger hota hai.
* **Cart Stock Protection:**
  * `CartViewSet.create` aur `UpdateCartQuantity` me available stock check hota hai. Stock se zyada quantity add/increment hone par HTTP 400 error aata hai.
  * Khali cart par checkout request HTTP 400 reject karti hai.
* **Frontend Out-of-Stock Badges & Button Disabling:**
  * `Products.jsx`: Stock 0 hone par "Out of Stock" badge show hota hai (zero layout shift).
  * `ProductDetails.jsx`: Stock 0 par badge dikhta hai aur "Add to Cart" button disable ho kar "Currently Out of Stock" ban jata hai.
  * `Cart.jsx`: Cart me `+` button max stock par disable hota hai, aur out-of-stock items hone par "Proceed to Checkout" button disable ho jata hai.
* **Additive Migration:**
  * `store/migrations/0005_order_stock_restored.py` generate aur apply kiya gaya.

### 2. Files Modified / Created
* `store/models.py` (Added `stock_restored`, updated `save()`)
* `store/migrations/0005_order_stock_restored.py` (Additive migration)
* `store/api_views.py` (Atomic stock deduction, server-side pricing, cart stock checks)
* `store/admin.py` (Registered `stock_restored` in OrderAdmin)
* `store/serializers.py` (Added `stock_restored` field)
* `store/tests_stock_phase1.py` (6 comprehensive automated Django tests)
* `frontend/src/pages/Products.jsx` (Out-of-Stock badge)
* `frontend/src/pages/ProductDetails.jsx` (Out-of-Stock badge & disabled Add to Cart)
* `frontend/src/pages/Cart.jsx` (Stock warning, max stock button limits, disabled checkout)
* `.gitignore` (Added `backups/`)

### 3. Kaise Test Karein?
Run Django test suite:
```bash
source venv/bin/activate
python3 manage.py test store.tests_stock_phase1 -v 2
```
Output me 6/6 tests PASS aayenge:
1. `test_cancel_restores_stock_exactly_once` -> PASS
2. `test_empty_cart_rejected` -> PASS
3. `test_order_deducts_stock_atomically` -> PASS
4. `test_price_tampering_ignored` -> PASS
5. `test_stock_insufficient_order_fails` -> PASS
6. `test_two_items_one_fails_full_rollback` -> PASS

Frontend verification:
Browser me `http://localhost:5173/products` ya `http://localhost:5173/product/:id` open karke check karein.

### 4. Kaise Undo Karein?
Agar kabhi ye changes revert karne hon:
```bash
git checkout main
git branch -D feature/checkout-core
cp backups/db.sqlite3 db.sqlite3
```

---

## [Full Build] Stages 1 to 7 Implementation
**Date:** 2026-11-23 / 2026-11-24  
**Branch:** `feature/full-build` (Merged with Phase 1, strictly local commits)  
**Safety Backup Tag:** `backup-before-build`  
**Backups:** `backups/db.sqlite3_before_build` & `backups/media_before_build/`  

---

### Stage 1 (G1): Categories + Contact Lenses Support
* **Navbar Bug Fixed:** Eyeglasses aur Contacts par "No products found" bug trace kiya. Root cause: `category` param casing aur `contacts` slug mismatch tha. `ProductViewSet` me `category__iexact` filter lagaya aur `contacts` ko `contact_lenses` se map kiya. Case-insensitive search `q` aur `search` bhi add kiya.
* **Additive Model Fields:** `Product` model me 4 naye additive fields jode: `lens_type`, `wear_duration`, `pack_size`, `power_required`. Migration `0006_product_lens_type_product_pack_size_and_more.py` create aur apply hui.
* **Backend Ordering & Dynamic Filters:** Added ordering (`recommended`, `price_low`, `price_high`, `newest`, `discount`) aur dynamic filter options endpoint `/api/products/filter_options/`.
* **Category-Aware Listing Page:** `Products.jsx` ko category-aware banaya: Contact Lenses par Shape/Size filter chhip jaate hain, lens type/wear duration aate hain; breadcrumbs, dynamic counts, mobile filter drawer, image fallbacks aur zero layout shift ke sath.
* **Local Test Data:** Admin se 3 Contact Lens test products banaye (`[TEST]` prefix ke sath).
* **Commit:** `1a27ab3`

---

### Stage 2 (G2): Header Navigation, Search & Doorstep Booking
* **Search Bar & Navigation:** `Navbar.jsx` me search bar fix kiya: Enter key aur search icon par `/products?q=...` par navigate hota hai with Clear (X) button. Mobile hamburger menu responsive aur smooth hai.
* **Special Power Info Page:** `frontend/src/pages/SpecialPower.jsx` banaya jisme high-index, astigmatism/CYL, progressive lenses ki authentic jaankari, call aur WhatsApp buttons hain.
* **Try @ Home Service:** `HomeVisitRequest` model (`0007_homevisitrequest.py`), admin, serializer aur `/api/home-visit/` endpoint add kiya. `TryAtHome.jsx` par clean doorstep eye checkup booking form integrate kiya.
* **Commit:** `ba74f22`

---

### Stage 3 (G3): Footer Pages & Centralized Config
* **Central Config:** `frontend/src/config/siteConfig.js` me store details, authentic Ranchi address (`Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi`), phone numbers (`7485067874`, `7033353140`), UPI ID (`maxvision@upi`) ko centralize kiya.
* **8 Authentic Footer Pages:**
  1. `BuyingGuide.jsx` (Lenses & frame guide)
  2. `FrameSize.jsx` (Frame size measurements)
  3. `WeAreHiring.jsx` (Careers in Ranchi)
  4. `OurStory.jsx` (MaxVision optical legacy)
  5. `ContactUs.jsx` (Direct call, WhatsApp, store timings)
  6. `FAQs.jsx` (Genuine customer FAQs)
  7. `ReturnsExchanges.jsx` (Exchange policy)
  8. `Cancellation.jsx` (Order cancellation policy)
* **Floating WhatsApp Button:** Universal floating button `FloatingWhatsApp.jsx` banaya jo mobile par koi CTA button block nahi karta (`wa.me/917485067874`).
* **Commit:** `e95a752`

---

### Stage 4 (G4): Stores Page Overlap Fix
* **Badge Overlap Fixed:** `Stores.jsx` me "Flagship Store" / "Opening Soon" badge card title ke sath overlap ho raha tha. Flexbox responsive layout se wrap fix kiya, mobile aur PC par title poora saaf dikhta hai.
* **Store Contact:** Ranchi store ke dono numbers (`7485067874` aur `7033353140`) display kiye. Existing customer proof count (2500+) preserve kiya gaya.
* **Commit:** `d03e07d`

---

### Stage 5 (G5): Try-On Staff Permission Guard
* **Staff Access Only:** `VirtualTryOn.jsx` me "Owner Studio: Add Glasses Image" button aur glasses image upload modal ko `isStaff` (`user?.is_staff || user?.is_superuser`) ke pichhe secure kiya. Normal customers ko studio controls nahi dikhte.
* **Commit:** `014c37f`

---

### Stage 6 (G6): Responsive Polish
* **Universal Viewport Rules:** `frontend/src/index.css` me `html, body { overflow-x: hidden; width: 100%; }` enforce kiya.
* **44px Touch Targets:** `Cart.jsx` me quantity increase/decrease buttons ko `w-11 h-11` (44px) banaya. `ProductDetails.jsx`, `Wishlist.jsx` me action buttons ko `min-h-[44px]` touch target compliant kiya.
* **Build Stability:** `.browserslistrc` add karke build pipeline optimize kiya.
* **Commit:** `eb13bd3`

---

### Stage 7 (Phase 2): Checkout Features (Payment, Prescription, Delivery)
* **Additive Order Fields & History:**
  * `Order` model me `payment_method` (`COD`, `UPI`), `payment_status` (`UNPAID`, `PENDING_VERIFICATION`, `PAID`), `utr_number`, `delivery_type` (`DELIVERY`, `PICKUP`), `delivery_charge` (default 0.0), aur `prescription` foreign key add kiya.
  * Additive model `OrderStatusHistory` add kiya jo har status change aur note record karta hai.
  * Migration `0008_order_delivery_charge_order_delivery_type_and_more.py` apply hui.
* **Backend Validation:**
  * Manual prescription SPH/CYL -10 to +10 in 0.25 steps.
  * CYL present hone par AXIS (1-180°) compulsory.
  * Pupillary distance (PD) 50-80mm.
  * UPI payment me 12-digit UTR compulsory.
  * Free store pickup at Ranchi store (`Shop 4, Sheetal Tower...`).
* **Admin Features:**
  * `OrderStatusHistoryInline` order detail ke andar show hota hai.
  * Order list me payment method, payment status, delivery type aur UTR number display hote hain.
  * Admin Action: `Mark selected orders as Paid` (payment status ko PAID karta hai aur history log karta hai).
* **Frontend Checkout:**
  * Step-by-step layout: Delivery option (Home Delivery vs Store Pickup), Contact, Prescription (None / File / Manual OD-OS table), Payment (COD vs UPI with QR/VPA and UTR input).
  * Out-of-stock server errors and validation errors clean alerts ke sath display hote hain.
  * `Orders.jsx` me order list par payment method, delivery mode aur submitted prescription power display hoti hai.
* **Commit:** `4335a6b`

---

### 📋 Store Owner Se Confirm Karne Wali Cheezein (Pending Confirmation)
1. **Actual UPI ID / QR:** Abhi placeholder `maxvision@upi` use kiya hai. Store owner se unka official UPI ID / merchant QR lena hai.
2. **Social Media URLs:** Facebook, Instagram, Twitter, YouTube links `siteConfig.js` me placeholder hain. Owner se official handles lene hain.
3. **Exact Return / Exchange Days Window:** Policy pages me generic safe language rakhi hai, bina kisi fake "7 din ya 14 din" claim ke. Owner se actual exchange timeline confirm karni hai.
4. **Delivery Charge Policy:** Abhi Ranchi aur pan-India free delivery (`0.0`) set hai. Agar kisi specific pincode ya order value ke neeche delivery charge lagana hai to owner se confirm karein.
5. **Upcoming Store Locations:** `Stores.jsx` me opening soon locations (Dhanbad, Jamshedpur etc.) verify karwani hain.



---

## [Final Build] Stages 8A, 8B, 9 & 10 Implementation
**Date:** 2026-11-24  
**Branch:** `feature/full-build` (Strictly local commits, no push)  

---

### Stage 8A: Dual Payment (COD + Manual UPI QR) & WhatsApp Confirmation
* **Dual Payment System:**
  * Cash on Delivery (COD) remains active with safe atomic stock deduction.
  * Manual UPI QR payment model `StorePaymentSettings` added as an additive singleton with `upi_id`, `display_name`, `qr_image`, and `upi_enabled`.
  * When `upi_enabled=False` or QR is unuploaded, the UPI option is automatically hidden from customer checkout. No placeholder or fake UPI QR is displayed.
  * Desktop displays store QR code, UPI ID, and copy button. Mobile displays native `upi://pay` deep link.
* **UTR Number Submission & Validation:**
  * Customer submits 10-22 character alphanumeric UTR number.
  * Server enforces uniqueness check across all orders. Submitting duplicate UTR is rejected with a clear HTTP 400 error.
  * Submitting UTR marks order payment status as `PENDING_VERIFICATION` (not `PAID`).
* **WhatsApp Order Confirmation:**
  * Direct WhatsApp confirmation button opens `wa.me/917485067874?text=...` with order ID, customer name, mobile, address, total amount, and payment method.
  * Medical prescriptions and sensitive values are excluded from the prefilled link.
  * URL length is strictly constrained under 1500 characters.
  * Added direct "WhatsApp par poochho" button to `ProductDetails.jsx`.
* **Payment Audit Fields:**
  * Additive fields on `Order`: `payment_verified_by` (ForeignKey to User) and `payment_verified_at` (DateTimeField).
  * Admin action `Mark selected orders as Paid` automatically sets these fields and logs to `OrderStatusHistory`.

---

### Stage 8B: Shop Operations, Invoice, Profile & Address Book
* **ReportLab PDF Invoice:**
  * `store/utils.py` generates authentic binary PDF invoices via ReportLab.
  * Features store branding, Ranchi address (`Shop 4, Sheetal Tower...`), dual phone numbers, invoice number, items, lens charges, delivery charges, and payment status.
  * GSTIN and legal name are conditionally included only when configured via settings or `.env`.
  * Authenticated endpoint `/api/orders/<pk>/invoice/` restricts downloads to order owners or staff.
* **Customer Profile & Address Book:**
  * `frontend/src/pages/Profile.jsx` allows customers to update personal information (first name, last name, email, mobile).
  * Additive model `Address` with multi-address management, default delivery address selection, and delete capabilities.
  * Object-level permissions isolate customer address data.
* **Forgot Password Flow:**
  * Integrated with Django's built-in `default_token_generator` via `/api/auth/password-reset/` and `/api/auth/password-reset/confirm/`.
  * Local console email backend logs reset links without exposing credentials.
  * Added "Forgot Password?" link to `Login.jsx` and created `ForgotPassword.jsx` and `ResetPassword.jsx`.
* **Registration Mobile Validation:**
  * Enforces 10-digit Indian mobile numbers starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`).
* **Admin Dashboard & Filters:**
  * ProductAdmin includes `LowStockFilter` (`stock_quantity <= 5`).
  * OrderAdmin includes `PendingUPIVerification24hFilter`.
  * `/api/admin/dashboard-stats/` provides total orders, today's orders, pending count, total revenue, and low-stock product count.

---

### Stage 9: Production Settings & Security Hardening
* **Environment Configuration:**
  * `ecommerce2/settings.py` loads `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `DATABASE_URL` from environment variables with safe dev defaults.
  * In production (`DEBUG=False`), insecure or default dev secret keys raise `ImproperlyConfigured`.
  * SSL redirect, secure cookies (`SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`), and HSTS headers enforced when `DEBUG=False`.
  * `CORS_ALLOW_ALL_ORIGINS = DEBUG`. Whitelisted origins enforced in production.
* **Rate Throttling:**
  * DRF throttles configured: `anon` (200/day), `user` (1000/day), `auth` (30/min), `checkout` (20/min).
* **Upload & File Security:**
  * Prescription uploads validated on server: max 5 MB, allowed types restricted to `.pdf`, `.jpg`, `.jpeg`, and `.png`.
  * Authenticated endpoint `/api/orders/<pk>/prescription/` restricts prescription downloads to order owners and staff.
  * Production prescription storage note: in production, prescriptions should be served from private cloud storage (e.g. AWS S3 with signed pre-authenticated URLs) rather than public web server directories.
* **Health Check API:**
  * `GET /api/health/` verifies database connectivity and returns operational status.
* **Config Files:**
  * Created comprehensive `.env.example` template with zero hardcoded secrets.
  * Local `.env` configured for seamless development.

---

### Stage 10: Pre-Deploy Full Verification
* **Automated Tests:**
  * 16/16 tests passing across `tests_stage8a`, `tests_stage8b`, `tests_stage9`, and `tests_concurrency`.
* **Concurrency & Race Condition:**
  * Atomic stock reduction via conditional queries verified.
  * Simultaneous checkouts on last inventory item tested: one order succeeds (201), second fails (400) with automatic rollback.
  * Idempotent cancellation restores inventory exactly once.
* **Zero Deletion Compliance:**
  * `git diff --diff-filter=D --name-only` produced 0 files.
  * `git diff -U0 | grep -E '^-\s*(def |class |function |export |const [A-Z])'` produced 0 lines.
* **Documentation:**
  * Created `docs/PREDEPLOY_QA.md` with complete verification matrix.

---

### 📋 Store Owner Confirmation List (Pending Real Business Details)
*The following items use development placeholders or generic safe defaults and must be confirmed by the store owner before production launch:*
1. **Asli Business UPI ID & Merchant QR:** Upload official merchant QR image in Django Admin under `Store Payment Settings` and configure UPI ID (e.g. `7485067874@ptyes`).
2. **Merchant / Account Name:** Verify merchant name displayed during UPI payments (e.g. "MAXVISION Optical").
3. **Delivery Charges & Serviceable Areas:** Confirm whether delivery is free across Ranchi or if specific delivery zones/charges apply.
4. **Store Pickup Instructions:** Confirm operating hours for in-store pickup at Ranchi flagship store (`Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi`).
5. **Return / Exchange Policy Window:** Confirm official return/exchange window (e.g. 7 days or 14 days) and condition requirements.
6. **GSTIN & Registered Legal Entity:** Provide authentic GSTIN and legal business name for inclusion in ReportLab PDF invoices.
7. **Social Media Profiles:** Provide official Instagram, Facebook, Twitter, and YouTube URLs.
8. **'Opening Soon' Locations:** Verify upcoming retail branches (Daily Market, Over Bridge, Argora, Harmu, Jamshedpur, Dhanbad).
9. **'2500+ Happy Customers' Claim:** Verify marketing testimonial claim.
10. **Doorstep Optical Staffing:** Confirm staffing and equipment availability for "Try @ Home" doorstep optical requests.
11. **Contact Lens Catalog:** Provide authentic contact lens inventory list, brands, pricing, and packaging details.
12. **Daily Payment Verification Workflow:** Establish store staff procedure for reviewing and marking verified UPI orders as "Paid" in Django Admin.

---

## [Stage 11] Final Role-Based Access Control (RBAC) Architecture
**Date:** 2026-11-24  
**Branch:** `feature/full-build` (Strictly local commits, no push)  

### 1. Three-Tier Account Architecture Implemented
* **Developer (Superuser):** Complete technical governance, user management, migrations, configuration, and emergency account recovery.
* **Shop Owner (`Shop Owner` Group, `is_staff=True`, `is_superuser=False`):** Exactly one designated active owner account with business-only management permissions (catalog, stock, orders, status updates, UPI verification, invoices, Try @ Home, and fulfillment contact info). Strictly forbidden from user/group management, role tampering, and deleting critical records (`Order`, `Invoice`, `Prescription`, `OrderStatusHistory`).
* **Customer (`is_staff=False`, `is_superuser=False`):** Complete e-commerce features with strict object-level isolation derived from `request.user`. Forbidden from admin access and modifying another customer's data or platform financial/inventory fields.

### 2. Management Commands
* `store/management/commands/setup_roles.py`: Idempotently creates the `Shop Owner` group with 18 audited business permissions, omitting delete rights on critical models and omitting all `auth.*` permissions.
* `store/management/commands/create_shop_owner.py`: Interactively collects credentials via `getpass`, enforces the single designated active shop-owner account constraint, sets `is_staff=True, is_superuser=False`, attaches the user to the `Shop Owner` group, and supports safe account rotation (`--rotate`).

### 3. Media & Admin Hardening
* `store/media_views.py:protected_media_serve`: Guards customer prescriptions (`/media/prescriptions/`) and invoices against direct public/anonymous URL access with HTTP 403 Forbidden. Authorized access routed via `/api/orders/<pk>/prescription/` and `/api/orders/<pk>/invoice/`.
* `store/admin.py`: Registered `SecureUserAdmin` and `SecureGroupAdmin` overriding `has_module_permission` to restrict `auth.User` and `auth.Group` strictly to `is_superuser`. Added `has_delete_permission` returning `False` for non-superusers on `OrderAdmin`, `InvoiceAdmin`, `PrescriptionAdmin`, and `OrderStatusHistoryAdmin`.
* `store/api_views.py`: Added strict customer registration guard rejecting any injection of `is_staff`, `is_superuser`, or `groups`.

### 4. Verification Evidence
* Ran `python3 manage.py test store.tests_stage8a store.tests_stage8b store.tests_stage9 store.tests_concurrency store.tests_stage11_rbac --noinput`: **All 29 tests PASSED in 13.131s**.
* Ran `python3 manage.py check`: **0 issues identified (0 silenced)**.


---

## [Stage 12] Product Details Overhaul, Hyperlocal Pincode Enforcement & Checkout Hardening
**Date:** 2026-11-24  
**Branch:** `feature/full-build` (Strictly local commits, no push)  

### 1. Product Details Image Resolution & Container Architecture
* **Django Media Resolution:** Updated `ProductSerializer` in `store/serializers.py` so that `image` and `image_url` always resolve to full absolute URLs (`http://127.0.0.1:8000/media/...`) or clean Unsplash fallbacks. Eliminated relative media path 404s and dead third-party image URLs.
* **Responsive Visual Container:** In `frontend/src/pages/ProductDetails.jsx`, refactored the image layout with `min-h-[300px]`, sticky top centering, and multi-tier image fallback (`getProductImage`), preventing layout collapse when images load asynchronously.
* **Title Truncation Fix:** Implemented `leading-tight break-words text-xl sm:text-2xl lg:text-3xl font-bold text-[#000042]` to completely eliminate title clipping on narrow mobile viewports.

### 2. Hyperlocal Delivery Pincode Enforcement (834001 & 834002 Only)
* **Backend Validation:**
  * `store/serializers.py:AddressSerializer`: Added `validate_pincode` enforcing that `pincode` must be exactly `"834001"` or `"834002"`. Any other pincode (e.g., `110001`, `700001`) is rejected with HTTP 400 Bad Request.
  * `store/api_views.py:CheckoutAPI`: Added backend validation on `pincode` and regex extraction on address string during delivery checkout. Prevents API bypass and enforces that delivery is strictly restricted to Ranchi pincodes `834001` and `834002`. In-store pickup at Ranchi flagship store remains open to all pincodes.
* **Frontend Synchronization:**
  * `frontend/src/config/siteConfig.js`: Configured `allowedPincodes: ["834001", "834002"]`.
  * `frontend/src/pages/ProductDetails.jsx`: Pincode checker validates against `834001` and `834002` with immediate visual feedback (green confirmation vs red error banner).
  * `frontend/src/pages/Cart.jsx`: Added prominent Ranchi delivery notice (`834001` & `834002`).
  * `frontend/src/pages/Checkout.jsx`: Enforced pre-flight check blocking delivery placement if address pincode is outside `834001` / `834002`.
  * `frontend/src/pages/Profile.jsx`: Address creation form validates strictly for `834001` and `834002`.

### 3. CTA Streamlining & WhatsApp Policy
* **Product Details:** Completely removed "WhatsApp par poocho" button from `ProductDetails.jsx`. Replaced with distinct, full-width `Add to Cart` and `Buy Now` actions.
* **Preserved Integrations:** All authorized WhatsApp features (floating bottom-right widget, footer contact, post-checkout confirmation links, invoice share) remain intact.

### 4. Test Suite & Build Verification
* Created `store/tests_product_delivery.py` (6 tests covering pincode rejection, Ranchi acceptance, pickup flexibility, and serializer absolute image URLs).
* Ran complete test suite: **48 tests passed (0 failures, 0 errors) in 15.2s**.
* Ran `python3 manage.py check`: **0 issues identified**.
* Verified responsive layout across 7 device viewports (320px, 375px, 430px, 768px, 1024px, 1366px, 1920px) with zero horizontal overflow.


---

## [Stage 13] Homepage "Premium Eye Care Services" Navigation & Card Renaming
**Date:** 2026-11-27  
**Branch:** `feature/full-build` (Strictly local commits, no push)  

### 1. Card Linking & Navigation Architecture
* **Visit Store Card:** Wrapped with React Router `<Link to="/stores">` ensuring seamless client-side navigation to the MAXVISION Store Locator (`/stores`) identical to clicking "STORES" in the desktop navigation header.
* **Home Visit Card:** Wrapped with React Router `<Link to="/try-at-home">` directing users straight to the "Book Free Try @ Home" booking workflow (`/try-at-home`).
* **Try Virtual Card:**
  * Renamed card title from "Online Test" to **"Try Virtual"**.
  * Wrapped with React Router `<Link to="/try-on">` directing users directly to the Real Photographic 3D Virtual Mirror experience (`/try-on`).

### 2. Interaction & Visual Consistency
* Maintained full hover elevation (`whileHover={{ y: -10 }}`), interactive cursor (`cursor-pointer`), arrow icon hover animations, and zero-layout-shift container styling (`h-full`).

### 3. Verification & Compliance
* Live DOM verified via Chrome: all three cards render valid `<a class="block focus:outline-none" href="...">` anchors with exact corresponding routes.
* Django test suite passed: `48/48 tests PASS`.
* System check clean: `0 issues identified`.
* Zero deletions: strictly additive linking, no existing components or features removed.

---

## [Stage 14] Public Catalog JWT Decoupling & Test Suite Throttling Isolation
**Date:** 2026-11-27  
**Branch:** `feature/full-build` (Strictly local commits, no push)  

### 1. Root Cause & Architecture Fix
* **Problem:** When customers with expired/stale tokens visited public product endpoints (`GET /api/products/`), DRF SimpleJWT's default authenticator attempted token validation before permission evaluation, returning HTTP 401 Unauthorized and resulting in an empty catalog.
* **Backend Decoupling (`store/api_views.py`):**
  * Created `OptionalJWTAuthentication(JWTAuthentication)` that catches `InvalidToken` and authentication errors on public endpoints, gracefully falling back to `None` (`AnonymousUser`) instead of terminating with HTTP 401.
  * Applied `OptionalJWTAuthentication` and `permission_classes = [permissions.AllowAny]` to `ProductViewSet`, `PaymentSettingsAPI`, and `HealthCheckAPI`.
* **Frontend Resilience (`frontend/src/api/axios.js`):**
  * Added response interceptor for HTTP 401 to refresh tokens or clean up stale session data and automatically retry public read requests without invalid authorization headers.
* **Test Isolation (`store/tests_stock_phase1.py`):**
  * Isolated DRF `ScopedRateThrottle` during unit tests by overriding `CheckoutAPI.throttle_classes` in `setUpClass` and restoring in `tearDownClass`, ensuring deterministic test execution without 429 rate limit errors.

### 2. Verification & Compliance
* `python3 manage.py test`: **48/48 tests PASS (0 failures, 0 errors)** in 16.5s.
* `python3 manage.py check`: **0 issues identified**.
* Live Endpoints verified:
  * Backend: `http://localhost:8000/api/health/` -> HTTP 200 OK
  * Public Products: `http://localhost:8000/api/products/` -> HTTP 200 OK (30 products loaded)
  * Frontend: `http://localhost:5173/` -> HTTP 200 OK
* Zero deletions verified: `git diff --diff-filter=D --name-only` returns 0 files.
