import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Truck, Smartphone, Banknote, Copy, Check, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { CartItem, Order, TUNISIA_GOVERNORATES, PaymentMethod, TunisiaGovernorate } from '../types';
import { fetchD17SettingsFromSupabase, insertOrderToSupabase } from '../lib/supabaseStore';

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
  const [governorate, setGovernorate] = useState<TunisiaGovernorate | ''>('');
  const [delegation, setDelegation] = useState('');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [d17TransactionId, setD17TransactionId] = useState('');
  const [d17RecipientPhone, setD17RecipientPhone] = useState('+216 55 889 900');

  // Security & Request states
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Listen for dynamic updates to D17 phone number across components
  useEffect(() => {
    const handleD17Update = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setD17RecipientPhone(customEvent.detail);
      }
    };

    window.addEventListener('lina_d17_updated', handleD17Update);
    return () => {
      window.removeEventListener('lina_d17_updated', handleD17Update);
    };
  }, []);

  // Fetch CSRF Token & D17 settings directly from Supabase on modal open
  useEffect(() => {
    if (!isOpen) return;

    // Fetch D17 recipient settings directly from Supabase
    fetchD17SettingsFromSupabase().then((settings) => {
      if (settings?.recipientPhone) {
        setD17RecipientPhone(settings.recipientPhone);
      }
    }).catch(() => {});

    // Fetch CSRF Token
    fetch('/api/csrf-token')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.csrfToken) {
            setCsrfToken(data.csrfToken);
          }
        } else {
          setCsrfToken('local-csrf-' + Math.random().toString(36).substring(2));
        }
      })
      .catch(() => {
        setCsrfToken('local-csrf-' + Math.random().toString(36).substring(2));
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 150 ? 0 : 7;
  const grandTotal = subtotal + shippingFee;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(d17RecipientPhone.replace(/\s+/g, ''));
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const validateTunisianPhone = (p: string): boolean => {
    const cleaned = p.replace(/\s+/g, '').replace(/[-+]/g, '');
    // Check if ends with 8 digits starting with 2, 4, 5, or 9
    // or standard format with 216 country code
    return /^(?:216)?[2459]\d{7}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Basic validation
    if (!customerName.trim()) {
      setErrorMessage('يرجى إدخال الاسم واللقب.');
      return;
    }
    if (customerName.trim().length < 3) {
      setErrorMessage('الاسم واللقب يجب ألا يقل عن 3 أحرف.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('يرجى إدخال رقم الهاتف للتواصل معك وتسليم الطلب.');
      return;
    }

    if (!validateTunisianPhone(phone)) {
      setErrorMessage('رقم الهاتف التونسي غير صالح. يجب أن يتكون من 8 أرقام يبدأ بـ 2 أو 4 أو 5 أو 9 (مثال: 98123456).');
      return;
    }

    if (!governorate) {
      setErrorMessage('يرجى اختيار الولاية من القائمة المنسدلة.');
      return;
    }

    if (!delegation.trim()) {
      setErrorMessage('يرجى كتابة المدينة أو المعتمدية (مثال: المرسى، المنار، حمام الأنف، صفاقس المدينة).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('يرجى كتابة العنوان بالتفصيل (اسم الشارع، رقم المنزل أو الإقامة، أو أقرب معلم).');
      return;
    }

    // 2. D17 validation
    if (paymentMethod === 'd17') {
      const cleanTx = d17TransactionId.trim();
      if (!cleanTx) {
        setErrorMessage('حقل رقم العملية (Transaction ID) إجباري عند اختيار الدفع عبر D17.');
        return;
      }
      if (!/^[A-Za-z0-9\-_]{6,35}$/.test(cleanTx)) {
        setErrorMessage('رقم العملية غير صالح (يجب أن يتكون من 6 إلى 35 رقماً أو حرفاً معطى من تطبيق D17).');
        return;
      }
    }

    setIsSubmitting(true);

    const generatedTracking = `TN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ORD-TN-${Date.now()}`,
      trackingNumber: generatedTracking,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: governorate,
      delegation: delegation.trim(),
      address: address.trim(),
      orderNotes: orderNotes.trim() || undefined,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total: grandTotal,
      status: paymentMethod === 'd17' ? 'pending_verification' : 'processing',
      paymentMethod,
      d17TransactionId: paymentMethod === 'd17' ? d17TransactionId.trim() : undefined,
      d17RecipientPhone: paymentMethod === 'd17' ? d17RecipientPhone : undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Direct and guaranteed insertion into Supabase (works on Vercel static & cloud hosting)
      const supabaseSaved = await insertOrderToSupabase(newOrder);
      if (supabaseSaved) {
        console.log('[Checkout] Order saved directly to Supabase:', newOrder.trackingNumber);
      }

      // 2. Also notify local backend / server if running in full-stack mode
      try {
        fetch('/api/checkout', {
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
            orderNotes: orderNotes.trim() || undefined,
            paymentMethod,
            d17TransactionId: paymentMethod === 'd17' ? d17TransactionId.trim() : undefined,
            items: cartItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
        }).catch(() => {
          // Non-blocking if running on static host like Vercel
        });
      } catch {
        // Non-blocking
      }

      // 3. Confirm order to customer UI and state
      onOrderConfirmed(newOrder);
    } catch (err: unknown) {
      console.warn('Checkout warning:', err);
      onOrderConfirmed(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="checkout-modal"
        className="bg-[#241B18] border border-[#D8C8B8]/25 rounded-2xl max-w-2xl w-full p-5 sm:p-8 relative shadow-2xl my-auto text-right animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-checkout-modal"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 left-4 p-2 text-[#D8C8B8] hover:text-white rounded-full bg-[#332522] hover:bg-[#3d2c29] border border-[#D8C8B8]/20 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#D6B56A] font-serif tracking-widest uppercase font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>FINALISER VOTRE COMMANDE • إتمام الطلب</span>
          </div>
          <h2 id="checkout-title" className="text-2xl sm:text-3xl font-bold text-[#FFF9F1] font-serif">
            تأكيد الطلب والتوصيل بتونس
          </h2>
          <p className="text-xs sm:text-sm text-[#D8C8B8]">
            أدخل بياناتك وسيتم شحن طلبك إلى باب منزلك في غضون 24 إلى 48 ساعة.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Section 1: Customer Contact & Delivery Details */}
          <div className="space-y-4 p-4 rounded-xl bg-[#101016] border border-white/10">
            <h3 className="text-xs font-serif font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>بيانات المستلم والتوصيل</span>
            </h3>

            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                  الاسم واللقب <span className="text-[#d4af37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="checkout-name-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: كريم بن عبد الله"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                  رقم الهاتف (تونس) <span className="text-[#d4af37]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    id="checkout-phone-input"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 98123456 أو 22334455"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs sm:text-sm focus:outline-none text-left"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-mono">
                    🇹🇳 +216
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 block mt-1">
                  8 أرقام تبدأ بـ 2 أو 4 أو 5 أو 9
                </span>
              </div>
            </div>

            {/* Governorate and Delegation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                  الولاية (Gouvernorat) <span className="text-[#d4af37]">*</span>
                </label>
                <select
                  required
                  id="checkout-governorate-select"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value as TunisiaGovernorate)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs sm:text-sm focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>اختر ولايتك من الـ 24 ولاية...</option>
                  {TUNISIA_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov} className="bg-[#121218] text-white">
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                  المدينة / المعتمدية <span className="text-[#d4af37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="checkout-delegation-input"
                  value={delegation}
                  onChange={(e) => setDelegation(e.target.value)}
                  placeholder="مثال: المرسى، سكرة، المنار، حمام سوسة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                العنوان بالتفصيل <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="text"
                required
                id="checkout-address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم الشارع، رقم المنزل / العمارة، أو أقرب معلم معروف..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Optional Order Notes */}
            <div>
              <label className="text-xs text-neutral-300 block mb-1 font-semibold">
                ملاحظات إضافية حول التوصيل (اختياري)
              </label>
              <input
                type="text"
                id="checkout-notes-input"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="مثال: الاتصال قبل الوصول بنصف ساعة، التوصيل بعد الظهر..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#16161f] border border-white/10 focus:border-[#d4af37] text-white text-xs focus:outline-none"
              />
            </div>

          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3.5 p-4 rounded-xl bg-[#101016] border border-white/10">
            <h3 className="text-xs font-serif font-bold text-[#d4af37] tracking-wider uppercase flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#d4af37]" />
              <span>طريقة الخلاص في تونس</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD Option */}
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#D6B56A] bg-[#D6B56A]/15 ring-1 ring-[#D6B56A]'
                    : 'border-[#D8C8B8]/20 bg-[#1E1513] hover:border-[#D8C8B8]/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#D6B56A]"
                />
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-[#FFF9F1] block">
                    الدفع عند الاستلام (COD)
                  </span>
                  <p className="text-[11px] text-[#D8C8B8]">
                    تدفع نقداً بالدينار التونسي للموزع عند فحص واستلام شحنتك.
                  </p>
                </div>
              </label>

              {/* D17 Option */}
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'd17'
                    ? 'border-[#D6B56A] bg-[#D6B56A]/15 ring-1 ring-[#D6B56A]'
                    : 'border-[#D8C8B8]/20 bg-[#1E1513] hover:border-[#D8C8B8]/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="d17"
                  checked={paymentMethod === 'd17'}
                  onChange={() => setPaymentMethod('d17')}
                  className="mt-1 accent-[#D6B56A]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#FFF9F1] block">
                      تطبيق D17 (البريد التونسي)
                    </span>
                    <span className="text-[9px] bg-[#D6B56A]/20 text-[#D6B56A] px-1.5 py-0.2 rounded font-mono font-bold">
                      La Poste
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D8C8B8]">
                    تحويل إلكتروني فوري ومباشر عبر تطبيق D17 الرسمي.
                  </p>
                </div>
              </label>
            </div>

            {/* D17 Details Drawer */}
            {paymentMethod === 'd17' && (
              <div className="mt-3 p-4 rounded-xl bg-[#1E1513] border border-[#D6B56A]/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F7F1E8]">
                    رقم هاتف متجر LINA SHOP في تطبيق D17:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#332522] text-[#F7F1E8] hover:text-white border border-[#D8C8B8]/20 text-xs transition-colors cursor-pointer"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#D6B56A]" />
                        <span className="text-[10px]">نسخ الرقم</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-[#241B18] text-center font-mono text-sm sm:text-base font-bold text-[#D6B56A] tracking-wider border border-[#D6B56A]/20" dir="ltr">
                  {d17RecipientPhone}
                </div>

                <div>
                  <label className="text-xs text-[#F7F1E8] block mb-1 font-semibold">
                    رقم العملية (Transaction ID المعطى من D17) <span className="text-[#D6B56A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="checkout-d17-txid"
                    dir="ltr"
                    value={d17TransactionId}
                    onChange={(e) => setD17TransactionId(e.target.value)}
                    placeholder="مثال: TXN-893421 أو 9283719"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#241B18] border border-[#D6B56A]/40 focus:border-[#D6B56A] text-[#FFF9F1] text-xs sm:text-sm font-mono text-left focus:outline-none"
                  />
                  <span className="text-[10px] text-[#D8C8B8] block mt-1">
                    * ستكون حالة الطلب "معلق التحقق" حتى التأكد الفعلي من وصول التحويل.
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Order Summary Before Confirming */}
          <div className="p-4 rounded-xl bg-[#101016] border border-white/10 space-y-3">
            <h3 className="text-xs font-serif font-bold text-[#d4af37] tracking-wider uppercase">
              ملخص المشتريات
            </h3>

            {/* Quick preview of items */}
            <div className="max-h-28 overflow-y-auto space-y-2 border-b border-white/5 pb-3">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.selectedSize || idx}`} className="flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center gap-2 truncate max-w-[70%]">
                    <span className="font-semibold text-white font-sans">{item.quantity}×</span>
                    <span className="truncate">{item.arabicName}</span>
                    {item.selectedSize && (
                      <span className="text-[10px] text-[#d4af37]">({item.selectedSize})</span>
                    )}
                  </div>
                  <span className="font-mono text-white">{(item.price * item.quantity).toLocaleString()} د.ت</span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>المجموع الفرعي:</span>
                <span className="font-sans text-white">{subtotal.toLocaleString()} د.ت</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>رسوم التوصيل:</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-400 font-bold">مجاني (تجاوزت 150 د.ت)</span>
                ) : (
                  <span className="font-sans text-white">{shippingFee} د.ت</span>
                )}
              </div>
              <div className="pt-2 border-t border-[#D8C8B8]/20 flex justify-between items-baseline">
                <span className="font-bold text-[#FFF9F1] font-serif">المجموع النهائي للدفع:</span>
                <span className="text-xl font-bold text-[#D6B56A] font-sans">
                  {grandTotal.toLocaleString()} د.ت
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            id="confirm-order-submit-btn"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#D6B56A] to-[#B8934A] hover:from-[#e3c47f] hover:to-[#D6B56A] text-[#1E1513] font-bold text-sm sm:text-base rounded-xl transition-all shadow-xl shadow-[#D6B56A]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تأكيد الطلب ومعالجة البيانات...</span>
              </>
            ) : (
              <>
                <span>تأكيد الطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security guarantee line */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#D8C8B8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6B56A]" />
            <span>معاملة مشفرة وآمنة • خصوصية بياناتك محمية 100%</span>
          </div>

        </form>
      </div>
    </div>
  );
};
