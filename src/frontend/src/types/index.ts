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
}

export interface CategoryConfig {
  name: Category;
  imageUrl?: string;
  emoji: string;
}
