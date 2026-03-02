import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product, CartItem, Order, CategoryConfig, Category, Review, Discount, Occasion, CustomOrderRequest, AppNotification, MaintenanceMode, Complaint, ClothingConfig, ClothingOrder } from "../types";
import { SAMPLE_PRODUCTS, CATEGORY_CONFIGS } from "../data/sampleProducts";

// Generate or retrieve persistent session ID
function getOrCreateSessionId(): string {
  const key = "awara_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

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
  placeOrder: (paymentMethod: string, customerName: string, contact: string, deliveryAddress: string) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  requestCancellation: (orderId: string) => void;
  updateCancellationStatus: (orderId: string, status: "approved" | "denied") => void;

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

  // Custom Orders
  customOrders: CustomOrderRequest[];
  submitCustomOrder: (order: Omit<CustomOrderRequest, "id" | "status" | "createdAt" | "customerSessionId">) => void;
  updateCustomOrderStatus: (id: string, status: "accepted" | "rejected", quotedPrice?: number) => void;
  getMyCustomOrders: () => CustomOrderRequest[];

  // Notifications
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;

  // Maintenance
  maintenanceMode: MaintenanceMode;
  setMaintenanceMode: (active: boolean, message: string) => void;

  // Complaints
  complaints: Complaint[];
  submitComplaint: (name: string, message: string) => void;
  replyToComplaint: (id: string, reply: string) => void;
  getPublicComplaints: () => Complaint[];

  // Clothing configs
  clothingConfigs: ClothingConfig[];
  updateClothingConfig: (id: string, updates: Partial<ClothingConfig>) => void;

  // Clothing orders
  clothingOrders: ClothingOrder[];
  submitClothingOrder: (order: Omit<ClothingOrder, "id" | "status" | "createdAt" | "customerSessionId">) => void;
  updateClothingOrderStatus: (id: string, status: ClothingOrder["status"], quotedPrice?: number) => void;
  getMyClothingOrders: () => ClothingOrder[];
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
const LS_CUSTOM_ORDERS = "awara_custom_orders";
const LS_NOTIFICATIONS = "awara_notifications";
const LS_MAINTENANCE = "awara_maintenance";
const LS_COMPLAINTS = "awara_complaints";
const LS_CLOTHING_CONFIGS = "awara_clothing_configs";
const LS_CLOTHING_ORDERS = "awara_clothing_orders";

const DEFAULT_CLOTHING_CONFIGS: ClothingConfig[] = [
  {
    id: "half-sleeve",
    name: "Half Sleeve T-Shirt",
    imageUrl: "/assets/generated/half-sleeve-tshirt-white-transparent.dim_400x400.png",
    baseCost: 299,
    colors: [
      { color: "Black", hex: "#1a1a1a", extraPrice: 0 },
      { color: "Navy", hex: "#1a237e", extraPrice: 0 },
      { color: "Red", hex: "#e53935", extraPrice: 20 },
      { color: "Green", hex: "#388e3c", extraPrice: 20 },
      { color: "Yellow", hex: "#fdd835", extraPrice: 30 },
    ],
  },
  {
    id: "full-sleeve",
    name: "Full Sleeve T-Shirt",
    imageUrl: "/assets/generated/full-sleeve-tshirt-white-transparent.dim_400x400.png",
    baseCost: 349,
    colors: [
      { color: "Black", hex: "#1a1a1a", extraPrice: 0 },
      { color: "Navy", hex: "#1a237e", extraPrice: 0 },
      { color: "Maroon", hex: "#880e4f", extraPrice: 20 },
      { color: "Olive", hex: "#827717", extraPrice: 20 },
      { color: "Grey", hex: "#757575", extraPrice: 0 },
    ],
  },
  {
    id: "hoodie",
    name: "Hoodie",
    imageUrl: "/assets/generated/hoodie-white-transparent.dim_400x400.png",
    baseCost: 699,
    colors: [
      { color: "Black", hex: "#1a1a1a", extraPrice: 0 },
      { color: "Grey", hex: "#9e9e9e", extraPrice: 0 },
      { color: "Navy", hex: "#1a237e", extraPrice: 50 },
      { color: "Burgundy", hex: "#4a0e2e", extraPrice: 50 },
      { color: "Forest Green", hex: "#1b5e20", extraPrice: 50 },
    ],
  },
  {
    id: "women-full-sleeve",
    name: "Women's Full Sleeve T-Shirt",
    imageUrl: "/assets/generated/women-full-sleeve-tshirt-white-transparent.dim_400x400.png",
    baseCost: 349,
    colors: [
      { color: "White", hex: "#f5f5f5", extraPrice: 0 },
      { color: "Pink", hex: "#e91e8c", extraPrice: 20 },
      { color: "Lavender", hex: "#9c27b0", extraPrice: 20 },
      { color: "Sky Blue", hex: "#0288d1", extraPrice: 20 },
      { color: "Peach", hex: "#ff7043", extraPrice: 30 },
    ],
  },
];

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
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(() =>
    loadFromStorage<CustomOrderRequest[]>(LS_CUSTOM_ORDERS, [])
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadFromStorage<AppNotification[]>(LS_NOTIFICATIONS, [])
  );
  const [maintenanceMode, setMaintenanceModeState] = useState<MaintenanceMode>(() =>
    loadFromStorage<MaintenanceMode>(LS_MAINTENANCE, { active: false, message: "We'll be back soon. Under maintenance." })
  );
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadFromStorage<Complaint[]>(LS_COMPLAINTS, [])
  );
  const [clothingConfigs, setClothingConfigs] = useState<ClothingConfig[]>(() =>
    loadFromStorage<ClothingConfig[]>(LS_CLOTHING_CONFIGS, DEFAULT_CLOTHING_CONFIGS)
  );
  const [clothingOrders, setClothingOrders] = useState<ClothingOrder[]>(() =>
    loadFromStorage<ClothingOrder[]>(LS_CLOTHING_ORDERS, [])
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
  useEffect(() => { saveToStorage(LS_CUSTOM_ORDERS, customOrders); }, [customOrders]);
  useEffect(() => { saveToStorage(LS_NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { saveToStorage(LS_MAINTENANCE, maintenanceMode); }, [maintenanceMode]);
  useEffect(() => { saveToStorage(LS_COMPLAINTS, complaints); }, [complaints]);
  useEffect(() => { saveToStorage(LS_CLOTHING_CONFIGS, clothingConfigs); }, [clothingConfigs]);
  useEffect(() => { saveToStorage(LS_CLOTHING_ORDERS, clothingOrders); }, [clothingOrders]);

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
    setProducts((prev) => {
      const existing = prev.find((p) => p.id === id);
      // If inStock changed from false to true, notify wishlist users
      if (existing && existing.inStock === false && updates.inStock === true) {
        setWishlistIds((wl) => {
          if (wl.includes(id)) {
            const notif: AppNotification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              message: `"${existing.name}" is back in stock! 🎉`,
              type: "back_in_stock",
              read: false,
              createdAt: new Date().toISOString(),
              relatedId: id,
            };
            setNotifications((pn) => [notif, ...pn]);
          }
          return wl;
        });
      }
      return prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
    });
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
    (paymentMethod: string, customerName: string, contact: string, deliveryAddress: string): Order => {
      const order: Order = {
        id: `ORD${Date.now()}`,
        items: [...cartItems],
        total: cartTotal,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
        customerName,
        contact,
        deliveryAddress,
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

  const requestCancellation = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, cancellationRequested: true, cancellationStatus: "pending" as const }
          : o
      )
    );
  }, []);

  const updateCancellationStatus = useCallback(
    (orderId: string, status: "approved" | "denied") => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                cancellationStatus: status,
                ...(status === "approved" ? { status: "cancelled" as const } : {}),
              }
            : o
        )
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

  // Notification actions
  const addNotification = useCallback((n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
    const newNotification: AppNotification = {
      ...n,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Custom order actions
  const submitCustomOrder = useCallback((order: Omit<CustomOrderRequest, "id" | "status" | "createdAt" | "customerSessionId">) => {
    const newOrder: CustomOrderRequest = {
      ...order,
      id: `co_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      customerSessionId: getOrCreateSessionId(),
    };
    setCustomOrders((prev) => [newOrder, ...prev]);
  }, []);

  const updateCustomOrderStatus = useCallback((id: string, status: "accepted" | "rejected", quotedPrice?: number) => {
    setCustomOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, ...(quotedPrice !== undefined ? { quotedPrice } : {}) } : o
      )
    );
    setCustomOrders((prev) => {
      const order = prev.find((o) => o.id === id);
      if (order) {
        const msg = status === "accepted"
          ? `Your custom order "${order.description.slice(0, 40)}..." has been accepted! Quoted price: ₹${quotedPrice ?? 0}`
          : `Your custom order "${order.description.slice(0, 40)}..." was not accepted.`;
        const notif: AppNotification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          message: msg,
          type: status === "accepted" ? "custom_order_accepted" : "custom_order_rejected",
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: id,
        };
        setNotifications((pn) => [notif, ...pn]);
      }
      return prev;
    });
  }, []);

  const getMyCustomOrders = useCallback((): CustomOrderRequest[] => {
    const sessionId = getOrCreateSessionId();
    return customOrders.filter((o) => o.customerSessionId === sessionId);
  }, [customOrders]);

  // Maintenance mode actions
  const setMaintenanceMode = useCallback((active: boolean, message: string) => {
    setMaintenanceModeState({ active, message });
  }, []);

  // Complaint actions
  const submitComplaint = useCallback((name: string, message: string) => {
    const newComplaint: Complaint = {
      id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      customerName: name,
      message,
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  }, []);

  const replyToComplaint = useCallback((id: string, reply: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reply, repliedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const getPublicComplaints = useCallback((): Complaint[] => {
    return complaints
      .filter((c) => !!c.reply)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints]);

  // Clothing config actions
  const updateClothingConfig = useCallback((id: string, updates: Partial<ClothingConfig>) => {
    setClothingConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  // Clothing order actions
  const submitClothingOrder = useCallback(
    (order: Omit<ClothingOrder, "id" | "status" | "createdAt" | "customerSessionId">) => {
      const newOrder: ClothingOrder = {
        ...order,
        id: `clo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        customerSessionId: getOrCreateSessionId(),
      };
      setClothingOrders((prev) => [newOrder, ...prev]);
    },
    []
  );

  const updateClothingOrderStatus = useCallback(
    (id: string, status: ClothingOrder["status"], quotedPrice?: number) => {
      setClothingOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, ...(quotedPrice !== undefined ? { quotedPrice } : {}) } : o
        )
      );
      if (status === "quoted" && quotedPrice !== undefined) {
        setClothingOrders((prev) => {
          const order = prev.find((o) => o.id === id);
          if (order) {
            const notif: AppNotification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              message: `Your custom ${order.clothingName} (${order.colorName}) has been quoted at ₹${quotedPrice}. Scan QR to pay!`,
              type: "custom_order_accepted",
              read: false,
              createdAt: new Date().toISOString(),
              relatedId: id,
            };
            setNotifications((pn) => [notif, ...pn]);
          }
          return prev;
        });
      }
    },
    []
  );

  const getMyClothingOrders = useCallback((): ClothingOrder[] => {
    const sessionId = getOrCreateSessionId();
    return clothingOrders.filter((o) => o.customerSessionId === sessionId);
  }, [clothingOrders]);

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
        requestCancellation,
        updateCancellationStatus,
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
        customOrders,
        submitCustomOrder,
        updateCustomOrderStatus,
        getMyCustomOrders,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadCount,
        maintenanceMode,
        setMaintenanceMode,
        complaints,
        submitComplaint,
        replyToComplaint,
        getPublicComplaints,
        clothingConfigs,
        updateClothingConfig,
        clothingOrders,
        submitClothingOrder,
        updateClothingOrderStatus,
        getMyClothingOrders,
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
