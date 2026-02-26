import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { AppProvider } from "./context/AppContext";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AdminPage } from "./pages/AdminPage";
import { WishlistPage } from "./pages/WishlistPage";
import { SupportPage } from "./pages/SupportPage";
import { TimedLoginPopup } from "./components/TimedLoginPopup";

// Wrapper that conditionally renders the timed popup (not on /admin)
function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname === "/admin";

  return (
    <AppProvider>
      <Outlet />
      {!isAdminRoute && <TimedLoginPopup />}
    </AppProvider>
  );
}

// Root layout route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Page routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: SupportPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  cartRoute,
  checkoutRoute,
  adminRoute,
  wishlistRoute,
  supportRoute,
]);

// Router
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
