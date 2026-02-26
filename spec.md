# AWARA

## Current State
AWARA is a frontend-only e-commerce app built with React + TypeScript + Tailwind CSS. It currently includes:
- Product listing with categories, search, and filters
- Shopping cart and checkout with mock payment (UPI QR, COD)
- Wishlist (no login required, stored in localStorage)
- Product reviews with star ratings (anyone can leave a review)
- Admin panel (passkey: awara123) with tabs: Products, Categories, Orders, Discounts, Occasions
- Discount management (percentage/fixed, per product or all, with expiry date)
- Free delivery threshold configurable by admin
- COD enable/disable toggle in admin
- Occasion theming (admin sets banner image + title + text + date range, auto-activates)
- UPI QR image upload by admin, shown at checkout with order total

State is stored entirely in localStorage via AppContext.

## Requested Changes (Diff)

### Add
1. **Timed Login Pop-up** -- Show a modal/banner at 0, 1, 3, and 7 minutes after the page loads. Message: "Sign in to save your cart and wishlist" with a dismiss button. Once dismissed in a session (sessionStorage), do not show again. Suppress entirely if admin is logged in (isAdminLoggedIn === true).

2. **Store Themes** -- 9 preset themes that the admin can switch from the admin panel. Each theme has a name + color preview swatch. The active theme applies CSS variables globally via a `data-theme` attribute on the `<html>` element. 

   Themes:
   - **Tokyo** (default/active) -- bg: #0d0d0d, primary: #ff2d78, accent: #00e5ff, text: #f0f0f0, card: #1a1a2e
   - **Minimal White** -- bg: #ffffff, primary: #111111, accent: #555555, text: #111111, card: #f9f9f9
   - **Diwali** -- bg: #1a0a00, primary: #ff9500, accent: #ffd700, text: #fff8e7, card: #2d1500
   - **Monsoon** -- bg: #0a1628, primary: #4da6ff, accent: #00e5b0, text: #e8f4ff, card: #102040
   - **Midnight** -- bg: #0a0a1a, primary: #8b5cf6, accent: #c4b5fd, text: #f5f3ff, card: #12122a
   - **Sakura** -- bg: #fff5f7, primary: #e91e8c, accent: #ffb3c6, text: #2d1b2e, card: #fff0f3
   - **Desert Sand** -- bg: #f5e6d3, primary: #c17f24, accent: #d4a96a, text: #3d2b1f, card: #fff8f0
   - **Ocean** -- bg: #001a2c, primary: #00b4d8, accent: #48cae4, text: #caf0f8, card: #003049
   - **Neon Mumbai** -- bg: #0f0f0f, primary: #ff4500, accent: #ffcc00, text: #ffffff, card: #1a1a1a

   Admin panel has a new "Themes" tab with name + color swatch preview for each theme. Active theme is persisted in localStorage.

3. **Support Section** -- A "Support" page accessible from the store's navigation. Customers see the support email set by admin. Admin can set/update the support email from the admin panel (new "Support" tab or within Store Settings).

### Modify
- **AppContext** -- Add `activeTheme` state (string, default "tokyo"), `setActiveTheme` function, `supportEmail` state (string), `setSupportEmail` function. Persist both in localStorage.
- **App.tsx** -- Add a `/support` route pointing to a new `SupportPage`.
- **AdminPage.tsx** -- Add two new tabs: "Themes" (theme switcher with swatches) and "Support" (admin sets support email). Also apply the active theme class/data attribute.
- **index.css or main entry** -- Define CSS variable sets for each theme under `[data-theme="tokyo"]`, `[data-theme="minimal-white"]`, etc. Update Tailwind to use these CSS variables so `bg-background`, `text-foreground`, `bg-primary`, etc. respond to the active theme.
- **main.tsx or App.tsx** -- On mount, set `document.documentElement.setAttribute('data-theme', activeTheme)` whenever `activeTheme` changes.

### Remove
- Nothing removed.

## Implementation Plan
1. Define 9 theme CSS variable sets in `index.css` under `[data-theme="..."]` selectors
2. Update `AppContext` to add `activeTheme`/`setActiveTheme` and `supportEmail`/`setSupportEmail` with localStorage persistence
3. Wire `activeTheme` to `document.documentElement.setAttribute('data-theme', ...)` in a `useEffect` at the AppProvider level
4. Add `TimedLoginPopup` component that tracks session dismissal and shows at 0/1/3/7 min intervals, suppressed when admin is logged in
5. Mount `TimedLoginPopup` in the root layout (App.tsx or AppProvider) so it runs on every page
6. Add `ThemesTab` component in AdminPage with 9 theme cards (name + color swatch preview + active indicator)
7. Add `SupportTab` component in AdminPage for admin to set support email
8. Add new "Themes" and "Support" tabs to the admin tab list
9. Create `SupportPage.tsx` with contact support display (support email, basic contact info)
10. Add `/support` route in `App.tsx`
11. Add "Support" link in the storefront navigation/footer

## UX Notes
- Tokyo theme is active by default -- the store should look dark/neon on first load
- Timed pop-up should be a non-intrusive bottom banner or centered modal with a clear dismiss X button
- Theme swatches in admin should show 3-4 color dots (bg, primary, accent) side by side for quick visual identification
- Support page should be minimal -- just the email address and a note to contact for help
- The timed pop-up should not appear on the admin page, only on storefront pages
