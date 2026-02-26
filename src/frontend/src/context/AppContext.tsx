import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product, CartItem, Order, CategoryConfig, Category, Review, Discount, Occasion } from "../types";
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

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  getProductReviews: (productId: string) => Review[];

  // Discounts
  discounts: Discount[];
  addDiscount: (discount: Omit<Discount, "id">) => void;
  removeDiscount: (id: string) => void;
  getEffectivePrice: (product: Product) => number;

  // Store settings
  codEnabled: boolean;
  setCodEnabled: (val: boolean) => void;
  freeDeliveryThreshold: number;
  setFreeDeliveryThreshold: (val: number) => void;

  // Occasions
  occasions: Occasion[];
  addOccasion: (occasion: Omit<Occasion, "id">) => void;
  updateOccasion: (id: string, updates: Partial<Occasion>) => void;
  deleteOccasion: (id: string) => void;
  getActiveOccasion: () => Occasion | null;

  // UPI QR Image
  upiQrImageUrl: string;
  setUpiQrImageUrl: (url: string) => void;

  // Theme
  activeTheme: string;
  setActiveTheme: (theme: string) => void;

  // Support
  supportEmail: string;
  setSupportEmail: (email: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const ADMIN_PASSKEY = "awara123";
const LS_PRODUCTS = "awara_products";
const LS_CART = "awara_cart";
const LS_ORDERS = "awara_orders";
const LS_ADMIN = "awara_admin";
const LS_CATEGORIES = "awara_categories";
const LS_UPI = "awara_upi";
const LS_WISHLIST = "awara_wishlist";
const LS_REVIEWS = "awara_reviews";
const LS_DISCOUNTS = "awara_discounts";
const LS_COD = "awara_cod";
const LS_FREE_DELIVERY = "awara_freedelivery";
const LS_OCCASIONS = "awara_occasions";
const LS_UPI_QR = "awara_upi_qr";
const LS_THEME = "awara_theme";
const LS_SUPPORT_EMAIL = "awara_support_email";

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
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadFromStorage<string[]>(LS_WISHLIST, [])
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage<Review[]>(LS_REVIEWS, [])
  );
  const [discounts, setDiscounts] = useState<Discount[]>(() =>
    loadFromStorage<Discount[]>(LS_DISCOUNTS, [])
  );
  const [codEnabled, setCodEnabledState] = useState<boolean>(() =>
    loadFromStorage<boolean>(LS_COD, true)
  );
  const [freeDeliveryThreshold, setFreeDeliveryThresholdState] = useState<number>(() =>
    loadFromStorage<number>(LS_FREE_DELIVERY, 399)
  );
  const [occasions, setOccasions] = useState<Occasion[]>(() =>
    loadFromStorage<Occasion[]>(LS_OCCASIONS, [])
  );
  const [upiQrImageUrl, setUpiQrImageUrlState] = useState<string>(() =>
    loadFromStorage<string>(LS_UPI_QR, "")
  );
  const [activeTheme, setActiveThemeState] = useState<string>(() =>
    loadFromStorage<string>(LS_THEME, "tokyo")
  );
  const [supportEmail, setSupportEmailState] = useState<string>(() =>
    loadFromStorage<string>(LS_SUPPORT_EMAIL, "")
  );

  useEffect(() => { saveToStorage(LS_PRODUCTS, products); }, [products]);
  useEffect(() => { saveToStorage(LS_CART, cartItems); }, [cartItems]);
  useEffect(() => { saveToStorage(LS_ORDERS, orders); }, [orders]);
  useEffect(() => { saveToStorage(LS_ADMIN, isAdminLoggedIn); }, [isAdminLoggedIn]);
  useEffect(() => { saveToStorage(LS_CATEGORIES, categories); }, [categories]);
  useEffect(() => { saveToStorage(LS_UPI, upiId); }, [upiId]);
  useEffect(() => { saveToStorage(LS_WISHLIST, wishlistIds); }, [wishlistIds]);
  useEffect(() => { saveToStorage(LS_REVIEWS, reviews); }, [reviews]);
  useEffect(() => { saveToStorage(LS_DISCOUNTS, discounts); }, [discounts]);
  useEffect(() => { saveToStorage(LS_COD, codEnabled); }, [codEnabled]);
  useEffect(() => { saveToStorage(LS_FREE_DELIVERY, freeDeliveryThreshold); }, [freeDeliveryThreshold]);
  useEffect(() => { saveToStorage(LS_OCCASIONS, occasions); }, [occasions]);
  useEffect(() => { saveToStorage(LS_UPI_QR, upiQrImageUrl); }, [upiQrImageUrl]);
  useEffect(() => { saveToStorage(LS_THEME, activeTheme); }, [activeTheme]);
  useEffect(() => { saveToStorage(LS_SUPPORT_EMAIL, supportEmail); }, [supportEmail]);

  // Apply theme to document root whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  // Discount helpers
  const getEffectivePrice = useCallback((product: Product): number => {
    const now = new Date().toISOString();
    const active = discounts.filter((d) => d.expiresAt > now);

    // Product-specific discount takes priority over "all"
    const specific = active.find((d) => d.productId === product.id);
    const allDiscount = active.find((d) => d.productId === "all");
    const discount = specific ?? allDiscount;

    if (!discount) return product.price;

    let discounted = product.price;
    if (discount.type === "percent") {
      discounted = product.price * (1 - discount.value / 100);
    } else {
      discounted = product.price - discount.value;
    }
    return Math.max(0, discounted);
  }, [discounts]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
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

  // Wishlist actions
  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  // Review actions
  const addReview = useCallback((review: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  }, []);

  const getProductReviews = useCallback(
    (productId: string) =>
      reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [reviews]
  );

  // Discount actions
  const addDiscount = useCallback((discount: Omit<Discount, "id">) => {
    const newDiscount: Discount = {
      ...discount,
      id: `disc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
    setDiscounts((prev) => [...prev, newDiscount]);
  }, []);

  const removeDiscount = useCallback((id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Store settings actions
  const setCodEnabled = useCallback((val: boolean) => {
    setCodEnabledState(val);
  }, []);

  const setFreeDeliveryThreshold = useCallback((val: number) => {
    setFreeDeliveryThresholdState(val);
  }, []);

  // Occasion actions
  const addOccasion = useCallback((occasion: Omit<Occasion, "id">) => {
    const newOccasion: Occasion = {
      ...occasion,
      id: `occ_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
    setOccasions((prev) => [...prev, newOccasion]);
  }, []);

  const updateOccasion = useCallback((id: string, updates: Partial<Occasion>) => {
    setOccasions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  }, []);

  const deleteOccasion = useCallback((id: string) => {
    setOccasions((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const getActiveOccasion = useCallback((): Occasion | null => {
    const today = new Date().toISOString().split("T")[0];
    return (
      occasions.find(
        (o) => today >= o.startDate && today <= o.endDate
      ) ?? null
    );
  }, [occasions]);

  // UPI QR Image actions
  const setUpiQrImageUrl = useCallback((url: string) => {
    setUpiQrImageUrlState(url);
  }, []);

  // Theme actions
  const setActiveTheme = useCallback((theme: string) => {
    setActiveThemeState(theme);
  }, []);

  // Support email actions
  const setSupportEmail = useCallback((email: string) => {
    setSupportEmailState(email);
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
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        reviews,
        addReview,
        getProductReviews,
        discounts,
        addDiscount,
        removeDiscount,
        getEffectivePrice,
        codEnabled,
        setCodEnabled,
        freeDeliveryThreshold,
        setFreeDeliveryThreshold,
        occasions,
        addOccasion,
        updateOccasion,
        deleteOccasion,
        getActiveOccasion,
        upiQrImageUrl,
        setUpiQrImageUrl,
        activeTheme,
        setActiveTheme,
        supportEmail,
        setSupportEmail,
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
