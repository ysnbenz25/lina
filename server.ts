import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env.local first, then fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
import { PERFUMES_DATA } from './src/data/perfumes';
import { db } from './src/db/index.ts';
import { orders as ordersTable, d17SettingsTable } from './src/db/schema.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { getSupabaseServerAdmin } from './src/lib/supabaseServer.ts';

const app = express();
const PORT = 3000;

// =========================================================================
// 1. CYBERSECURITY HEADERS & MIDDLEWARES
// =========================================================================

// Limit JSON payload size to 64kb to prevent memory exhaustion / DoS attacks
app.use(express.json({ limit: '64kb' }));

// Anti-Attack Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cross-Site Scripting (XSS) Filter Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy to protect sensitive URL parameters
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content Security Policy (CSP): Strict yet compatible with AI Studio preview
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.tailwindcss.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https: ws: wss:",
      "frame-ancestors 'self' https: http:;"
    ].join('; ')
  );
  
  next();
});

// =========================================================================
// 2. RATE LIMITING & BRUTE FORCE / DDOS PROTECTION
// =========================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const checkoutRateLimits = new Map<string, RateLimitRecord>();
const generalApiRateLimits = new Map<string, RateLimitRecord>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// 5 checkout attempts per 15 minutes per IP
function checkoutRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 5;

  const record = checkoutRateLimits.get(ip);
  if (!record || now > record.resetTime) {
    checkoutRateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec.toString());
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'تم تجاوز الحد الأقصى للمحاولات المسموح بها (5 محاولات كل 15 دقيقة). يرجى الانتظار لحماية نظام المعاملات.',
      retryAfterSeconds: retryAfterSec
    });
  }

  record.count += 1;
  next();
}

// General API Rate Limiter: 100 requests per minute
function generalRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIp(req);
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_CALLS = 100;

  const record = generalApiRateLimits.get(ip);
  if (!record || now > record.resetTime) {
    generalApiRateLimits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_CALLS) {
    return res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'تم تجاوز معدل الطلبات المسموح به في الدقيقة.'
    });
  }

  record.count += 1;
  next();
}

// Clean up expired rate-limit records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of checkoutRateLimits.entries()) {
    if (now > rec.resetTime) checkoutRateLimits.delete(ip);
  }
  for (const [ip, rec] of generalApiRateLimits.entries()) {
    if (now > rec.resetTime) generalApiRateLimits.delete(ip);
  }
}, 10 * 60 * 1000);

// =========================================================================
// 3. CSRF PROTECTION & TOKEN ISSUANCE
// =========================================================================

interface CsrfRecord {
  token: string;
  expiresAt: number;
}

const activeCsrfTokens = new Map<string, CsrfRecord>();

// Issue a cryptographically secure CSRF Token (2-hour validity)
app.get('/api/csrf-token', generalRateLimiter, (_req: Request, res: Response) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
  activeCsrfTokens.set(token, { token, expiresAt });

  res.json({
    success: true,
    csrfToken: token
  });
});

function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  const tokenHeader = req.headers['x-csrf-token'];
  if (!tokenHeader || typeof tokenHeader !== 'string') {
    return res.status(403).json({
      success: false,
      error: 'CSRF_MISSING',
      message: 'رمز التحقق الأمني (CSRF Token) مفقود. يرجى إعادة تحميل الصفحة والمحاولة مجدداً.'
    });
  }

  const record = activeCsrfTokens.get(tokenHeader);
  if (!record || Date.now() > record.expiresAt) {
    activeCsrfTokens.delete(tokenHeader);
    return res.status(403).json({
      success: false,
      error: 'CSRF_INVALID',
      message: 'رمز الحماية الأمني منتهي الصلاحية أو غير صالح. يرجى إعادة المحاولة.'
    });
  }

  next();
}

// Clean up expired CSRF tokens every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [tok, rec] of activeCsrfTokens.entries()) {
    if (now > rec.expiresAt) activeCsrfTokens.delete(tok);
  }
}, 30 * 60 * 1000);

// =========================================================================
// 4. SANITIZATION & ANTI-XSS / ANTI-SQLi HELPERS
// =========================================================================

/**
 * Strips script tags, HTML tags, null bytes, SQL comment markers and dangerous symbols.
 */
function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script blocks
    .replace(/<[^>]+>/g, '') // Strip all HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove ASCII control characters
    .replace(/(--|;|\/\*|\*\/)/g, '') // Remove SQL injection sequence markers
    .trim();
}

// Whitelist of all 24 Tunisian Governorates
const VALID_TUNISIAN_GOVERNORATES = [
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

// Strict Zod Validation Schema for Checkout
const CheckoutItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(50),
});

