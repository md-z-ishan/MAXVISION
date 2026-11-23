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

