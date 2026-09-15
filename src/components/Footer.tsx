import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, ShieldCheck } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  onNavigateView?: (view?: any) => void;
  onNavigateCategory?: (category?: any) => void;
  settings?: WebsiteSettings;
  websiteSettings?: WebsiteSettings;
  onShowToast?: (title: string, message: string) => void;
  onOpenTracking?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateView = (_view?: any) => {},
  onNavigateCategory = (_category?: any) => {},
  settings,
  websiteSettings,
  onShowToast,
  onOpenTracking,
  onOpenAdmin,
}) => {
  const activeSettings = websiteSettings || settings;
  const storePhone = activeSettings?.phone || '+216 55 889 900';
  const storeEmail = activeSettings?.email || 'contact@linashop.tn';
  const storeAddress = activeSettings?.address || 'تونس، شارع الحبيب بورقيبة';

  return (
    <footer id="footer" className="bg-[#1A1311] text-[#F7F1E8] border-t border-[#D8C8B8]/20 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-[#D8C8B8]/15">
          
          {/* Column 1: Brand & Philosophy (2 spans on desktop) */}
          <div className="lg:col-span-2 text-right space-y-5">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-[0.22em] text-[#FFF9F1] uppercase">
                  LINA SHOP
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D6B56A]" />
              </div>
              <span className="text-[10px] tracking-[0.35em] text-[#D6B56A] font-serif uppercase mt-0.5 font-bold">
                PARFUMS & HUILES PARFUMÉES • تونس
              </span>
            </div>

            <p className="text-xs text-[#D8C8B8] leading-relaxed font-sans font-normal max-w-sm">
              متجر تونسي متخصص في أرقى الزيوت العطرية والتركيبات المستوحاة من أشهر العطور العالمية. جودة وثبات ممتاز بأسعار رمزية ومناسبة للجميع.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#332522] border border-[#D8C8B8]/20 hover:border-[#D6B56A] hover:text-[#D6B56A] flex items-center justify-center transition-colors cursor-pointer text-[#D8C8B8]"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#332522] border border-[#D8C8B8]/20 hover:border-[#D6B56A] hover:text-[#D6B56A] flex items-center justify-center transition-colors cursor-pointer text-[#D8C8B8]"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/21655123456`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#332522] border border-[#D8C8B8]/20 hover:border-[#D6B56A] hover:text-[#D6B56A] flex items-center justify-center transition-colors cursor-pointer text-[#D8C8B8]"
                aria-label="WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation & Collections */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#FFF9F1] uppercase tracking-wider block">
              الأقسام والمجموعات
            </span>
            <ul className="space-y-2.5 text-xs text-[#D8C8B8] font-serif">
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('الكل');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  جميع العطور والزيوت
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عطور نسائية');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  تركيبات نسائية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عطور رجالية');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  تركيبات رجالية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('العطور الزيتية');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  زيوت عطرية مركزة
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateCategory('عروض خاصة');
                    onNavigateView('shop');
                  }}
                  className="hover:text-[#D6B56A] transition-colors text-[#C98F91] cursor-pointer"
                >
                  العروض والتخفيضات
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Guarantees */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#FFF9F1] uppercase tracking-wider block">
              خدمة العملاء
            </span>
            <ul className="space-y-2.5 text-xs text-[#D8C8B8] font-serif">
              <li>
                <button
                  onClick={() => {
                    if (onOpenTracking) onOpenTracking();
                    else onNavigateView('tracking');
                  }}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  تتبع حالة طلبيتك
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('about')}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  عن دار LINA SHOP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('contact')}
                  className="hover:text-[#D6B56A] transition-colors cursor-pointer"
                >
                  تواصل معنا
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D6B56A] transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenAdmin) onOpenAdmin();
                    else onNavigateView('admin');
                  }}
                  className="hover:text-[#D6B56A] transition-colors text-[#D8C8B8]/60 hover:text-white text-[11px] cursor-pointer"
                >
                  بوابة الإدارة
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info in Tunisia */}
          <div className="text-right space-y-4">
            <span className="text-xs font-serif font-bold text-[#FFF9F1] uppercase tracking-wider block">
              اتصل بنا في تونس
            </span>
            <ul className="space-y-3 text-xs text-[#D8C8B8] font-serif">
              <li className="flex items-center justify-end gap-2">
                <span>{storePhone}</span>
                <Phone className="w-3.5 h-3.5 text-[#D6B56A]" />
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>{storeEmail}</span>
                <Mail className="w-3.5 h-3.5 text-[#D6B56A]" />
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>{storeAddress}</span>
                <MapPin className="w-3.5 h-3.5 text-[#D6B56A]" />
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-[#D6B56A] font-serif uppercase block font-bold">
                  التوصيل السريع
                </span>
                <span className="text-xs text-[#FFF9F1]">24 إلى 48 ساعة لكامل ولايات تونس</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8C8B8]/70 font-serif">
          <p>© {new Date().getFullYear()} LINA SHOP • تونس. عطور زيتية وتركيبات مستوحاة. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#D8C8B8]">
            <span>الدفع عند الاستلام (COD)</span>
            <span>•</span>
            <span>البريد التونسي D17</span>
            <span>•</span>
            <span className="text-[#D6B56A]">تركيبات وزيوت نقية 100%</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