const CheckoutRequestSchema = z.object({
  customerName: z
    .string()
    .min(3, 'الاسم الكامل يجب ألا يقل عن 3 أحرف')
    .max(80, 'الاسم الكامل طويل جداً')
    .transform(sanitizeText),
  phone: z
    .string()
    .regex(/^(?:\+216|00216)?[24579]\d{7}$/, 'رقم الهاتف التونسي غير صالح (يجب أن يتكون من 8 أرقام تبدأ بـ 2 أو 4 أو 5 أو 7 أو 9)'),
  governorate: z.enum(VALID_TUNISIAN_GOVERNORATES, {
    message: 'الرجاء اختيار ولاية صالحة من ولايات تونس الـ 24',
  }),
  delegation: z
    .string()
    .min(2, 'المعتمدية / المنطقة مطلوبة')
    .max(80)
    .transform(sanitizeText),
  address: z
    .string()
    .min(5, 'العنوان التفصيلي يجب أن لا يقل عن 5 أحرف')
    .max(200, 'العنوان التفصيلي طويل جداً')
    .transform(sanitizeText),
  orderNotes: z
    .string()
    .max(300, 'ملاحظات الطلب طويلة جداً')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  paymentMethod: z.enum(['cod', 'd17'] as const, {
    message: 'طريقة الدفع غير صالحة. الخيارات المتاحة: الدفع عند الاستلام أو تطبيق D17',
  }),
  d17TransactionId: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  items: z
    .array(CheckoutItemSchema)
    .min(1, 'سلة المشتريات فارغة'),
}).superRefine((data, ctx) => {
  // If payment method is D17, transaction ID is strictly mandatory and must match alphanumeric pattern
  if (data.paymentMethod === 'd17') {
    if (!data.d17TransactionId || data.d17TransactionId.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['d17TransactionId'],
        message: 'رقم العملية (Transaction ID / N° de transaction D17) إجباري عند اختيار الدفع عبر D17',
      });
    } else if (!/^[A-Za-z0-9\-_]{6,35}$/.test(data.d17TransactionId.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['d17TransactionId'],
        message: 'رقم العملية الخاص بـ D17 غير صالح (يجب أن يتكون من 6 إلى 35 حرفاً ورقم بدون رموز خاصة)',
      });
    }
  }
});

// =========================================================================
// 5. SERVER-SIDE DATA STORAGE & CONFIGURATION
// =========================================================================

// Configurable D17 settings (persistent via file + optional Cloud SQL fallback)
const D17_SETTINGS_FILE = path.join(process.cwd(), 'd17_settings.json');

