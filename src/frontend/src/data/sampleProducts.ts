import type { Product, CategoryConfig } from "../types";

export const SAMPLE_PRODUCTS: Product[] = [
  // Household
  {
    id: "p1",
    name: "Steel Pressure Cooker 5L",
    price: 899,
    category: "Household",
    description:
      "Heavy-duty stainless steel pressure cooker. Perfect for dal, rice, and curries. ISI certified with safety valve.",
    imageUrl: "https://picsum.photos/300/300?random=1",
    rating: 4.5,
    reviewCount: 238,
    inStock: true,
  },
  {
    id: "p2",
    name: "Cotton Mop Set",
    price: 349,
    category: "Household",
    description:
      "Thick cotton mop with easy-squeeze bucket. Cleans floors spotlessly. Comes with 2 extra refills.",
    imageUrl: "https://picsum.photos/300/300?random=2",
    rating: 4.2,
    reviewCount: 124,
    inStock: true,
  },
  {
    id: "p3",
    name: "Kitchen Storage Box Set",
    price: 199,
    category: "Household",
    description:
      "Set of 6 airtight kitchen storage containers. BPA-free plastic, transparent body, stackable design.",
    imageUrl: "https://picsum.photos/300/300?random=3",
    rating: 4.6,
    reviewCount: 412,
    inStock: true,
  },
  {
    id: "p4",
    name: "Non-Stick Tawa 30cm",
    price: 549,
    category: "Household",
    description:
      "Premium non-stick tawa for rotis and dosas. PFOA-free coating, sturdy handle, induction compatible.",
    imageUrl: "https://picsum.photos/300/300?random=4",
    rating: 4.3,
    reviewCount: 187,
    inStock: true,
  },

  // Clothes
  {
    id: "p5",
    name: "Printed Kurta for Women",
    price: 599,
    category: "Clothes",
    description:
      "Elegant floral printed kurta in soft rayon fabric. A-line cut, 3/4 sleeve, available in S to XXL.",
    imageUrl: "https://picsum.photos/300/300?random=5",
    rating: 4.4,
    reviewCount: 356,
    inStock: true,
  },
  {
    id: "p6",
    name: "Cotton Salwar Suit Set",
    price: 1199,
    category: "Clothes",
    description:
      "3-piece pure cotton salwar suit. Kurta, bottom, and dupatta. Block print design, breathable for summer.",
    imageUrl: "https://picsum.photos/300/300?random=6",
    rating: 4.7,
    reviewCount: 298,
    inStock: true,
  },
  {
    id: "p7",
    name: "Men's Casual Linen Shirt",
    price: 449,
    category: "Clothes",
    description:
      "Lightweight linen shirt for men. Slim fit, half-sleeve, perfect for Indian summers. Machine washable.",
    imageUrl: "https://picsum.photos/300/300?random=7",
    rating: 4.1,
    reviewCount: 215,
    inStock: true,
  },
  {
    id: "p8",
    name: "Kids Ethnic Wear Set",
    price: 799,
    category: "Clothes",
    description:
      "Adorable kurta-pyjama set for boys (2-10 years). Festive embroidery, comfortable cotton blend.",
    imageUrl: "https://picsum.photos/300/300?random=8",
    rating: 4.8,
    reviewCount: 143,
    inStock: true,
  },

  // Bedsheet
  {
    id: "p9",
    name: "Floral Double Bedsheet",
    price: 799,
    category: "Bedsheet",
    description:
      "King size double bedsheet with 2 pillow covers. 180 TC pure cotton, vibrant floral print, easy wash.",
    imageUrl: "https://picsum.photos/300/300?random=9",
    rating: 4.5,
    reviewCount: 502,
    inStock: true,
  },
  {
    id: "p10",
    name: "Single Cotton Bedsheet",
    price: 399,
    category: "Bedsheet",
    description:
      "Soft single bedsheet for kids or guest room. 140 TC cotton, solid pastel color, includes 1 pillow cover.",
    imageUrl: "https://picsum.photos/300/300?random=10",
    rating: 4.3,
    reviewCount: 267,
    inStock: true,
  },
  {
    id: "p11",
    name: "Pillow Cover Set of 4",
    price: 249,
    category: "Bedsheet",
    description:
      "Set of 4 cotton pillow covers. Envelope closure, machine washable, fits standard 17x27 inch pillows.",
    imageUrl: "https://picsum.photos/300/300?random=11",
    rating: 4.2,
    reviewCount: 189,
    inStock: true,
  },
  {
    id: "p12",
    name: "Ethnic Jaipuri Bedsheet",
    price: 649,
    category: "Bedsheet",
    description:
      "Traditional Jaipur block print bedsheet. Double size with 2 pillow covers. 100% pure cotton, hand-printed.",
    imageUrl: "https://picsum.photos/300/300?random=12",
    rating: 4.6,
    reviewCount: 334,
    inStock: true,
  },

  // Stickers
  {
    id: "p13",
    name: "Motivational Wall Stickers",
    price: 149,
    category: "Stickers",
    description:
      "Set of 20 motivational quote wall stickers. Waterproof vinyl, easy peel & stick, removable without damage.",
    imageUrl: "https://picsum.photos/300/300?random=13",
    rating: 4.4,
    reviewCount: 421,
    inStock: true,
  },
  {
    id: "p14",
    name: "Kids Room Stickers Pack",
    price: 199,
    category: "Stickers",
    description:
      "Cute animal and cartoon stickers for kids rooms. 50 pieces, non-toxic, fun for children ages 3+.",
    imageUrl: "https://picsum.photos/300/300?random=14",
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
  },
  {
    id: "p15",
    name: "Floral Door Stickers",
    price: 129,
    category: "Stickers",
    description:
      "Beautiful floral door decoration stickers. Large size, self-adhesive, perfect for doors and walls.",
    imageUrl: "https://picsum.photos/300/300?random=15",
    rating: 4.3,
    reviewCount: 198,
    inStock: true,
  },

  // Toys
  {
    id: "p16",
    name: "Wooden Building Blocks Set",
    price: 549,
    category: "Toys",
    description:
      "100-piece natural wooden building blocks. Safe rounded edges, non-toxic paint, develops spatial thinking.",
    imageUrl: "https://picsum.photos/300/300?random=16",
    rating: 4.7,
    reviewCount: 276,
    inStock: true,
  },
  {
    id: "p17",
    name: "Soft Stuffed Teddy Bear",
    price: 399,
    category: "Toys",
    description:
      "Super soft 30cm teddy bear. Hypoallergenic filling, machine washable, perfect gift for kids and toddlers.",
    imageUrl: "https://picsum.photos/300/300?random=17",
    rating: 4.8,
    reviewCount: 534,
    inStock: true,
  },
  {
    id: "p18",
    name: "Remote Control Racing Car",
    price: 1299,
    category: "Toys",
    description:
      "High-speed RC car with 4-channel remote. Rechargeable battery, off-road wheels, LED headlights.",
    imageUrl: "https://picsum.photos/300/300?random=18",
    rating: 4.4,
    reviewCount: 187,
    inStock: true,
  },

  // Mobile Covers
  {
    id: "p19",
    name: "iPhone 15 Marble Cover",
    price: 199,
    category: "Mobile Covers",
    description:
      "Premium marble pattern TPU case for iPhone 15. Shockproof, raised camera protection, wireless charging compatible.",
    imageUrl: "https://picsum.photos/300/300?random=19",
    rating: 4.5,
    reviewCount: 342,
    inStock: true,
  },
  {
    id: "p20",
    name: "Samsung S24 Clear Case",
    price: 149,
    category: "Mobile Covers",
    description:
      "Crystal clear hard case for Samsung Galaxy S24. Anti-yellowing, slim fit, all ports accessible.",
    imageUrl: "https://picsum.photos/300/300?random=20",
    rating: 4.3,
    reviewCount: 256,
    inStock: true,
  },
  {
    id: "p21",
    name: "Redmi Note 13 Cover",
    price: 99,
    category: "Mobile Covers",
    description:
      "Durable back cover for Redmi Note 13. Matte finish, fingerprint resistant, exact cutouts for all buttons.",
    imageUrl: "https://picsum.photos/300/300?random=21",
    rating: 4.2,
    reviewCount: 415,
    inStock: true,
  },

  // Other
  {
    id: "p22",
    name: "Handmade Scented Candles Set",
    price: 299,
    category: "Other",
    description:
      "Set of 3 hand-poured soy wax candles. Fragrances: rose, jasmine, sandalwood. 30+ hours burn time each.",
    imageUrl: "https://picsum.photos/300/300?random=22",
    rating: 4.6,
    reviewCount: 198,
    inStock: true,
  },
  {
    id: "p23",
    name: "Handwoven Jute Bag",
    price: 179,
    category: "Other",
    description:
      "Eco-friendly jute tote bag. Handwoven, sturdy handles, perfect for shopping or everyday carry.",
    imageUrl: "https://picsum.photos/300/300?random=23",
    rating: 4.4,
    reviewCount: 267,
    inStock: true,
  },
  {
    id: "p24",
    name: "Terracotta Decorative Vase",
    price: 449,
    category: "Other",
    description:
      "Handcrafted terracotta vase with traditional Indian motifs. Height 25cm, perfect for dried flowers or decor.",
    imageUrl: "https://picsum.photos/300/300?random=24",
    rating: 4.5,
    reviewCount: 143,
    inStock: true,
  },
];

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  { name: "Household", emoji: "🏠" },
  { name: "Clothes", emoji: "👗" },
  { name: "Bedsheet", emoji: "🛏️" },
  { name: "Stickers", emoji: "🌟" },
  { name: "Toys", emoji: "🧸" },
  { name: "Mobile Covers", emoji: "📱" },
  { name: "Other", emoji: "✨" },
];
