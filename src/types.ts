export interface PerfumeNote {
  top: string;
  heart: string;
  base: string;
}

export interface ProductSizeOption {
  size: string; // e.g. "5ml", "10ml", "15ml", "20ml", "30ml", "50ml", "100ml"
  price: number; // e.g. 5, 8, 12, 16, 22, 35
  originalPrice?: number;
}

export interface SizeGuideItem {
  size: string;
  title: string;
  description: string;
  recommendedFor: string;
  icon?: string;
}

export interface Perfume {
  id: number;
  name: string;
  arabicName: string;
  badge: string;
  category: string;
  price: number;
  originalPrice: number;
  volume: string;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  sizes?: string[];
  sizeOptions?: ProductSizeOption[];
  fragranceType?: string; // e.g. "عطر زيتي مركز", "تركيبة عطرية مستوحاة"
  inspiredBy?: string; // e.g. "مستوحى من Sauvage", "رائحة مستوحاة من Baccarat Rouge"
  gender?: 'women' | 'men' | 'unisex';
  isSpecialOffer?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isMostDemanded?: boolean;
  isActive?: boolean;
  stock?: number;
  sku?: string;
  slug?: string;
  description: string;
  notes: PerfumeNote;
  inStock?: boolean;
  batchCode?: string;
}

export interface CartItem extends Perfume {
  quantity: number;
  selectedSize?: string;
  selectedSizePrice?: number;
}

export type PaymentMethod = 'cod' | 'd17';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'pending_verification'
  | 'processing';

export const TUNISIA_GOVERNORATES = [
  "أريانة (Ariana)",
  "باجة (Béja)",
  "بن عروس (Ben Arous)",
  "بنزرت (Bizerte)",
  "تطاوين (Tataouine)",
  "توزر (Tozeur)",
  "تونس (Tunis)",
  "جندوبة (Jendouba)",
  "زغوان (Zaghouan)",
  "سلـيانة (Siliana)",
  "سوسة (Sousse)",
  "سيدي بوزيد (Sidi Bouzid)",
  "صفاقس (Sfax)",
  "قابس (Gabès)",
  "قبلي (Kébili)",
  "القصرين (Kasserine)",
  "قفصة (Gafsa)",
  "القيروان (Kairouan)",
  "الكاف (Le Kef)",
  "المهدية (Mahdia)",
  "المنستير (Monastir)",
  "منوبة (Manouba)",
  "مدنين (Médenine)",
  "نابل (Nabeul)"
] as const;

export type TunisiaGovernorate = typeof TUNISIA_GOVERNORATES[number];

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string; // Governorate name
  delegation?: string; // المعتمدية أو المنطقة
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  d17TransactionId?: string;
  d17RecipientPhone?: string;
  orderNotes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  governorate: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  productCount?: number;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroBadge: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  brandStatement: string;
  sizeGuideItems?: SizeGuideItem[];
  sections: {
    hero: boolean;
    brandStatement: boolean;
    specialOffers: boolean;
    sizesGuide: boolean;
    categories: boolean;
    featuredCollection: boolean;
    bestSellers: boolean;
    featuredProduct: boolean;
    linaCollection: boolean;
    whyLina: boolean;
    testimonials: boolean;
    faq: boolean;
  };
}

export interface WebsiteSettings {
  storeName: string;
  subtitle: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  address: string;
  currency: string;
  currencySymbol: string;
  shippingPrice: number;
  freeShippingThreshold: number;
  deliveryInfo: string;
  returnPolicy: string;
  privacyPolicy: string;
  terms: string;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface PromotionCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiresAt: string;
  active: boolean;
  usageCount: number;
}