function loadD17SettingsFromDisk() {
  try {
    if (fs.existsSync(D17_SETTINGS_FILE)) {
      const content = fs.readFileSync(D17_SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.recipientPhone === 'string' && parsed.recipientPhone.trim()) {
        return {
          recipientPhone: parsed.recipientPhone.trim(),
          recipientName: parsed.recipientName || 'Lina Shop - متجر لينا للعطور',
          instructions: parsed.instructions || 'يرجى فتح تطبيق D17 التابع للبريد التونسي، واختيار "تحويل أموال"، ثم إدخال رقم الهاتف وإتمام المعاملة، ونسخ رقم العملية هنا.'
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load d17 settings from disk:', err);
  }
  return {
    recipientPhone: '+216 55 889 900',
    recipientName: 'Lina Shop - متجر لينا للعطور',
    instructions: 'يرجى فتح تطبيق D17 التابع للبريد التونسي، واختيار "تحويل أموال"، ثم إدخال رقم الهاتف وإتمام المعاملة، ونسخ رقم العملية هنا.'
  };
}

function saveD17SettingsToDisk(settings: { recipientPhone: string; recipientName: string; instructions: string }) {
  try {
    fs.writeFileSync(D17_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save d17 settings to disk:', err);
  }
}

let d17Settings = loadD17SettingsFromDisk();

// In-Memory persistent store for products (seeded with authentic perfumes)
let serverProducts = [...PERFUMES_DATA];

// Categories Store
let serverCategories = [
  {
    id: 'cat-1',
    name: "Women's Fragrances",
    arabicName: "عطور نسائية",
    slug: 'women',
    description: 'توليفات أنثوية راقية من أريج الورد والياسمين وزهر البرتقال',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'cat-2',
    name: "Men's Fragrances",
    arabicName: "عطور رجالية",
    slug: 'men',
    description: 'روائح خشبية وجلدية وأمبرية ذات حضور حاسم وهيبة لا تضاهى',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'cat-3',
    name: "Unisex Fragrances",
    arabicName: "عطور للجنسين",
    slug: 'unisex',
    description: 'نقاء المسك والنيرولي التونسي الفاخر في توازن استثنائي',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'cat-4',
    name: "Haute Parfumerie",
    arabicName: "العطور الفاخرة",
    slug: 'niche',
    description: 'إصدارات نيش ملكية بمستخلصات معتقة وثبات أسطوري',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    active: true,
  },
  {
    id: 'cat-5',
    name: "Exclusive Offers",
    arabicName: "العروض الخاصة",
    slug: 'offers',
    description: 'باقات وتخفيضات موسمية حصرية للعملاء في تونس',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    active: true,
  }
];

// Homepage CMS settings (editable by admin)
let serverHomepageSettings = {
  heroTitle: "عطرك... بصمتك",
  heroSubtitle: "فخامة تُرى قبل أن تُشم",
  heroDescription: "إبداعات عطرية تونسية بمستخلصات نيش فاخرة وأصالة تأسر الحواس.",
  heroImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85",
  heroBadge: "LINA SIGNATURE • EAU DE PARFUM • 100 ML",
  heroPrimaryBtnText: "اكتشف العطور",
  heroSecondaryBtnText: "تسوق الآن",
  brandStatement: "العطر ليس مجرد رائحة. إنه حضور.",
  sections: {
    hero: true,
    brandStatement: true,
    featuredCollection: true,
    bestSellers: true,
    featuredProduct: true,
    linaCollection: true,
    whyLina: true,
    testimonials: true,
    faq: true,
  }
};

// Website & Shipping settings (editable by admin)
let serverWebsiteSettings = {
  storeName: "LINA SHOP",
  subtitle: "HAUTE PARFUMERIE",
  phone: "+216 55 889 900",
  email: "contact@linashop.tn",
  whatsapp: "+216 55 889 900",
  instagram: "https://instagram.com/linashop.tn",
  facebook: "https://facebook.com/linashop.tn",
  tiktok: "https://tiktok.com/@linashop.tn",
  address: "شارع الحبيب بورقيبة، تونس العاصمة، الجمهورية التونسية",
  currency: "TND",
  currencySymbol: "د.ت",
  shippingPrice: 7,
  freeShippingThreshold: 150,
  deliveryInfo: "توصيل سريع وسري ومؤمن إلى كافة معتمديات وقرى ولايات تونس الـ 24 خلال 24-48 ساعة عمل",
  returnPolicy: "ضمان الاستبدال أو الإرجاع خلال 7 أيام من تاريخ الاستلام في حال وجود أي عيب مصنعي",
  privacyPolicy: "نحن في لينا شوب نلتزم بحماية خصوصية عملائنا ولا نشارك بيانات الاتصال مع أي طرف ثالث",
  terms: "جميع منتجاتنا أصلية 100% ومصنعة وفق أعلى المعايير القياسية العالمية"
};

// Theme settings (editable by admin)
let serverThemeSettings = {
  primaryColor: "#722F3F",
  accentColor: "#D6B56A",
  backgroundColor: "#241B18",
  textColor: "#F7F1E8",
  buttonRadius: "md"
};

// Delivery settings (editable by admin)
let serverDeliverySettings = {
  shippingPrice: 7,
  freeShippingThreshold: 150,
  deliveryEstimate: "خلال 24 إلى 48 ساعة عمل",
  deliveryNotice: "توصيل سريع ومضمون إلى كافة الولايات الـ 24 مع إمكانية المعاينة قبل الدفع",
  governorates: [
    { id: "tunis", name: "تونس", price: 7, active: true },
    { id: "ariana", name: "أريانة", price: 7, active: true },
    { id: "ben_arous", name: "بن عروس", price: 7, active: true },
    { id: "manouba", name: "منوبة", price: 7, active: true },
    { id: "sousse", name: "سوسة", price: 7, active: true },
    { id: "sfax", name: "صفاقس", price: 7, active: true },
    { id: "nabeul", name: "نابل", price: 7, active: true },
    { id: "bizerte", name: "بنزرت", price: 7, active: true },
    { id: "monastir", name: "المنستير", price: 7, active: true },
    { id: "mahdia", name: "المهدية", price: 7, active: true },
    { id: "kairouan", name: "القيروان", price: 7, active: true },
    { id: "gabes", name: "قابس", price: 7, active: true },
    { id: "medenine", name: "مدنين", price: 8, active: true },
    { id: "tataouine", name: "تطاوين", price: 8, active: true },
    { id: "gafsa", name: "قفصة", price: 8, active: true },
    { id: "tozeur", name: "توزر", price: 8, active: true },
    { id: "kebili", name: "قبلي", price: 8, active: true },
    { id: "kasserine", name: "القصرين", price: 8, active: true },
    { id: "sidi_bouzid", name: "سيدي بوزيد", price: 8, active: true },
    { id: "kef", name: "الكاف", price: 8, active: true },
    { id: "siliana", name: "سليانة", price: 8, active: true },
    { id: "beja", name: "باجة", price: 7, active: true },
    { id: "jendouba", name: "جندوبة", price: 8, active: true },
    { id: "zaghouan", name: "زغوان", price: 7, active: true }
  ]
};

// Content CMS settings (editable by admin)
let serverContentSettings = {
  about: {
    title: "قصتنا... شغف العطور التونسية الفاخرة",
    story: "انطلقت دار لينا شوب من حب عميق لفنون العطارة وعالم الزيوت العطرية النقية في تونس. هدفنا جعل الفخامة والأناقة في متناول الجميع بأسعار رمزية ومكونات عالية الجودة.",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80"
  },
  faqs: [
    {
      id: "faq-1",
      question: "هل العطور تدوم طويلاً؟ وما هي نسبة تركيز الزيت؟",
      answer: "نعم بكل تأكيد! عطورنا مستخلصة بتركيز Eau de Parfum و Extrait de Parfum عالي النقاء، وتدوم فوحانها وثباتها من 24 إلى 48 ساعة على الملابس والأقمشة."
    },
    {
      id: "faq-2",
      question: "كيف يتم استلام الطلب والدفع في تونس؟",
      answer: "نوفر الدفع عند الاستلام كاش (Paiement à la livraison) إلى باب منزلك، أو الدفع السريع والآمن عبر بطاقة D17 التابعة للبريد التونسي."
    },
    {
      id: "faq-3",
      question: "ما هي مدة التوصيل لكافة الولايات التونسية؟",
      answer: "يتم تجهيز الطلب وشحنه فوراً ليصلك خلال 24 إلى 48 ساعة فقط في كامل ولايات تونس الـ 24."
    }
  ],
  reviews: [
    {
      id: "rev-1",
      author: "أحمد بن سالم",
      city: "تونس العاصمة",
      rating: 5,
      comment: "عطر مذهل وفوحان لا يوصف، وصلني في أقل من 24 ساعة وتعامل راقي جداً.",
      date: "2026-03-10"
    },
    {
      id: "rev-2",
      author: "مريم العبيدي",
      city: "سوسة",
      rating: 5,
      comment: "الرائحة مطابقة تماماً للماركة العالمية الأصلية، والزيت المركز ثباته ممتاز!",
      date: "2026-03-12"
    }
  ],
  footerText: "متجر لينا شوب - المتجر التونسي الأول المتخصص في العطور التركيبية والزيوت العطرية الفاخرة بأسعار رمزية وتوصيل لكافة ولايات تونس.",
  returnPolicy: "إمكانية الاستبدال خلال 48 ساعة في حالة عدم مطابقة المنتج أو وجود أي ملاحظة.",
  termsAndConditions: "نلتزم بأعلى معايير النزاهة والمصداقية، وجميع العطور مجهزة بمواد أولية نقية وآمنة على البشرة."
};

// SEO & Meta tags settings (editable by admin)
let serverSEOSettings = {
  title: "LINA SHOP | متجر العطور والزيوت الفاخرة بتونس - عطور تركيبية بأسعار رمزية",
  description: "اكتشف أفخم العطور التونسية والزيوت العطرية المركزة بأحجام من 5ml إلى 100ml بأسعار تبدأ من 5 د.ت مع توصيل سريع والدفع عند الاستلام أو D17.",
  keywords: "عطور تونس, بارفان تونس, D17, عطور زيتية, عطور رجالية, عطور نسائية, Lina Shop",
  ogTitle: "LINA SHOP | عطور نيش وزيوت نقية بأسعار استثنائية بتونس",
  ogDescription: "تسوق أرقى العطور المستوحاة والزيوت العطرية بضمان الثبات والفوحان وتوصيل لكافة ولايات الجمهورية التونسية.",
  ogImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80"
};

// Promotions store
let serverPromotions = [
  {
    id: 'promo-1',
    code: 'LINA10',
    type: 'percentage' as const,
    value: 10,
    minOrder: 100,
    expiresAt: '2026-12-31',
    active: true,
    usageCount: 18,
  },
  {
    id: 'promo-2',
    code: 'BIENVENUE',
    type: 'fixed' as const,
    value: 15,
    minOrder: 150,
    expiresAt: '2026-12-31',
    active: true,
    usageCount: 29,
  }
];

export interface ServerOrder {
  id: string;
  trackingNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  delegation?: string;
  orderNotes?: string;
  items: Array<{
    id: number;
    name: string;
    arabicName: string;
    price: number;
    quantity: number;
    image: string;
    volume: string;
  }>;
  subtotal: number;
  shippingFee: number;
  discount?: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'd17';
  d17TransactionId?: string;
  d17RecipientPhone?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'pending_verification'
    | 'processing';
  createdAt: string;
  clientIp: string;
}

// In-Memory persistent store for orders (pre-seeded with realistic orders for instant visibility)
const serverOrders: ServerOrder[] = [
  {
    id: 'ORD-TN-1726201',
    trackingNumber: 'TN-849102',
    customerName: 'مريم الطرابلسي',
    phone: '21650123456',
    city: 'سوسة (Sousse)',
    delegation: 'سوسة المدينة',
    address: 'شارع الحبيب ثامر، عمارة الأندلس، شقة 4',
    orderNotes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
    items: [
      {
        id: 1,
        name: 'Lina Royal Musk',
        arabicName: 'مسك لينا الملكي',
        price: 175,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
        volume: '100 ml - Extrait de Parfum'
      }
    ],
    subtotal: 175,
    shippingFee: 0,
    discount: 0,
    total: 175,
    paymentMethod: 'cod',
    status: 'delivered',
    createdAt: '2026-09-10',
    clientIp: '197.14.12.8'
  },
  {
    id: 'ORD-TN-1726202',
    trackingNumber: 'TN-391482',
    customerName: 'أنيس بن سالم',
    phone: '21698765432',
    city: 'تونس (Tunis)',
    delegation: 'المرسى',
    address: 'حي النسيم، نهج الورد، رقم 12',
    items: [
      {
        id: 2,
        name: 'Imperial Oud Noir',
        arabicName: 'عود إمبريال نوار',
        price: 280,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
        volume: '100 ml - Extrait de Parfum'
      }
    ],
    subtotal: 280,
    shippingFee: 0,
    discount: 0,
    total: 280,
    paymentMethod: 'd17',
    d17TransactionId: 'D17-94827104',
    status: 'shipped',
    createdAt: '2026-09-12',
    clientIp: '196.203.44.19'
  },
  {
    id: 'ORD-TN-1726203',
    trackingNumber: 'TN-629401',
    customerName: 'سيرين المحمودي',
    phone: '21622334455',
    city: 'صفاقس (Sfax)',
    delegation: 'طريق تونس',
    address: 'كم 4، إقامة الياسمين',
    items: [
      {
        id: 3,
        name: 'Velvet Rose & Tonka',
        arabicName: 'مخمل الورد والتونكا',
        price: 215,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        volume: '100 ml - Eau de Parfum'
      }
    ],
    subtotal: 215,
    shippingFee: 0,
    discount: 0,
    total: 215,
    paymentMethod: 'cod',
    status: 'confirmed',
    createdAt: '2026-09-13',
    clientIp: '197.3.28.102'
  }
];

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aymen@2027';

// Helper: Check Admin Authorization
function checkAdminAuth(req: Request): boolean {
  const token = req.headers['x-admin-token'];
  const password = req.body?.adminPassword || req.headers['x-admin-password'];
  return token === 'admin_authenticated_session_token' || password === ADMIN_PASSWORD;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'غير مصرح: يرجى تسجيل الدخول كمسؤول للنظام.'
    });
  }
  next();
}

// =========================================================================
// 6. API ENDPOINTS
// =========================================================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Safe Supabase server status & connectivity check (never exposes service_role key)
app.get('/api/supabase/status', async (_req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jkdwpnmcnidfftebypet.supabase.co';
    const anonKeyConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    let testStatus = 'initialized';
    try {
      const admin = getSupabaseServerAdmin();
      // Test basic connection
      const { error } = await admin.auth.getSession();
      if (error) {
        testStatus = `auth_checked_with_notice: ${error.message}`;
      } else {
        testStatus = 'connected_and_healthy';
      }
    } catch (e: any) {
      testStatus = `error: ${e.message}`;
    }

    res.json({
      success: true,
      supabaseUrl,
      anonKeyConfigured,
      serviceRoleConfigured,
      serverConnection: testStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to check Supabase status',
    });
  }
});

