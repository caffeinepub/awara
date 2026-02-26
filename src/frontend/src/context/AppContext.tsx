import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product, CartItem, Order, CategoryConfig, Category } from "../types";
import { SAMPLE_PRODUCTS, CATEGORY_CONFIGS } from "../data/sampleProducts";

interface AppContextValue {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: CategoryConfig[];
  updateCategoryImage: (name: Category, imageUrl: string) => void;
  addCustomCategory: (name: string, emoji: string) => void;
  deleteCategory: (name: Category) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: string, customerName: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;

  // Admin
  isAdminLoggedIn: boolean;
  adminLogin: (passkey: string) => boolean;
  adminLogout: () => void;

  // UPI
  upiId: string;
  setUpiId: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const ADMIN_PASSKEY = "awara123";
const LS_PRODUCTS = "awara_products";
const LS_CART = "awara_cart";
const LS_ORDERS = "awara_orders";
const LS_ADMIN = "awara_admin";
const LS_CATEGORIES = "awara_categories";
const LS_UPI = "awara_upi";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(LS_PRODUCTS, SAMPLE_PRODUCTS)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(LS_CART, [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(LS_ORDERS, [])
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    loadFromStorage<boolean>(LS_ADMIN, false)
  );
  const [categories, setCategories] = useState<CategoryConfig[]>(() =>
    loadFromStorage<CategoryConfig[]>(LS_CATEGORIES, CATEGORY_CONFIGS)
  );
  const [upiId, setUpiIdState] = useState<string>(() =>
    loadFromStorage<string>(LS_UPI, "awara@upi")
  );

  useEffect(() => { saveToStorage(LS_PRODUCTS, products); }, [products]);
  useEffect(() => { saveToStorage(LS_CART, cartItems); }, [cartItems]);
  useEffect(() => { saveToStorage(LS_ORDERS, orders); }, [orders]);
  useEffect(() => { saveToStorage(LS_ADMIN, isAdminLoggedIn); }, [isAdminLoggedIn]);
  useEffect(() => { saveToStorage(LS_CATEGORIES, categories); }, [categories]);
  useEffect(() => { saveToStorage(LS_UPI, upiId); }, [upiId]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Product actions
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Category actions
  const updateCategoryImage = useCallback((name: Category, imageUrl: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, imageUrl } : c))
    );
  }, []);

  const addCustomCategory = useCallback((name: string, emoji: string) => {
    setCategories((prev) => [...prev, { name: name as Category, emoji }]);
  }, []);

  const deleteCategory = useCallback((name: Category) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  }, []);

  // Cart actions
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Order actions
  const placeOrder = useCallback(
    (paymentMethod: string, customerName: string): Order => {
      const order: Order = {
        id: `ORD${Date.now()}`,
        items: [...cartItems],
        total: cartTotal,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
        customerName,
      };
      setOrders((prev) => [order, ...prev]);
      setCartItems([]);
      return order;
    },
    [cartItems, cartTotal]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    },
    []
  );

  // Admin actions
  const adminLogin = useCallback((passkey: string): boolean => {
    if (passkey === ADMIN_PASSKEY) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
  }, []);

  const setUpiId = useCallback((id: string) => {
    setUpiIdState(id);
  }, []);

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        updateCategoryImage,
        addCustomCategory,
        deleteCategory,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        updateOrderStatus,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        upiId,
        setUpiId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
