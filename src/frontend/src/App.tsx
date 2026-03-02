import React from "react";
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { AppProvider, useApp } from "./context/AppContext";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AdminPage } from "./pages/AdminPage";
import { WishlistPage } from "./pages/WishlistPage";
import { SupportPage } from "./pages/SupportPage";
import { CustomOrdersPage } from "./pages/CustomOrdersPage";
import { CustomClothesPage } from "./pages/CustomClothesPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { MaintenancePage } from "./pages/MaintenancePage";
import { TimedLoginPopup } from "./components/TimedLoginPopup";

// Guard that shows maintenance page for non-admin routes when site is in maintenance
function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { maintenanceMode } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");

  if (maintenanceMode.active && !isAdminRoute) {
    return <MaintenancePage />;
  }
  return <>{children}</>;
}

// Wrapper that conditionally renders the timed popup (not on /admin)
function RootLayout() {
  return (
    <AppProvider>
      <InnerLayout />
    </AppProvider>
  );
}

function InnerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname === "/admin";

  return (
    <MaintenanceGuard>
      <Outlet />
      {!isAdminRoute && <TimedLoginPopup />}
    </MaintenanceGuard>
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

const customOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/custom-orders",
  component: CustomOrdersPage,
});

const customClothesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/custom-clothes",
  component: CustomClothesPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-orders",
  component: MyOrdersPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  cartRoute,
  checkoutRoute,
  adminRoute,
  wishlistRoute,
  supportRoute,
  customOrdersRoute,
  customClothesRoute,
  myOrdersRoute,
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