// GET D17 Settings
app.get('/api/settings/d17', generalRateLimiter, async (_req: Request, res: Response) => {
  try {
    const latestDbSetting = await db.select().from(d17SettingsTable).limit(1);
    if (latestDbSetting.length > 0 && latestDbSetting[0].recipientPhone) {
      d17Settings.recipientPhone = latestDbSetting[0].recipientPhone;
      d17Settings.recipientName = latestDbSetting[0].recipientName;
      d17Settings.instructions = latestDbSetting[0].instructions;
    } else {
      d17Settings = loadD17SettingsFromDisk();
    }
  } catch (err) {
    // Cloud SQL might not be connected yet; load from local disk
    d17Settings = loadD17SettingsFromDisk();
  }

  res.json({
    success: true,
    d17Settings
  });
});

// PATCH D17 Settings (Admin only)
app.patch('/api/settings/d17', generalRateLimiter, async (req: Request, res: Response) => {
  const { recipientPhone, recipientName, instructions, adminPassword } = req.body;
  const isAuthorized =
    adminPassword === ADMIN_PASSWORD ||
    req.headers['x-admin-token'] === 'admin_authenticated_session_token' ||
    req.headers['x-admin-password'] === ADMIN_PASSWORD;

  if (!isAuthorized) {
    return res.status(401).json({ success: false, message: 'غير مصرح: كلمة مرور المشرف غير صحيحة' });
  }

  if (recipientPhone && typeof recipientPhone === 'string') {
    d17Settings.recipientPhone = sanitizeText(recipientPhone);
  }
  if (recipientName && typeof recipientName === 'string') {
    d17Settings.recipientName = sanitizeText(recipientName);
  }
  if (instructions && typeof instructions === 'string') {
    d17Settings.instructions = sanitizeText(instructions);
  }

  // Persist to disk immediately
  saveD17SettingsToDisk(d17Settings);

  try {
    await db.insert(d17SettingsTable).values({
      recipientPhone: d17Settings.recipientPhone,
      recipientName: d17Settings.recipientName,
      instructions: d17Settings.instructions,
    });
  } catch (dbErr) {
    // Cloud SQL optional fallback
  }

  res.json({
    success: true,
    message: 'تم تحديث إعدادات D17 بنجاح',
    d17Settings
  });
});

