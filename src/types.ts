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
  orders?: Order[];
}

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  order?: number;
  productCount?: number;
}

export interface SectionConfig {
  id: string;
  key: string;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  enabled: boolean;
  order: number;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroBadge: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnLink?: string;
  heroSecondaryBtnText: string;
  heroSecondaryBtnLink?: string;
  brandStatement: string;
  sizeGuideItems?: SizeGuideItem[];
  sectionOrder?: string[];
  sectionTitles?: Record<string, { title: string; subtitle: string; description?: string }>;
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
    [key: string]: boolean;
  };
  topBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
    bgColor?: string;
    textColor?: string;
  };
  popup?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    discountText?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
    delaySeconds?: number;
  };
}

export interface WebsiteSettings {
  storeName: string;
  subtitle: string;
  logoUrl?: string;
  faviconUrl?: string;
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
  workingHours?: string;
  welcomeMessage?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryColor?: string;
  cardBgColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  buttonRadius?: string;
  headingFont?: string;
  bodyFont?: string;
  buttonStyle?: 'rounded' | 'pill' | 'sharp';
}

export interface SEOSettings {
  siteTitle?: string;
  title?: string;
  metaDescription?: string;
  description?: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  active?: boolean;
}

export interface CustomerReviewItem {
  id: string | number;
  author?: string;
  name?: string;
  city?: string;
  avatar?: string;
  perfumeBought?: string;
  rating: number;
  date?: string;
  comment: string;
  verified?: boolean;
  active?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  link: string;
  order: number;
  active: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size?: string;
  createdAt: string;
}

export interface SpecialOfferItem {
  id: string;
  title: string;
  perfumeId: number;
  selectedSize: string;
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  badge: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface GovernorateRate {
  id?: string;
  name?: string;
  governorate?: string;
  price: number;
  active?: boolean;
  duration?: string;
}

export interface DeliverySettings {
  shippingPrice?: number;
  baseShippingPrice?: number;
  freeShippingThreshold?: number;
  freeShippingEnabled?: boolean;
  deliveryDurationText?: string;
  deliveryEstimate?: string;
  deliveryNotice?: string;
  governorates?: GovernorateRate[];
  governorateRates?: GovernorateRate[];
}

export interface ContentSettings {
  faqs?: FAQItem[];
  faqList?: FAQItem[];
  about?: {
    title?: string;
    story?: string;
    image?: string;
  };
  aboutTitle?: string;
  aboutDescription?: string;
  aboutStory?: string;
  aboutBadge?: string;
  reviews?: CustomerReviewItem[];
  footerText?: string;
  returnPolicy?: string;
  termsAndConditions?: string;
  deliveryPageText?: string;
  contactHeading?: string;
  contactSubheading?: string;
  footerBio?: string;
  footerCopyright?: string;
  uiTexts?: {
    addToCartBtn: string;
    buyNowBtn: string;
    checkoutBtn: string;
    emptyCartText: string;
    freeShippingBadge: string;
    currencySymbol: string;
    codLabel: string;
    codDesc: string;
    d17Label: string;
    d17Desc: string;
  };
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

export type Promotion = PromotionCoupon;


