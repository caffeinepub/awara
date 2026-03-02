# AWARA

## Current State
AWARA is a frontend-only e-commerce app (React + TypeScript + localStorage) with:
- Product listing, cart, checkout with mock UPI/COD/card payment
- Admin panel (passkey: awara123) with tabs: Products, Categories, Discounts, Occasions, Orders, Themes, Support, Custom Orders, Maintenance
- Wishlist (local), reviews (anonymous), notification bell
- Occasion theming (auto-activates by date), 9 theme presets (Tokyo default)
- Custom Orders section (image upload, description, quote flow, QR payment)
- Maintenance mode (passkey-protected toggle)
- Per-product COD badge and out-of-stock toggles
- Timed login pop-ups (0/1/3/7 min)
- Support page with admin email config
- Order model: { id, items, total, status, paymentMethod, createdAt, customerName }

## Requested Changes (Diff)

### Add
1. **Order Cancellation** -- Customer can request cancellation of their order from a "My Orders" page/section. Admin sees cancellation requests in the Orders tab and can approve or deny them.
2. **Enhanced Order Data** -- Orders now store: customerName, contact (phone), deliveryAddress, orderDate (already have createdAt). Admin sees this in the Orders table (expandable row or detail view).
3. **Custom Clothes Section** -- New page `/custom-clothes` replacing `/custom-orders`. Shows 4 clothing items (Half Sleeve T-shirt, Full Sleeve T-shirt, Hoodie, Women's Full Sleeve T-shirt) each with a white product image. Color selector (Amazon-style swatches) below each item. Admin sets base cost + price per color for each clothing type. Customer picks item + color, uploads a custom design image (via "+" button, visible to admin only), submits. Admin reviews in admin panel, sets final price, and the customer sees a QR code for that exact amount.
4. **Admin Clothes Config** -- New tab in Admin Panel: "Clothes" -- admin sets base cost + color options (name + price) per clothing type. Admin can add/remove colors, set per-color price.
5. **Custom Clothes Orders** -- New order type in admin panel showing: clothing type, color selected, base cost, customer uploaded image (private to admin), customer contact info. Admin sets final price → customer sees QR with that amount.
6. **Complaint Box** -- On the HomePage (front page), a "Complaint Box" section with a form: customer name + message. Submitted complaints go to admin panel (Complaints tab) privately. Admin can reply to any complaint. Once admin replies, the complaint + reply is shown publicly on the homepage (with customer name visible).
7. **Admin Complaints Tab** -- New tab in Admin Panel showing all complaints. Each shows: customer name, message, date, reply status. Admin can type and submit a reply per complaint. Replied complaints show the reply text.
8. **No payment hold** -- Remove "payment is held until approval" messaging. Orders are placed and payment is considered complete immediately. Admin sees the order info but does NOT approve/deny payment. Remove Approve/Deny buttons from Orders tab in admin panel.
9. **My Orders page** -- Simple page `/my-orders` for customers to view their orders (by session), see status, and request cancellation.

### Modify
- **Order type** -- Add fields: `contact: string`, `deliveryAddress: string`. Already has `customerName` and `createdAt`.
- **placeOrder function** -- Accept `contact` and `deliveryAddress` in addition to existing params.
- **CheckoutPage** -- Pass phone + address to `placeOrder`. Update success message to remove "payment held" language.
- **Admin Orders Tab** -- Show full order detail (name, contact, address, date, items, payment method, total). Remove Approve/Deny buttons. Add cancellation approval/deny for orders with `cancellationRequested: true`.
- **App.tsx** -- Replace `/custom-orders` route with `/custom-clothes`. Add `/my-orders` route.
- **Header/Footer** -- Replace "Custom Orders" link with "Custom Clothes". Add "My Orders" link.
- **CustomOrdersPage** -- Replaced by CustomClothesPage entirely.
- **AppContext** -- Add complaint state, custom clothes order state, update Order type, add cancellation request support.
- **Types** -- Update Order interface. Add Complaint, ClothingConfig, ClothingOrder interfaces.

### Remove
- **CustomOrdersPage.tsx** -- Replaced by CustomClothesPage
- **"Payment held until approval" messaging** -- Remove from checkout success screen and admin panel
- **Approve/Deny payment buttons** in admin Orders tab -- Remove (keep cancellation approve/deny)

## Implementation Plan
1. Update `types/index.ts` -- add `contact`, `deliveryAddress`, `cancellationRequested` to Order; add Complaint, ClothingConfig, ClothingOrder types
2. Update `AppContext.tsx` -- add complaint state/actions, clothingOrders state/actions, update placeOrder signature, add cancellation request action
3. Generate white clothing images (4 types)
4. Update `CheckoutPage.tsx` -- pass phone+address to placeOrder, update success message
5. Create `CustomClothesPage.tsx` -- 4 clothing items with color swatches, + upload button, submit flow with QR display after admin quotes price
6. Create `MyOrdersPage.tsx` -- shows session orders, cancel request button
7. Update `AdminPage.tsx` -- add Clothes Config tab, Complaints tab; update Orders tab (full detail view, cancellation actions, remove approve/deny payment); add ClothingOrders section
8. Update `App.tsx` -- swap routes
9. Update `Header`/`Footer` -- swap nav links
10. Update `HomePage.tsx` -- add Complaint Box section at bottom

## UX Notes
- Clothing color swatches: small colored circles (like Amazon) below the product image, selected swatch gets a ring/checkmark
- Custom design upload "+" button is positioned beside/overlaid on the clothing image area
- After admin sets final price for a clothing order, customer sees UPI QR + "Pay ₹X" on the Custom Clothes page under their order
- Complaints on homepage show in a clean card list below the complaint form -- public once admin replies
- "My Orders" is a lightweight page, no login required -- uses sessionStorage to identify orders by this user
- Order success page: clean confirmation, no "admin approval" or "payment held" language -- just "Order placed! We'll ship it soon."
- Admin Orders tab: each row expands or has a detail panel showing full customer info