// POST /api/checkout (With Rate Limiting, CSRF, Anti-Tampering, and Full Zod Validation)
app.post(
  '/api/checkout',
  checkoutRateLimiter,
  verifyCsrfToken,
  async (req: Request, res: Response) => {
    // 1. Zod Parse & Sanitize
    const validationResult = CheckoutRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: formattedErrors[0]?.message || 'بيانات الطلب غير صالحة',
        details: formattedErrors
      });
    }

    const data = validationResult.data;

    // 2. Data Tampering Protection: Server-Side Price and Total Calculation
    let calculatedSubtotal = 0;
    const validatedItems: ServerOrder['items'] = [];

    for (const orderItem of data.items) {
      // Look up authentic product from server catalog (or fallback)
      const catalogItem = serverProducts.find((p) => p.id === orderItem.id) || PERFUMES_DATA.find((p) => p.id === orderItem.id);
      if (!catalogItem) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PRODUCT',
          message: `عطر برقم المعرف (${orderItem.id}) غير موجود في كتالوج المتجر.`
        });
      }

      // Authoritative item price from server
      const itemPrice = catalogItem.price;
      calculatedSubtotal += itemPrice * orderItem.quantity;

      validatedItems.push({
        id: catalogItem.id,
        name: catalogItem.name,
        arabicName: catalogItem.arabicName,
        price: itemPrice,
        quantity: orderItem.quantity,
        image: catalogItem.image,
        volume: catalogItem.volume
      });
    }

    // Dynamic Shipping rules from admin settings: Free shipping for orders >= freeShippingThreshold, else shippingPrice
    const threshold = serverWebsiteSettings.freeShippingThreshold || 150;
    const standardShippingFee = serverWebsiteSettings.shippingPrice !== undefined ? serverWebsiteSettings.shippingPrice : 7;
    const shippingFee = calculatedSubtotal >= threshold ? 0 : standardShippingFee;
    const calculatedTotal = calculatedSubtotal + shippingFee;

    // 3. Status Assignment:
    // If D17: 'pending_verification' (waiting for merchant to verify receipt in D17 app)
    // If COD: 'processing' (standard processing)
    const initialStatus: ServerOrder['status'] =
      data.paymentMethod === 'd17' ? 'pending_verification' : 'processing';

    // 4. Generate Unique Tracking Code
    const randDigits = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `TN-${randDigits}`;
    const orderId = `ORD-TN-${Date.now()}`;

    const newOrder: ServerOrder = {
      id: orderId,
      trackingNumber: trackingCode,
      customerName: data.customerName,
      phone: data.phone,
      city: data.governorate,
      delegation: data.delegation,
      address: data.address,
      orderNotes: data.orderNotes,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      total: calculatedTotal,
      paymentMethod: data.paymentMethod,
      d17TransactionId: data.paymentMethod === 'd17' ? data.d17TransactionId : undefined,
      d17RecipientPhone: data.paymentMethod === 'd17' ? d17Settings.recipientPhone : undefined,
      status: initialStatus,
      createdAt: new Date().toISOString().split('T')[0],
      clientIp: getClientIp(req)
    };

    serverOrders.unshift(newOrder);

    // Invalidate the CSRF token after successful checkout to prevent replay
    const tokenHeader = req.headers['x-csrf-token'] as string;
    if (tokenHeader) activeCsrfTokens.delete(tokenHeader);

    // Issue a fresh CSRF token for any next interaction
    const freshToken = crypto.randomBytes(32).toString('hex');
    activeCsrfTokens.set(freshToken, {
      token: freshToken,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000
    });

    // Asynchronously persist order to Cloud SQL
    try {
      const firstItem = newOrder.items[0];
      await db.insert(ordersTable).values({
        trackingNumber: newOrder.trackingNumber,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        city: newOrder.city,
        address: `${newOrder.delegation ? newOrder.delegation + ' - ' : ''}${newOrder.address}`,
        perfumeId: firstItem ? String(firstItem.id) : '1',
        perfumeName: firstItem ? firstItem.name : 'Lina Perfume',
        perfumeArabicName: firstItem ? firstItem.arabicName : 'عطر لينا الفاخر',
        quantity: firstItem ? firstItem.quantity : 1,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        d17TxId: newOrder.d17TransactionId || null,
        status: newOrder.status,
        clientIp: newOrder.clientIp || null,
        userId: (req as any).user?.uid || null,
      });
    } catch (dbErr) {
      console.error('Order Cloud SQL insert error:', dbErr);
    }

    res.status(201).json({
      success: true,
      message:
        data.paymentMethod === 'd17'
          ? 'تم تسجيل طلبك بنجاح وحالته الحالية: معلق بانتظار تأكيد تحويل D17'
          : 'تم تأكيد طلبك بنجاح (الدفع عند الاستلام)',
      order: newOrder,
      newCsrfToken: freshToken
    });
  }
);

