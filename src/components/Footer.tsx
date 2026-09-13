import React, { useState } from 'react';
import { Mail, Send, Check, Phone, MapPin, Clock, Truck, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onShowToast: (title: string, message: string) => void;
  onOpenTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowToast, onOpenTracking }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      onShowToast('تم الاشتراك بنجاح!', 'تم إرسال كود الخصم 15% (LINA15) إلى بريدك بنجاح.');
      setEmail('');
    }
  };

  return (
    <footer id="contact" className="bg-[#050507] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div id="newsletter-card" className="rounded-3xl bg-gradient-to-r from-[#0c0c11] via-[#14141c] to-[#0c0c11] border border-[#d4af37]/30 p-8 sm:p-12 mb-16 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-xs tracking-[0.25em] text-[#d4af37] font-serif uppercase font-bold">
              CLUB PRIVÉ • ÉDITION LIMITÉE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              انضم إلى نادي لينا للنخبة العطرية
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              اشترك في نشرتنا البريدية الحصرية لتصلك عينات النيش الجديدة فور وصولها، مع خصم خاص <span className="text-[#d4af37] font-bold">15%</span> على طلبك الأول.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                id="footer-email-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني هنا..."
                className="w-full px-5 py-3.5 rounded-xl bg-[#08080a] border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] text-right"
              />
              <button
                type="submit"
                id="footer-subscribe-btn"
                className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#d4af37]/20 shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>انضمام للنادي</span>
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-emerald-400 pt-2 font-medium flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>شكراً لانضمامك! تم تفعيل كود الخصم الحصري (LINA15) بنجاح.</span>
              </p>
            )}
          </div>
        </div>

        {/* 4-Column Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/5 text-right">
          
          {/* Brand & Identity Column (5 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center bg-[#101015] text-[#d4af37] font-serif text-xl font-bold">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-[0.18em] text-white uppercase">
                  Lina Shop
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#d4af37] font-serif -mt-0.5">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
              دار عطور تونسية راقية متخصصة في ابتكار وتوفير أندر عطور النيش والروائح الشرقية والفرنسية الملكية، بأعلى درجات النقاء والثبات مع التوصيل لكافة ولايات الجمهورية الـ 24.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              <span>عطور أصلية 100% مع ضمان التجربة الذهبي</span>
            </div>
          </div>

          {/* Quick Navigation Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white font-serif tracking-widest uppercase text-[#d4af37]">
              روابط المتجر
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#hero" className="hover:text-[#d4af37] transition-colors">الرئيسية</a></li>
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">كافة العطور</a></li>
              <li><a href="#categories" className="hover:text-[#d4af37] transition-colors">تصنيفات العطور</a></li>
              <li><a href="#elite-collection" className="hover:text-[#d4af37] transition-colors">مجموعة النخبة</a></li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer text-right"
                >
                  تتبع حالة الشحنة
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Delivery Info (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white font-serif tracking-widest uppercase text-[#d4af37]">
              خدمة الحرفاء والتوصيل
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>شحن وتوصيل 24 - 48 ساعة لكافة الـ 24 ولاية</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>شحن مجاني للطلبات بقيمة 150 د.ت فما فوق</span>
              </li>
              <li><a href="#faq" className="hover:text-[#d4af37] transition-colors">الأسئلة الشائعة (FAQ)</a></li>
              <li><a href="#why-lina" className="hover:text-[#d4af37] transition-colors">الضمان الذهبي وإرجاع الطلبات</a></li>
              <li><a href="#reviews" className="hover:text-[#d4af37] transition-colors">آراء وتجارب الحرفاء</a></li>
            </ul>
          </div>

          {/* Contact Info Tunisia (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white font-serif tracking-widest uppercase text-[#d4af37]">
              تواصل معنا في تونس
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>تونس العاصمة، الجمهورية التونسية (توصيل لكامل تراب الجمهورية)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span dir="ltr" className="font-mono text-neutral-300">+216 98 123 456 / +216 71 234 567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="font-mono">contact@linashop.tn</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] text-neutral-400 block mb-1.5">طرق الخلاص بتونس:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#101015] border border-[#d4af37]/30 text-[#d4af37] text-[10px]">
                    الدفع عند الاستلام (COD)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#101015] border border-white/10 text-neutral-300 text-[10px]">
                    تطبيق D17
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Location */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} Lina Shop Tunisia. دار لينا للعطور الفاخرة - جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>توصيل لكافة ولايات تونس الـ 24 🇹🇳</span>
            <span className="text-neutral-600">•</span>
            <span>Haute Parfumerie Tunisienne</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
