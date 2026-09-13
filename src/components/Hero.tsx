import React from 'react';
import { Sparkles, ChevronLeft, ShieldCheck, Clock, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy (Right in RTL) */}
          <div className="lg:col-span-7 text-right space-y-6">
            
            <div id="hero-exclusive-badge" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مجموعة نيش الحصرية لعام 2026 • توصيل لكافة ولايات تونس الـ 24 🇹🇳</span>
            </div>

            <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.25] text-white">
              عبيرٌ يأسر الحواس..<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7b4] via-[#d4af37] to-[#b89428]">
                وفخامةٌ تليق بمقامك الرفيع
              </span>
            </h1>

            <p id="hero-subtitle" className="text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
              في <strong className="text-white">Lina Shop</strong> نبتكر التوقيع العطري الخالد بأيدي كبار العطارين، مع توصيل سريع وموثوق إلى باب منزلك في <strong className="text-[#d4af37]">كافة ولايات الجمهورية التونسية الـ 24</strong> والدفع عند الاستلام.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                id="hero-explore-btn"
                className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#d4af37]/20 text-sm tracking-wide flex items-center gap-2"
              >
                <span>استكشف المجموعة الحصرية</span>
                <ChevronLeft className="w-4 h-4" />
              </a>

              <a
                href="#about"
                id="hero-about-btn"
                className="px-8 py-4 bg-[#101014] hover:bg-[#17171d] text-neutral-200 hover:text-white border border-white/10 rounded-xl transition-colors text-sm font-medium"
              >
                عن دار لينا
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div id="hero-trust-bar" className="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>عطور أصلية 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>ثبات وفوحان +24 ساعة</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>ضمان استرجاع ذهبي</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 via-transparent to-white/5 rounded-3xl transform rotate-3 scale-95 filter blur-sm" />
              
              <div className="relative bg-[#101014]/90 border border-white/10 rounded-3xl p-4 overflow-hidden backdrop-blur-sm shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                  alt="Lina Shop Masterpiece"
                  className="w-full h-96 sm:h-[440px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-[#08080a]/90 border border-white/10 backdrop-blur-md flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-xs text-[#d4af37] tracking-wider font-medium">العطر الأيقوني المفضل</p>
                    <h4 className="text-base font-bold text-white font-serif">Lina Royal Musk • مسك لينا الملكي</h4>
                  </div>
                  <span className="text-[#d4af37] font-bold text-lg">170 د.ت</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