// POST /api/auth/sync (Sync Firebase Auth User with Cloud SQL)
app.post('/api/auth/sync', generalRateLimiter, async (req: Request, res: Response) => {
  const { token, user } = req.body;
  if (!user || !user.uid) {
    return res.status(400).json({ success: false, message: 'معرف المستخدم مطلوب' });
  }

  try {
    let verifiedUid = user.uid;
    let verifiedEmail = user.email;

    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        verifiedUid = decoded.uid;
        verifiedEmail = decoded.email || user.email;
      } catch (err) {
        console.warn('Firebase token verification warning:', err);
      }
    }

    const dbUser = await getOrCreateUser(
      verifiedUid,
      verifiedEmail || `${verifiedUid}@user.linashop.tn`,
      user.displayName,
      user.photoUrl
    );

    return res.json({
      success: true,
      user: dbUser
    });
  } catch (error) {
    console.error('Failed to sync user with Cloud SQL:', error);
    return res.status(500).json({ success: false, message: 'فشل مزامنة بيانات المستخدم مع قاعدة البيانات' });
  }
});

// Admin Login Endpoint
app.post('/api/admin/login', generalRateLimiter, (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: 'admin_authenticated_session_token',
      message: 'تم تسجيل الدخول بنجاح كمسؤول لمتجر لينا شوب'
    });
  }
  return res.status(401).json({
    success: false,
    message: 'كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.'
  });
});

// ==========================================
// PRODUCTS ENDPOINTS
// ==========================================

// GET /api/products (Public)
app.get('/api/products', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: serverProducts.length,
    products: serverProducts
  });
});

