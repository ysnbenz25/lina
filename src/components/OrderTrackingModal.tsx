import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, Smartphone, Banknote, ShieldAlert, Package, MapPin, Phone, User, Calendar } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTrackingCode?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialTrackingCode = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialTrackingCode) {
      return orders.find((o) => o.trackingNumber.toUpperCase() === initialTrackingCode.toUpperCase()) || null;
    }
    return orders.length > 0 ? orders[0] : null;
  });
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    const cleanPhone = searchCode.trim().replace(/\s+/g, '');
    
    // Support search by tracking number OR customer phone number
    const found = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === cleanCode ||
        o.phone.replace(/\s+/g, '').includes(cleanPhone)
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const isD17 = searchedOrder?.paymentMethod === 'd17';

  // Determine timeline step indexes
  // 0: تم استلام الطلب
  // 1: جاري التجهيز
  // 2: تم الشحن
  // 3: تم التوصيل
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending_verification':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  const timelineSteps = [
    { title: "تم استلام الطلب", desc: "تم تسجيل وتأكيد بيانات الطلب بنجاح", sub: "Confirmation reçue" },
    { title: "جاري التجهيز", desc: "تغليف العطر الفاخر وإرفاق عينة التجربة المجانية", sub: "En préparation" },
    { title: "تم الشحن", desc: "الشحنة مع مندوب التوصيل في طريقها لولايتك", sub: "En cours de livraison" },
    { title: "تم التوصيل", desc: "تم تسليم الطرد واستلام المبلغ بالدينار التونسي", sub: "Colis livré avec succès" },
  ];

  return (
    <div
      id="tracking-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="tracking-modal"
        className="bg-[#0c0c11] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-5 sm:p-8 relative shadow-2xl my-auto text-right animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-full bg-[#14141c] hover:bg-[#1f1f2a] border border-white/10 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#d4af37] font-serif uppercase tracking-widest font-bold block">
              SUIVI DE COLIS EN TUNISIE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
              تتبع الشحنة التونسية
            </h3>
            <p className="text-xs text-neutral-400">
              تابع حالة تجهيز عطرك ومسار التوصيل في كافة ولايات الجمهورية
            </p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="أدخل كود التتبع (مثال: TN-784291) أو رقم الهاتف..."
            dir="ltr"
            className="flex-1 px-4 py-3 rounded-xl bg-[#121218] border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] text-left transition-colors font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>تتبع الآن</span>
          </button>
        </form>

        {/* Search Result */}
        {searchedOrder ? (
          <div className="space-y-6">
            
            {/* Header summary card */}
            <div className="p-4 sm:p-5 bg-[#101016] rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 block font-serif">رقم بوليصة التتبع:</span>
                <span className="text-xl sm:text-2xl font-bold text-[#d4af37] font-mono tracking-wider">
                  {searchedOrder.trackingNumber}
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs text-neutral-400 block">تاريخ التسجيل:</span>
                <span className="text-xs font-bold text-white font-mono">{searchedOrder.createdAt}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
                  {searchedOrder.status === 'delivered' ? '✓ تم التسليم' : 'الشحنة قيد المتابعة'}
                </span>
              </div>
            </div>

            {/* D17 Alert if pending verification */}
            {isD17 && searchedOrder.status === 'pending_verification' && (
              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold block text-amber-300">الطلب معلق بانتظار تأكيد تحويل D17:</strong>
                  <p>
                    تم استلام رقم العملية المعطى من D17 (<span className="font-mono text-white font-bold">{searchedOrder.d17TransactionId}</span>). جاري مراجعة الإشعار في حساب البريد وسينتقل طلبك لمرحلة "جاري التجهيز" فور التأكيد.
                  </p>
                </div>
              </div>
            )}

            {/* Progress Timeline: 4 exact steps */}
            <div className="p-5 bg-[#101016] rounded-xl border border-[#d4af37]/25 space-y-4">
              <h4 className="text-xs font-serif font-bold text-white tracking-wider flex items-center justify-between">
                <span>مراحل تقدم الشحنة (Timeline):</span>
                <span className="text-[#d4af37] font-sans text-[11px]">
                  المرحلة {currentStep + 1} من 4
                </span>
              </h4>

              <div className="relative pt-2">
                {/* Connecting Line */}
                <div className="absolute top-6 right-6 left-6 h-0.5 bg-white/10 -z-0 hidden sm:block">
                  <div
                    className="h-full bg-[#d4af37] transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                  {timelineSteps.map((step, idx) => {
                    const isCompleted = currentStep >= idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div
                        key={idx}
                        className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2.5 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-[#181822] sm:bg-transparent border sm:border-0 border-[#d4af37]/30'
                            : ''
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all ${
                            isCompleted
                              ? 'bg-[#d4af37] text-[#070709] shadow-md shadow-[#d4af37]/30 scale-105'
                              : 'bg-[#181822] text-neutral-500 border border-white/10'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        {/* Text */}
                        <div className="text-right sm:text-center space-y-0.5">
                          <h5
                            className={`text-xs font-bold font-serif ${
                              isCompleted ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {step.title}
                          </h5>
                          <span className="text-[10px] text-[#d4af37]/70 block font-serif">
                            {step.sub}
                          </span>
                          <p className="text-[10px] text-neutral-400 sm:line-clamp-2">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Customer & Delivery Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Customer Box */}
              <div className="p-4 bg-[#101016] rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#d4af37] font-semibold font-serif border-b border-white/5 pb-1.5">
                  <User className="w-4 h-4" />
                  <span>بيانات الحريف</span>
                </div>
                <div className="space-y-1 text-neutral-300">
                  <p><strong className="text-white">الاسم واللقب:</strong> {searchedOrder.customerName}</p>
                  <p><strong className="text-white">الهاتف:</strong> <span dir="ltr" className="font-mono text-neutral-200">{searchedOrder.phone}</span></p>
                  <p>
                    <strong className="text-white">طريقة الدفع:</strong>{' '}
                    <span className="text-[#d4af37]">
                      {isD17 ? 'تطبيق D17 (البريد التونسي)' : 'الدفع عند الاستلام (COD)'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Address Box */}
              <div className="p-4 bg-[#101016] rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#d4af37] font-semibold font-serif border-b border-white/5 pb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>عنوان التوصيل في تونس</span>
                </div>
                <div className="space-y-1 text-neutral-300">
                  <p><strong className="text-white">الولاية:</strong> {searchedOrder.city}</p>
                  {searchedOrder.delegation && (
                    <p><strong className="text-white">المدينة / المعتمدية:</strong> {searchedOrder.delegation}</p>
                  )}
                  <p><strong className="text-white">العنوان:</strong> {searchedOrder.address}</p>
                  {searchedOrder.orderNotes && (
                    <p><strong className="text-white">ملاحظات:</strong> {searchedOrder.orderNotes}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 bg-[#101016] rounded-xl border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white font-serif flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#d4af37]" />
                  <span>محتويات الطرد ({searchedOrder.items.length} عطور)</span>
                </span>
                <span className="font-bold text-[#d4af37] font-sans text-sm">
                  المجموع: {searchedOrder.total} د.ت
                </span>
              </div>

              <div className="space-y-2">
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.arabicName} className="w-9 h-9 rounded object-cover border border-white/10" />
                      <div>
                        <span className="text-white font-medium block">{item.arabicName}</span>
                        <span className="text-[10px] text-neutral-400 font-sans">{item.quantity} × {item.price} د.ت</span>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-white">{(item.price * item.quantity).toLocaleString()} د.ت</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          hasSearched && (
            <div className="text-center py-12 bg-[#101016] rounded-xl border border-white/10 space-y-3">
              <p className="text-sm text-neutral-300 font-serif">
                لم يتم العثور على طلب مسجل برقم التتبع أو الهاتف: <strong className="text-white">{searchCode}</strong>
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                يرجى التأكد من كتابة الكود بشكل صحيح (مثال: TN-784291) أو رقم هاتفك التونسي المستخدم أثناء الطلب.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
};
