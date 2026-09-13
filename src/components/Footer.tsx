import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';

interface FooterProps {
  onShowToast: (title: string, message: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowToast }) => {
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
    <footer id="contact" className="bg-[#08080a] border-t border-white/10 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Box */}
        <div id="newsletter-card" className="rounded-3xl bg-gradient-to-r from-[#101014] via-[#17171d] to-[#101014] border border-[#d4af37]/30 p-8 sm:p-12 mb-16 text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-xs tracking-widest text-[#d4af37] font-bold uppercase">CLUB PRIVÉ</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              انضم إلى نادي لينا للنخبة العطرية
            </h3>
            <p className="text-neutral-300 text-sm">
              اشترك في نشرتنا البريدية لتصلك إصدارات النيش المحدودة أولاً بأول، مع خصم خاص <span className="text-[#d4af37] font-bold">15%</span> على طلبك الأول.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  id="footer-email-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني هنا..."
                  className="w-full px-5 py-3.5 rounded-xl bg-[#08080a]/90 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-right"
                />
              </div>
              <button
                type="submit"
                id="footer-subscribe-btn"
                className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold text-sm rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <span>انضمام الآن</span>
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-emerald-400 pt-2 font-medium flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                <span>شكراً لانضمامك! تم تفعيل كود الخصم (LINA15) بنجاح.</span>
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#101014] text-[#d4af37] font-serif text-lg font-bold">
                L
              </div>
              <span className="font-sans text-lg font-bold tracking-[0.2em] text-white uppercase">Lina Shop</span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              متجر لينا شوب - وجهتكم الأولى في تونس للعطور الفاخرة وعطور النيش المصممة بعناية فائقة. نضمن التوصيل السريع والموثوق لكافة ولايات تونس الـ 24.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p>📍 المقر: تونس العاصمة، الجمهورية التونسية (توصيل لكافة الـ 24 ولاية)</p>
              <p>✉️ البريد الإلكتروني: contact@linashop.tn</p>
              <p>📞 خدمة الحرفاء: +216 71 234 567 / +216 98 123 456</p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3 text-right">
            <h4 className="text-sm font-bold text-white font-serif">أقسام المتجر</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">عطور النيش الحصرية</a></li>
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">العطور الشرقية والعود</a></li>
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">عطور المسك والزهور النادرة</a></li>
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">العطور اليومية الأنيقة</a></li>
              <li><a href="#products" className="hover:text-[#d4af37] transition-colors">أطقم الهدايا الفاخرة</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3 text-right">
            <h4 className="text-sm font-bold text-white font-serif">خدمة العملاء</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#" className="hover:text-[#d4af37] transition-colors">الشحن والتوصيل السريع</a></li>
              <li><a href="#" className="hover:text-[#d4af37] transition-colors">سياسة الاستبدال والاسترجاع الذهبية</a></li>
              <li><a href="#" className="hover:text-[#d4af37] transition-colors">دليل اختيار عطرك الخاص</a></li>
              <li><a href="#" className="hover:text-[#d4af37] transition-colors">الأسئلة الأكثر شيوعاً</a></li>
              <li><a href="#" className="hover:text-[#d4af37] transition-colors">تتبع حالة الشحنة</a></li>
            </ul>
          </div>

          {/* Payments and Socials */}
          <div className="space-y-4 text-right">
            <h4 className="text-sm font-bold text-white font-serif">وسائل التواصل</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#101014] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors" aria-label="Instagram">
                <span className="font-bold text-xs">IG</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#101014] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors" aria-label="TikTok">
                <span className="font-bold text-xs">TK</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#101014] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors" aria-label="X">
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#101014] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors" aria-label="Snapchat">
                <span className="font-bold text-xs">SC</span>
              </a>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-neutral-400 block mb-2">طرق الخلاص المعتمدة بتونس:</span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-300">
                <span className="px-2 py-1 bg-[#101014] rounded border border-[#d4af37]/30 text-[#d4af37]">دفع عند الاستلام</span>
                <span className="px-2 py-1 bg-[#101014] rounded border border-white/10">Carte Bancaire</span>
                <span className="px-2 py-1 bg-[#101014] rounded border border-white/10">D17</span>
                <span className="px-2 py-1 bg-[#101014] rounded border border-white/10">Konnect</span>
                <span className="px-2 py-1 bg-[#101014] rounded border border-white/10">Visa / Mastercard</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Lina Shop تونس. جميع الحقوق محفوظة لمتجر لينا للعطور الفاخرة.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#d4af37] transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">الشروط والأحكام</a>
            <span className="text-neutral-500">توصيل لكافة ولايات تونس الـ 24 🇹🇳</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
