# AWARA

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Product listing page with sample products (no login required)
- Category filter bar: Household, Clothes, Bedsheet, Stickers, Toys, Mobile Covers, Other
- Shopping cart (accessible without login, but requires passkey/admin check)
- Mock checkout flow with UPI QR code display (static image/text)
- Admin panel protected by a passkey (hardcoded initially)
- Admin can add, edit, delete products
- Admin can manage categories (add/edit/delete with image upload)
- Sample products pre-loaded for each category
- Responsive layout suitable for mobile and desktop

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Set up React app with Tailwind CSS
2. Create data models: Product, Category, CartItem
3. Build sample data for all 7 categories
4. Build product listing page with category filter and search
5. Build product detail modal/page
6. Build shopping cart sidebar/page
7. Build mock checkout page with UPI QR code display
8. Build admin panel (passkey: "awara123") with:
   - Product management (add/edit/delete)
   - Category management (add/edit/delete with image)
9. Add routing between pages
10. Style with an Indian e-commerce aesthetic (warm colors, clean layout)

## UX Notes
- Default passkey for admin: "awara123"
- UPI QR code: display a placeholder QR image with a sample UPI ID
- No real authentication -- admin passkey is entered on a login screen
- Cart state persisted in localStorage
- Admin state persisted in localStorage (so products survive page refresh)
- Mobile-first design
- Clean, modern Indian e-commerce look (inspired by Meesho/Flipkart aesthetic)
