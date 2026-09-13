import React from 'react';
import { ShieldCheck, Truck, Banknote, ArrowLeft, Sparkles } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShopNow }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-[#070709]">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#b89428]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Text Content (Desktop: Right in RTL) */}
          <div className="order-2 lg:order-1 lg:col-span-7 text-right space-y-6">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161d] border border-[#d4af37]/35 text-[#d4af37] text-xs font-serif tracking-[0.2em] uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>LINA SHOP • HAUTE PARFUMERIE</span>
            </div>

            {/* Main & Secondary Headings */}
            <div className="space-y-2">
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.2] text-white">
                عطرك... بصمتك
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#b89428] font-bold">
                فخامة تليق بمقامك
              </h2>
            </div>

            {/* Description */}
            <p id="hero-subtitle" className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xl leading-relaxed font-sans">
              اكتشف تشكيلة مختارة من العطور الراقية، أصلية ومميزة، مع توصيل سريع إلى كامل ولايات تونس.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onExplore}
                id="hero-explore-btn"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#d4af37]/20 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>اكتشف المجموعة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onShopNow}
                id="hero-shop-btn"
                className="w-full sm:w-auto px-8 py-4 bg-[#121218] hover:bg-[#1a1a24] text-neutral-200 hover:text-white border border-white/15 hover:border-[#d4af37]/40 rounded-xl transition-all text-sm font-semibold flex items-center justify-center cursor-pointer active:scale-95"
              >
                <span>تسوق الآن</span>
              </button>
            </div>

            {/* 3 Small Trust Indicators */}
            <div id="hero-trust-bar" className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">عطور أصلية 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">توصيل إلى كامل تونس</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4 text-[#d4af37]" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">الدفع عند الاستلام</span>
              </div>
            </div>

          </div>

          {/* Perfume Image Display (Mobile: First, Desktop: Left in RTL) */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Subtle luxury outer frame */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#d4af37]/30 via-transparent to-white/10 rounded-3xl filter blur-sm" />
              
              <div className="relative bg-[#101015] border border-white/15 rounded-3xl p-3.5 sm:p-4 overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-[#070709]">
                  <img
                    src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85"
                    alt="Lina Royal Musk - Haute Parfumerie"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 filter contrast-105"
                    loading="eager"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80" />
                </div>

                {/* Floating Product Highlight Card */}
                <div className="absolute bottom-6 right-6 left-6 p-3.5 sm:p-4 rounded-xl bg-[#08080a]/92 border border-[#d4af37]/35 backdrop-blur-md flex items-center justify-between shadow-xl">
                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs text-[#d4af37] tracking-wider font-serif font-bold uppercase block">
                      ÉDITION SIGNATURE • تونس
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                      Lina Royal Musk • مسك لينا الملكي
                    </h3>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[#d4af37] font-bold text-base sm:text-lg font-sans">
                      175 د.ت
                    </span>
                    <span className="text-[10px] text-neutral-400 block line-through">
                      220 د.ت
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
