import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { HomepageSettings } from '../types';

interface HeroProps {
  onExplore: () => void;
  onShopNow: () => void;
  settings?: HomepageSettings;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShopNow, settings }) => {
  const storeName = "LINA SHOP";
  const title = settings?.heroTitle || "عطورك المفضلة... بأسعار تحبها";
  const subtitle = settings?.heroSubtitle || "عطور زيتية وتركيبات مستوحاة من أشهر الروائح";
  const description = settings?.heroDescription || "عطور زيتية وتركيبات مستوحاة من أشهر الروائح بأحجام مختلفة وأسعار رمزية تناسب الجميع في تونس، مع ثبات يدوم طويلاً.";
  const heroImage = settings?.heroImage || "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85";
  const primaryBtn = settings?.heroPrimaryBtnText || "اكتشف العطور";
  const secondaryBtn = settings?.heroSecondaryBtnText || "تصفح العروض";
  const badge = settings?.heroBadge || "عطور زيتية وتركيبات مستوحاة • من 5ml إلى 100ml";

  return (
    <section id="hero" className="relative overflow-hidden min-h-[85vh] lg:min-h-[92vh] flex items-center bg-[#241B18] border-b border-[#D8C8B8]/15">
      {/* Editorial Background Large Watermark Typography */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-cinzel text-[18vw] font-bold text-[#F7F1E8]/[0.025] tracking-[0.25em] whitespace-nowrap translate-y-4">
          LINA
        </span>
      </div>

      {/* Dusty Rose subtle ambient glow & Champagne spotlight */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C98F91]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D6B56A]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-6 text-right space-y-8 order-2 lg:order-1">
            
            {/* Small Uppercase Luxury Moniker */}
            <div className="inline-flex items-center gap-2 border-b border-[#D6B56A]/40 pb-1 text-[11px] font-serif uppercase tracking-[0.3em] text-[#D6B56A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B56A]" />
              <span>HAUTE PARFUMERIE TUNISIENNE</span>
            </div>

            {/* Giant Editorial Headings */}
            <div className="space-y-3">
              <h1 id="hero-title" className="text-4xl sm:text-6xl xl:text-7xl font-bold font-serif text-[#F7F1E8] tracking-tight leading-[1.15]">
                {title}
              </h1>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-serif text-[#D6B56A] font-light italic leading-snug">
                {subtitle}
              </p>
            </div>

            {/* Restrained Description */}
            <p id="hero-subtitle" className="text-[#D8C8B8] text-sm sm:text-base max-w-lg leading-relaxed font-sans font-light">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExplore}
                id="hero-explore-btn"
                className="px-9 py-4 bg-[#722F3F] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#FFF9F1] font-serif tracking-wider text-xs uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-[#722F3F]/30 hover:shadow-[#D6B56A]/20 group active:scale-95"
              >
                <span className="font-bold">{primaryBtn}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-current group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onShopNow}
                id="hero-shop-btn"
                className="px-9 py-4 bg-transparent hover:bg-[#C98F91]/15 text-[#F7F1E8] border border-[#F7F1E8]/30 hover:border-[#C98F91] hover:text-[#FFF9F1] font-serif tracking-wider text-xs uppercase rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95"
              >
                <span>{secondaryBtn}</span>
              </button>
            </div>

            {/* Micro Product Info Block */}
            <div className="pt-8 border-t border-[#D8C8B8]/15 flex items-center justify-between text-xs text-[#D8C8B8]">
              <div>
                <span className="block font-serif text-[10px] tracking-[0.25em] text-[#D6B56A] uppercase">EDITION ORIGINALE</span>
                <span className="text-[#F7F1E8] text-xs font-serif font-medium">{badge}</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#D8C8B8]/70 block font-serif tracking-widest uppercase">DISPONIBILITÉ</span>
                <span className="text-[#F7F1E8] text-xs font-serif">كامل ولايات تونس (24 ولاية)</span>
              </div>
            </div>

          </div>

          {/* Cinematic Hero Perfume Showcase Column */}
          <div className="lg:col-span-6 relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md lg:max-w-lg">
              
              {/* Decorative subtle border frame */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#722F3F]/30 via-[#D6B56A]/20 to-[#C98F91]/30 blur-sm pointer-events-none" />

              {/* Background ambient dark box frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#332522] border border-[#D8C8B8]/20 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Lina Shop Haute Parfumerie"
                  className="w-full h-full object-cover object-center filter contrast-[1.06] brightness-95 transform hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="eager"
                />

                {/* Subtle dark vignette overlay seamlessly merging with Espresso background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#241B18] via-[#241B18]/35 to-transparent opacity-90" />
                <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl" />

                {/* Minimal Overlay Badge */}
                <div className="absolute top-5 right-5 px-3.5 py-1.5 rounded-lg bg-[#241B18]/85 backdrop-blur-md border border-[#D6B56A]/30 text-[10px] tracking-[0.25em] font-serif uppercase text-[#F7F1E8]">
                  LINA SHOP • HUILES & EXTRAITS
                </div>

                {/* Bottom Signature Card */}
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-xl bg-[#241B18]/90 backdrop-blur-md border border-[#D8C8B8]/20 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[9px] tracking-[0.25em] text-[#D6B56A] font-serif uppercase block">
                      PARFUMS INSPIRÉS & HUILES
                    </span>
                    <h3 className="text-sm font-serif font-semibold text-[#F7F1E8]">
                      عطور زيتية وتركيبات مستوحاة (5ml - 100ml)
                    </h3>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#D8C8B8] font-serif block">أسعار رمزية تبدأ من</span>
                    <span className="text-base font-serif font-bold text-[#D6B56A]">5 د.ت</span>
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
