export interface PerfumeNote {
  top: string;
  heart: string;
  base: string;
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
  gender?: 'women' | 'men' | 'unisex';
  isSpecialOffer?: boolean;
  isFeatured?: boolean;
  description: string;
  notes: PerfumeNote;
  inStock?: boolean;
  batchCode?: string;
}

export interface CartItem extends Perfume {
  quantity: number;
  selectedSize?: string;
}

export type PaymentMethod = 'cod' | 'd17';

export type OrderStatus = 'pending_verification' | 'processing' | 'shipped' | 'delivered';

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
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  d17TransactionId?: string;
  d17RecipientPhone?: string;
  orderNotes?: string;
  createdAt: string;
}
