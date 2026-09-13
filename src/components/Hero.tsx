import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { HomepageSettings } from '../types';

interface HeroProps {
  onExplore: () => void;
  onShopNow: () => void;
  settings?: HomepageSettings;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShopNow, settings }) => {
  const title = settings?.heroTitle || "عطرك... بصمتك.";
  const subtitle = settings?.heroSubtitle || "فخامة تُرى قبل أن تُشم.";
  const description = settings?.heroDescription || "إبداعات عطرية تونسية بتوقيع نيش ملكي، تستحضر عبير زهر البرتقال والمسك الأبيض والعود المعتق.";
  const heroImage = settings?.heroImage || "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85";
  const primaryBtn = settings?.heroPrimaryBtnText || "اكتشف العطور";
  const secondaryBtn = settings?.heroSecondaryBtnText || "تسوق الآن";
  const badge = settings?.heroBadge || "LINA SIGNATURE • EAU DE PARFUM • 100 ML";

  return (
    <section id="hero" className="relative overflow-hidden min-h-[85vh] lg:min-h-[92vh] flex items-center bg-[#0A0A0A] border-b border-white/5">
      {/* Editorial Background Large Watermark Typography */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-cinzel text-[18vw] font-bold text-white/[0.025] tracking-[0.25em] whitespace-nowrap translate-y-4">
          LINA
        </span>
      </div>

      {/* Subtle radial ambient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A227]/6 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-6 text-right space-y-8 order-2 lg:order-1">
            
            {/* Small Uppercase Luxury Moniker */}
            <div className="inline-flex items-center gap-2 border-b border-[#C9A227]/40 pb-1 text-[11px] font-serif uppercase tracking-[0.3em] text-[#C9A227]">
              <Sparkles className="w-3 h-3 text-[#C9A227]" />
              <span>HAUTE PARFUMERIE TUNISIENNE</span>
            </div>

            {/* Giant Editorial Headings */}
            <div className="space-y-3">
              <h1 id="hero-title" className="text-4xl sm:text-6xl xl:text-7xl font-bold font-serif text-[#E8E1D5] tracking-tight leading-[1.1]">
                {title}
              </h1>
              <p className="text-2xl sm:text-3xl xl:text-4xl font-serif text-[#C9A227] font-light italic leading-snug">
                {subtitle}
              </p>
            </div>

            {/* Restrained Description */}
            <p id="hero-subtitle" className="text-[#ACA394] text-sm sm:text-base max-w-lg leading-relaxed font-sans font-light">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExplore}
                id="hero-explore-btn"
                className="px-9 py-4 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] font-serif tracking-wider text-xs uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-white/10 group"
              >
                <span>{primaryBtn}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-[#0A0A0A] group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onShopNow}
                id="hero-shop-btn"
                className="px-9 py-4 bg-transparent hover:bg-white/5 text-[#E8E1D5] border border-white/20 hover:border-[#C9A227] font-serif tracking-wider text-xs uppercase transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <span>{secondaryBtn}</span>
              </button>
            </div>

            {/* Micro Product Info Block */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-[#ACA394]">
              <div>
                <span className="block font-serif text-[10px] tracking-[0.25em] text-[#C9A227] uppercase">EDITION ORIGINALE</span>
                <span className="text-[#E8E1D5] text-xs font-serif font-medium">{badge}</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#ACA394] block font-serif tracking-widest uppercase">DISPONIBILITÉ</span>
                <span className="text-[#E8E1D5] text-xs font-serif">كامل ولايات تونس (24 ولاية)</span>
              </div>
            </div>

          </div>

          {/* Cinematic Hero Perfume Showcase Column */}
          <div className="lg:col-span-6 relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-md lg:max-w-lg">
              
              {/* Background ambient dark box frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#111111] border border-white/10 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Lina Shop Haute Parfumerie"
                  className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-95 transform hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="eager"
                />

                {/* Subtle dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />

                {/* Minimal Overlay Badge */}
                <div className="absolute top-5 right-5 px-3 py-1.5 bg-[#0A0A0A]/85 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.25em] font-serif uppercase text-[#E8E1D5]">
                  COLLECTION ROYALE
                </div>

                {/* Bottom Signature Card */}
                <div className="absolute bottom-5 right-5 left-5 p-4 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[9px] tracking-[0.25em] text-[#C9A227] font-serif uppercase block">
                      LINA SIGNATURE
                    </span>
                    <h3 className="text-sm font-serif font-semibold text-[#E8E1D5]">
                      EAU DE PARFUM • 100 ML
                    </h3>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#ACA394] font-serif block">ابتداءً من</span>
                    <span className="text-base font-serif font-bold text-[#E8E1D5]">175 د.ت</span>
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
