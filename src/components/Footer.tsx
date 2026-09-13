import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, ShieldCheck } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  onNavigateView: (view: 'home' | 'shop' | 'about' | 'contact' | 'tracking' | 'admin') => void;
  onNavigateCategory: (category: string) => void;
  settings?: WebsiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateView,
  onNavigateCategory,
  settings,
}) => {
  const storePhone = settings?.storePhone || '+216 55 123 456';
  const storeEmail = settings?.storeEmail || 'contact@linashop.tn';
  const storeAddress = settings?.storeAddress || 'تونس، شارع الحبيب بورقيبة';

  return (
    <footer id="footer" className="bg-[#0A0A0A] text-[#E8E1D5] border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand & Philosophy (2 spans on desktop) */}
          <div className="lg:col-span-2 text-right space-y-5">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-[0.22em] text-[#E8E1D5] uppercase">
                  LINA SHOP
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
              </div>
              <span className="text-[9px] tracking-[0.35em] text-[#C9A227] font-serif uppercase mt-0.5">
                HAUTE PARFUMERIE
              </span>
            </div>

            <p className="text-xs text-[#ACA394] leading-relaxed font-sans font-light max-w-sm">
              دار عطور تونسية فاخرة تُعنى بابتكار وتوفير أرقى التوليفات العطرية المستوحاة من سحر الشرق وعراقة العطور العالمية. حضور ملكي يدوم في كل تفاصيلك.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#141414] border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#141414] border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/21655123456`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#141414] border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation & Collections */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#E8E1D5] uppercase tracking-wider block">
              الأقسام والمجموعات
            </span>
            <ul className="space-y-2.5 text-xs text-[#ACA394] font-serif">
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('الكل');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  جميع العطور
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عطور نسائية');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  عطور نسائية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عطور رجالية');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  عطور رجالية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عطور فاخرة');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  العطور الفاخرة (Niche)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عروض خاصة');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#C9A227] transition-colors text-[#C9A227]"
                >
                  العروض والتخفيضات
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Guarantees */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#E8E1D5] uppercase tracking-wider block">
              خدمة العملاء
            </span>
            <ul className="space-y-2.5 text-xs text-[#ACA394] font-serif">
              <li>
                <button
                  onClick={() => onNavigateView('tracking')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  تتبع حالة طلبيتك
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('about')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  عن دار لينا شوب
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('contact')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  تواصل معنا
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C9A227] transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('admin')}
                  className="hover:text-[#C9A227] transition-colors text-neutral-500 hover:text-white text-[11px]"
                >
                  بوابة المشرف
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info in Tunisia */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#E8E1D5] uppercase tracking-wider block">
              اتصل بنا في تونس
            </span>
            <ul className="space-y-3 text-xs text-[#ACA394] font-serif">
              <li className="flex items-center justify-end gap-2">
                <span>{storePhone}</span>
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>{storeEmail}</span>
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>{storeAddress}</span>
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-[#C9A227] font-serif uppercase block">
                  التوصيل السريع
                </span>
                <span className="text-xs text-[#E8E1D5]">24 إلى 48 ساعة لكامل ولايات تونس</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-serif">
          <p>© {new Date().getFullYear()} LINA SHOP • HAUTE PARFUMERIE. جميع الحقوق محفوظة في الجمهورية التونسية.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#ACA394]">
            <span>الدفع عند الاستلام (COD)</span>
            <span>•</span>
            <span>البريد التونسي D17</span>
            <span>•</span>
            <span>عطور أصلية 100%</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
