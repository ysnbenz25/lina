import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Truck, Smartphone, Banknote, Copy, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { CartItem, Order, TUNISIA_GOVERNORATES, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderConfirmed: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderConfirmed,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [delegation, setDelegation] = useState('');
  const [address, setAddress] = useState('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [d17TransactionId, setD17TransactionId] = useState('');
  const [d17RecipientPhone, setD17RecipientPhone] = useState('+216 55 889 900');
  
  // Security & Request states
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Fetch CSRF Token & D17 settings on modal open
  useEffect(() => {
    if (!isOpen) return;

    // Fetch CSRF Token
    fetch('/api/csrf-token')
      .then((res) => res.json())
      .then((data) => {
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
      })
      .catch(() => {
        // Fallback for standalone/offline
        setCsrfToken('local-csrf-' + Math.random().toString(36).substring(2));
      });

    // Fetch D17 recipient settings
    fetch('/api/settings/d17')
      .then((res) => res.json())
      .then((data) => {
        if (data.d17Settings?.recipientPhone) {
          setD17RecipientPhone(data.d17Settings.recipientPhone);
        }
      })
      .catch(() => {
        // Fallback default
        setD17RecipientPhone('+216 55 889 900');
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // Local estimate (actual calculation is strictly authoritative on server!)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 150 ? 0 : 7;
  const estimatedTotal = subtotal + shippingFee;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(d17RecipientPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validations before sending
    if (!customerName.trim() || !phone.trim() || !governorate.trim() || !delegation.trim() || !address.trim()) {
      setErrorMessage('يرجى ملء كافة الحقول الإجبارية وبيانات التوصيل.');
      return;
    }

    if (paymentMethod === 'd17') {
      const cleanTx = d17TransactionId.trim();
      if (!cleanTx) {
        setErrorMessage('حقل رقم العملية (Transaction ID) إجباري عند الدفع عبر D17.');
        return;
      }
      if (!/^[A-Za-z0-9\-_]{6,35}$/.test(cleanTx)) {
        setErrorMessage('رقم العملية غير صالح (يجب أن يتكون من 6 إلى 35 رقماً أو حرفاً بدون رموز خاصة).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          governorate,
          delegation: delegation.trim(),
          address: address.trim(),
          paymentMethod,
          d17TransactionId: paymentMethod === 'd17' ? d17TransactionId.trim() : undefined,
          // Only perfume IDs and quantities are sent! Server calculates authoritative prices
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(result.message || 'تم تجاوز الحد الأقصى للمحاولات (5 محاولات كل 15 دقيقة). يرجى الانتظار لحماية النظام.');
        }
        throw new Error(result.message || 'فشلت معالجة الطلب في الخادم.');
      }

      if (result.success && result.order) {
        // Sync refreshed CSRF token
        if (result.newCsrfToken) {
          setCsrfToken(result.newCsrfToken);
        }

        // Map backend ServerOrder to client Order
        const confirmedOrder: Order = {
          id: result.order.id,
          trackingNumber: result.order.trackingNumber,
          customerName: result.order.customerName,
          phone: result.order.phone,
          city: result.order.city,
          delegation: result.order.delegation,
          address: result.order.address,
          items: [...cartItems],
          subtotal: result.order.subtotal,
          shippingFee: result.order.shippingFee,
          total: result.order.total,
          status: result.order.status,
          paymentMethod: result.order.paymentMethod,
          d17TransactionId: result.order.d17TransactionId,
          d17RecipientPhone: result.order.d17RecipientPhone,
          createdAt: result.order.createdAt,
        };

        onOrderConfirmed(confirmedOrder);
      } else {
        throw new Error('استجابة غير متوقعة من الخادم.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقاً.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="checkout-modal"
        className="bg-[#101014] border border-[#d4af37]/40 rounded-2xl max-w-xl w-full p-5 sm:p-7 relative shadow-2xl my-auto text-right animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Security Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
              بوابة الدفع الآمن وتأكيد الشحن
            </h3>
            <p className="text-xs text-[#d4af37]">
              توصيل لكافة ولايات تونس الـ 24 مع خياري COD وتطبيق D17 🇹🇳
            </p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-red-300">تنبيه أمني / خطأ:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Order Summary Pill */}
        <div className="p-3 bg-[#08080a] rounded-xl border border-white/5 mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">عدد العطور: ({cartItems.length})</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400">
              الشحن: {shippingFee === 0 ? <strong className="text-emerald-400">مجاني 🚚</strong> : `${shippingFee} د.ت`}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] ml-1">المبلغ الإجمالي:</span>
            <span className="text-[#d4af37] font-bold font-sans text-sm sm:text-base">
              {estimatedTotal.toLocaleString()} د.ت
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section 1: Customer Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                الاسم واللقب *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: حسام التونسي"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                رقم الهاتف الجوال بتونس *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-neutral-400 font-mono select-none" dir="ltr">
                  +216
                </span>
                <input
                  type="tel"
                  required
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="20 123 456"
                  dir="ltr"
                  className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-left font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Governorate & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>الولاية التونسية (24 ولاية) *</span>
              </label>
              <select
                required
                disabled={isSubmitting}
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080a] border border-[#d4af37]/40 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="" disabled className="bg-[#101014] text-neutral-400">
                  -- اختر الولاية من القائمة --
                </option>
                {TUNISIA_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov} className="bg-[#101014] text-white">
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                المعتمدية / المنطقة *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={delegation}
                onChange={(e) => setDelegation(e.target.value)}
                placeholder="مثال: رادس، المنزه، قرطاج، أريانة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              العنوان بالتفصيل (الشارع، رقم المسكن أو المعلم القريب) *
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: 14 نهج الطيب المهيري، عمارة الأمل، الطابق 2..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
            />
          </div>

          {/* Section 3: PAYMENT METHOD SELECTION */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-white mb-2">
              طريقة الدفع المعتمدة *
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Option A: Cash On Delivery (COD) */}
              <div
                onClick={() => !isSubmitting && setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-md'
                    : 'bg-[#08080a] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${paymentMethod === 'cod' ? 'bg-[#d4af37] text-[#08080a]' : 'bg-white/5 text-neutral-400'}`}>
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">الدفع عند الاستلام (COD)</span>
                    {paymentMethod === 'cod' && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    الدفع نقداً لساعي التوصيل بعد معاينة وفحص العطر عند باب منزلك.
                  </p>
                </div>
              </div>

              {/* Option B: D17 Mobile Money (La Poste Tunisienne) */}
              <div
                onClick={() => !isSubmitting && setPaymentMethod('d17')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'd17'
                    ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-md'
                    : 'bg-[#08080a] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${paymentMethod === 'd17' ? 'bg-[#d4af37] text-[#08080a]' : 'bg-white/5 text-neutral-400'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">تطبيق D17 (البريد التونسي)</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#d4af37] text-[#08080a] font-black">فوري</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    تحويل مباشر عبر محفظة D17 الذكية مع التحقق الآمن من رقم العملية.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: D17 SPECIFIC FIELDS & INSTRUCTIONS (IF D17 SELECTED) */}
          {paymentMethod === 'd17' && (
            <div className="p-4 rounded-2xl bg-[#08080a] border border-[#d4af37]/40 space-y-3.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                  <Smartphone className="w-4 h-4" />
                  <span>بيانات تحويل D17 المعتمدة لمتجر لينا:</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium">
                  حالة الطلب: معلق حتى التحقق
                </span>
              </div>

              {/* Recipient Phone with Copy Button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#101014] border border-white/10">
                <div>
                  <span className="text-[11px] text-neutral-400 block">رقم الهاتف المستقبل (تطبيق D17):</span>
                  <strong className="text-base font-bold text-white font-mono" dir="ltr">
                    {d17RecipientPhone}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#08080a] text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'تم النسخ' : 'نسخ الرقم'}</span>
                </button>
              </div>

              {/* Instructions steps */}
              <div className="text-[11px] text-neutral-300 space-y-1 bg-[#101014] p-3 rounded-xl border border-white/5">
                <p className="font-semibold text-[#d4af37]">خطوات إتمام الدفع عبر D17:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-neutral-400 pr-1">
                  <li>افتح تطبيق <strong>D17</strong> في هاتفك واختر <strong>تحويل أموال (Transfert d&apos;argent)</strong>.</li>
                  <li>حوّل المبلغ المطلوب <strong className="text-white font-sans">({estimatedTotal} د.ت)</strong> للرقم أعلاه.</li>
                  <li>انسخ <strong>رقم العملية (N° de transaction / Transaction ID)</strong> وضعه في الحقل الإجباري أدناه.</li>
                </ol>
              </div>

              {/* Compulsory D17 Transaction ID field */}
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  رقم العملية المعطى من تطبيق D17 (Transaction ID) *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={d17TransactionId}
                  onChange={(e) => setD17TransactionId(e.target.value.replace(/[^A-Za-z0-9\-_]/g, ''))}
                  placeholder="مثال: 84920194 أو TXN-94021"
                  dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-[#d4af37] text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all text-left placeholder-neutral-500"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  * سيتم وضع الطلب بحالة <strong>&quot;معلق / بانتظار التحقق&quot;</strong> وتأكيده آلياً بمجرد مطابقة التحويل في سجلات المتجر.
                </p>
              </div>
            </div>
          )}

          {/* Security Guarantee & Anti-Tampering Notice */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>نظام مؤمن ضد هجمات التلاعب وCSRF ومحمي بجدار ناري</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
              <Truck className="w-3.5 h-3.5" />
              <span>تغطية كاملة لـ 24 ولاية</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] disabled:opacity-60 text-[#08080a] font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#d4af37]/20 active:scale-98 mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق الأمني وتسجيل الطلب في الخادم...</span>
              </>
            ) : (
              <span>
                {paymentMethod === 'd17'
                  ? `تأكيد طلب D17 وإرسال رقم العملية (${estimatedTotal.toLocaleString()} د.ت)`
                  : `تأكيد الطلب وتوليد كود التتبع الآن (${estimatedTotal.toLocaleString()} د.ت)`}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
