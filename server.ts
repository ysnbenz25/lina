import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { z } from 'zod';
import { PERFUMES_DATA } from './src/data/perfumes';

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

// Configurable D17 settings (can be modified by admin)
let d17Settings = {
  recipientPhone: '+216 55 889 900',
  recipientName: 'Lina Shop - متجر لينا للعطور',
  instructions: 'يرجى فتح تطبيق D17 التابع للبريد التونسي، واختيار "تحويل أموال"، ثم إدخال رقم الهاتف وإتمام المعاملة، ونسخ رقم العملية هنا.'
};

export interface ServerOrder {
  id: string;
  trackingNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  delegation?: string;
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
  total: number;
  paymentMethod: 'cod' | 'd17';
  d17TransactionId?: string;
  d17RecipientPhone?: string;
  status: 'pending_verification' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  clientIp: string;
}

// In-Memory persistent store for orders
const serverOrders: ServerOrder[] = [];

// =========================================================================
// 6. API ENDPOINTS
// =========================================================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET D17 Settings
app.get('/api/settings/d17', generalRateLimiter, (_req: Request, res: Response) => {
  res.json({
    success: true,
    d17Settings
  });
});

// PATCH D17 Settings (Admin only)
app.patch('/api/settings/d17', generalRateLimiter, (req: Request, res: Response) => {
  const { recipientPhone, recipientName, instructions, adminPassword } = req.body;
  if (adminPassword !== 'admin123') {
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
  (req: Request, res: Response) => {
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
      // Look up authentic product from server catalog
      const catalogItem = PERFUMES_DATA.find((p) => p.id === orderItem.id);
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

    // Shipping rules: Free shipping for orders >= 150 TND, else 7 TND
    const shippingFee = calculatedSubtotal >= 150 ? 0 : 7;
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

// GET /api/orders (List all orders for Admin / syncing)
app.get('/api/orders', generalRateLimiter, (req: Request, res: Response) => {
  // Return list of orders (can be filtered)
  res.json({
    success: true,
    count: serverOrders.length,
    orders: serverOrders
  });
});

// PATCH /api/orders/:id/status (Admin verifies D17 payment or changes status)
app.patch('/api/orders/:id/status', generalRateLimiter, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminPassword } = req.body;

  if (adminPassword !== 'admin123') {
    return res.status(401).json({ success: false, message: 'غير مصرح: كلمة مرور المشرف غير صحيحة' });
  }

  const validStatuses = ['pending_verification', 'processing', 'shipped', 'delivered'];
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
    message: `تم تحديث حالة الطلب (${order.trackingNumber}) إلى ${status}`,
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