// POST /api/products (Admin Create)
app.post('/api/products', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const productData = req.body;
  const newId = serverProducts.length > 0 ? Math.max(...serverProducts.map(p => p.id)) + 1 : 1;
  const newProduct = {
    id: newId,
    name: sanitizeText(productData.name || 'New Perfume'),
    arabicName: sanitizeText(productData.arabicName || 'عطر جديد'),
    badge: sanitizeText(productData.badge || 'إصدار فاخر'),
    category: sanitizeText(productData.category || 'عطور فاخرة'),
    price: Number(productData.price) || 150,
    originalPrice: Number(productData.originalPrice) || Number(productData.price) + 40,
    volume: sanitizeText(productData.volume || '100 ml - Extrait de Parfum'),
    rating: Number(productData.rating) || 5.0,
    reviewsCount: Number(productData.reviewsCount) || 1,
    image: productData.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    gallery: Array.isArray(productData.gallery) ? productData.gallery : [productData.image],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : ['50 ml', '100 ml'],
    gender: productData.gender || 'unisex',
    isSpecialOffer: Boolean(productData.isSpecialOffer),
    isFeatured: Boolean(productData.isFeatured),
    isBestseller: Boolean(productData.isBestseller),
    isNew: Boolean(productData.isNew),
    isActive: productData.isActive !== false,
    stock: Number(productData.stock) || 25,
    sku: sanitizeText(productData.sku || `LINA-${newId}`),
    description: sanitizeText(productData.description || ''),
    notes: {
      top: sanitizeText(productData.notes?.top || ''),
      heart: sanitizeText(productData.notes?.heart || ''),
      base: sanitizeText(productData.notes?.base || '')
    },
    inStock: productData.inStock !== false
  };

  serverProducts.push(newProduct);
  res.status(201).json({ success: true, product: newProduct, message: 'تم إضافة العطر بنجاح' });
});

// PUT /api/products/:id (Admin Update)
app.put('/api/products/:id', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = serverProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العطر غير موجود' });
  }

  const updatedData = req.body;
  serverProducts[index] = {
    ...serverProducts[index],
    ...updatedData,
    id, // Keep same ID
    notes: {
      ...serverProducts[index].notes,
      ...(updatedData.notes || {})
    }
  };

  res.json({ success: true, product: serverProducts[index], message: 'تم تحديث العطر بنجاح' });
});

// DELETE /api/products/:id (Admin Delete)
app.delete('/api/products/:id', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = serverProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العطر غير موجود' });
  }

  const deleted = serverProducts.splice(index, 1);
  res.json({ success: true, product: deleted[0], message: 'تم حذف العطر بنجاح' });
});

// ==========================================
// CATEGORIES ENDPOINTS
// ==========================================

app.get('/api/categories', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, categories: serverCategories });
});

app.post('/api/categories', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { name, arabicName, slug, description, image } = req.body;
  const newCategory = {
    id: `cat-${Date.now()}`,
    name: sanitizeText(name || 'Category'),
    arabicName: sanitizeText(arabicName || 'قسم جديد'),
    slug: sanitizeText(slug || 'category'),
    description: sanitizeText(description || ''),
    image: image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    active: true
  };
  serverCategories.push(newCategory);
  res.status(201).json({ success: true, category: newCategory, message: 'تم إضافة القسم بنجاح' });
});

app.put('/api/categories/:id', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = serverCategories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'القسم غير موجود' });

  serverCategories[index] = { ...serverCategories[index], ...req.body, id };
  res.json({ success: true, category: serverCategories[index], message: 'تم تحديث القسم بنجاح' });
});

app.delete('/api/categories/:id', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = serverCategories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: 'القسم غير موجود' });

  serverCategories.splice(index, 1);
  res.json({ success: true, message: 'تم حذف القسم بنجاح' });
});

// ==========================================
// HOMEPAGE CMS SETTINGS
// ==========================================

app.get('/api/settings/homepage', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverHomepageSettings });
});

app.put('/api/settings/homepage', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverHomepageSettings = {
    ...serverHomepageSettings,
    ...req.body,
    sections: {
      ...serverHomepageSettings.sections,
      ...(req.body.sections || {})
    }
  };
  res.json({ success: true, settings: serverHomepageSettings, message: 'تم حفظ إعدادات الصفحة الرئيسية بنجاح' });
});

// ==========================================
// WEBSITE SETTINGS & SHIPPING
// ==========================================

app.get('/api/settings/website', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverWebsiteSettings });
});

app.put('/api/settings/website', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverWebsiteSettings = { ...serverWebsiteSettings, ...req.body };
  res.json({ success: true, settings: serverWebsiteSettings, message: 'تم تحديث إعدادات المتجر والشحن بنجاح' });
});

// ==========================================
// THEME SETTINGS
// ==========================================

app.get('/api/settings/theme', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverThemeSettings });
});

app.put('/api/settings/theme', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverThemeSettings = { ...serverThemeSettings, ...req.body };
  res.json({ success: true, settings: serverThemeSettings, message: 'تم تحديث إعدادات المظهر بنجاح' });
});

// ==========================================
// DELIVERY & SHIPPING SETTINGS
// ==========================================

app.get('/api/settings/delivery', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverDeliverySettings });
});

app.put('/api/settings/delivery', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverDeliverySettings = { ...serverDeliverySettings, ...req.body };
  res.json({ success: true, settings: serverDeliverySettings, message: 'تم تحديث إعدادات التوصيل والولايات بنجاح' });
});

// ==========================================
// CONTENT CMS SETTINGS
// ==========================================

app.get('/api/settings/content', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverContentSettings });
});

app.put('/api/settings/content', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverContentSettings = { ...serverContentSettings, ...req.body };
  res.json({ success: true, settings: serverContentSettings, message: 'تم تحديث المحتوى والأسئلة الشائعة بنجاح' });
});

