export type Category =
  | "Household"
  | "Clothes"
  | "Bedsheet"
  | "Stickers"
  | "Toys"
  | "Mobile Covers"
  | "Other";

export const ALL_CATEGORIES: Category[] = [
  "Household",
  "Clothes",
  "Bedsheet",
  "Stickers",
  "Toys",
  "Mobile Covers",
  "Other",
];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  codOverride?: boolean; // per-product COD badge, shown even when global COD is disabled
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "approved" | "denied" | "cancelled";
  paymentMethod: string;
  createdAt: string;
  customerName: string;
  contact: string;
  deliveryAddress: string;
  cancellationRequested?: boolean;
  cancellationStatus?: "pending" | "approved" | "denied";
}

export interface CategoryConfig {
  name: Category;
  imageUrl?: string;
  emoji: string;
}

export interface Discount {
  id: string;
  productId: string; // "all" means applies to all products
  type: "percent" | "fixed";
  value: number;
  expiresAt: string; // ISO date string
}

export interface Occasion {
  id: string;
  title: string;
  text: string;
  bannerImageUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface CustomOrderRequest {
  id: string;
  imageUrl: string;         // base64 or object URL stored locally
  description: string;
  quantity: number;
  dimensions: string;
  budget: string;
  status: "pending" | "accepted" | "rejected";
  quotedPrice?: number;     // set by admin on accept
  createdAt: string;
  customerSessionId: string; // random ID stored in sessionStorage to identify "this user"
}

export interface AppNotification {
  id: string;
  message: string;
  type: "custom_order_accepted" | "custom_order_rejected" | "back_in_stock";
  read: boolean;
  createdAt: string;
  relatedId?: string; // productId or customOrderId
}

export interface MaintenanceMode {
  active: boolean;
  message: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  message: string;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

export interface ClothingColorOption {
  color: string;
  hex: string;
  extraPrice: number;
}

export interface ClothingConfig {
  id: string;
  name: string;
  imageUrl: string;
  baseCost: number;
  colors: ClothingColorOption[];
}

export interface ClothingOrder {
  id: string;
  clothingId: string;
  clothingName: string;
  colorName: string;
  colorHex: string;
  baseCost: number;
  colorExtraPrice: number;
  customerDesignImageUrl?: string;
  customerName: string;
  contact: string;
  deliveryAddress: string;
  notes?: string;
  status: "pending" | "quoted" | "cancelled";
  quotedPrice?: number;
  createdAt: string;
  customerSessionId: string;
}