// ==========================================
// SEO & METADATA SETTINGS
// ==========================================

app.get('/api/settings/seo', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({ success: true, settings: serverSEOSettings });
});

app.put('/api/settings/seo', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  serverSEOSettings = { ...serverSEOSettings, ...req.body };
  res.json({ success: true, settings: serverSEOSettings, message: 'تم تحديث إعدادات SEO ومحركات البحث بنجاح' });
});

// Batch Categories Update
app.put('/api/categories', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { categories } = req.body;
  if (Array.isArray(categories)) {
    serverCategories = categories;
  }
  res.json({ success: true, categories: serverCategories, message: 'تم تحديث قائمة التصنيفات بنجاح' });
});

// ==========================================
// PROMOTIONS & COUPONS
// ==========================================

app.get('/api/promotions', generalRateLimiter, requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, promotions: serverPromotions });
});

app.post('/api/promotions', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { code, type, value, minOrder, expiresAt } = req.body;
  const newPromo = {
    id: `promo-${Date.now()}`,
    code: sanitizeText(code || '').toUpperCase(),
    type: type === 'fixed' ? 'fixed' as const : 'percentage' as const,
    value: Number(value) || 10,
    minOrder: Number(minOrder) || 0,
    expiresAt: expiresAt || '2026-12-31',
    active: true,
    usageCount: 0
  };
  serverPromotions.push(newPromo);
  res.status(201).json({ success: true, promotion: newPromo, message: 'تم إضافة كود الخصم بنجاح' });
});

app.delete('/api/promotions/:id', generalRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = serverPromotions.findIndex(p => p.id === id || p.code === id.toUpperCase());
  if (index === -1) return res.status(404).json({ success: false, message: 'كود الخصم غير موجود' });

  serverPromotions.splice(index, 1);
  res.json({ success: true, message: 'تم حذف كود الخصم بنجاح' });
});

// Validate coupon at checkout (Public)
app.post('/api/promotions/validate', generalRateLimiter, (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الخصم' });
  }

  const promo = serverPromotions.find(p => p.code === code.trim().toUpperCase() && p.active);
  if (!promo) {
    return res.status(404).json({ success: false, message: 'رمز الخصم غير صالح أو منتهي الصلاحية' });
  }

  const orderAmount = Number(subtotal) || 0;
  if (orderAmount < promo.minOrder) {
    return res.status(400).json({
      success: false,
      message: `الحد الأدنى للطلب لتفعيل هذا الخصم هو ${promo.minOrder} د.ت`
    });
  }

  let discountAmount = 0;
  if (promo.type === 'percentage') {
    discountAmount = Math.round((orderAmount * promo.value) / 100);
  } else {
    discountAmount = Math.min(promo.value, orderAmount);
  }

  res.json({
    success: true,
    code: promo.code,
    type: promo.type,
    discountAmount,
    message: `تم تطبيق كود الخصم بنجاح (-${discountAmount} د.ت)`
  });
});

// ==========================================
// CUSTOMERS LIST (Aggregated from Orders)
// ==========================================

app.get('/api/customers', generalRateLimiter, requireAdmin, (_req: Request, res: Response) => {
  const customerMap = new Map<string, {
    id: string;
    name: string;
    phone: string;
    governorate: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }>();

  for (const order of serverOrders) {
    const key = order.phone || order.customerName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      if (order.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customerMap.set(key, {
        id: `cust-${customerMap.size + 1}`,
        name: order.customerName,
        phone: order.phone,
        governorate: order.city,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt
      });
    }
  }

  res.json({
    success: true,
    customers: Array.from(customerMap.values())
  });
});

// GET /api/orders (List all orders for Admin / syncing)
app.get('/api/orders', generalRateLimiter, (req: Request, res: Response) => {
  res.json({
    success: true,
    count: serverOrders.length,
    orders: serverOrders
  });
});

// PATCH /api/orders/:id/status (Admin verifies status or payment)
app.patch('/api/orders/:id/status', generalRateLimiter, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD && req.headers['x-admin-token'] !== 'admin_authenticated_session_token') {
    return res.status(401).json({ success: false, message: 'غير مصرح: كلمة مرور المشرف غير صحيحة' });
  }

  const validStatuses = [
    'pending',
    'confirmed',
    'preparing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'pending_verification',
    'processing'
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'حالة الطلب غير صالحة' });
  }

  const order = serverOrders.find((o) => o.id === id || o.trackingNumber === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  }

  order.status = status;

  res.json({
    success: true,
    message: `تم تحديث حالة الطلب (${order.trackingNumber}) بنجاح`,
    order
  });
});

// GET /api/orders/track/:code (Public tracking by tracking number)
app.get('/api/orders/track/:code', generalRateLimiter, (req: Request, res: Response) => {
  const cleanCode = sanitizeText(req.params.code).toUpperCase();
  const order = serverOrders.find((o) => o.trackingNumber.toUpperCase() === cleanCode);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على شحنة بهذا الرمز في قاعدة البيانات'
    });
  }

  // Return non-sensitive tracking information
  res.json({
    success: true,
    order: {
      trackingNumber: order.trackingNumber,
      city: order.city,
      delegation: order.delegation,
      itemsCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    }
  });
});

// =========================================================================
// 7. VITE MIDDLEWARE & STATIC SERVING
// =========================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lina Shop Secure Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
