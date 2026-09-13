import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TheLinaCollectionProps {
  onExplore: () => void;
}

export const TheLinaCollection: React.FC<TheLinaCollectionProps> = ({ onExplore }) => {
  return (
    <section id="the-collection" className="relative py-28 sm:py-36 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
      {/* Background cinematic imagery with deep dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=85"
          alt="The Lina Collection"
          className="w-full h-full object-cover object-center filter contrast-125 brightness-50 scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Editorial Sub-label */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-[#C9A227]" />
          <span className="font-cinzel text-xs tracking-[0.4em] text-[#C9A227] uppercase">
            THE LINA COLLECTION
          </span>
          <span className="w-8 h-[1px] bg-[#C9A227]" />
        </div>

        {/* Big Arabic Display Title */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#E8E1D5] font-bold tracking-tight">
          مجموعة لينا
        </h2>

        {/* Atmospheric Poetry */}
        <p className="text-base sm:text-xl font-serif text-[#ACA394] font-light leading-relaxed max-w-2xl mx-auto">
          اختيارات صنعت لمن يبحث عن حضور لا يُنسى. عطور استثنائية تُحاكي الهيبة والفخامة التونسية المعاصرة.
        </p>

        {/* Centered CTA */}
        <div className="pt-4">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] font-serif tracking-wider text-xs uppercase font-bold transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer"
          >
            <span>اكتشف المجموعة</span>
            <ArrowLeft className="w-4 h-4 text-[#0A0A0A]" />
          </button>
        </div>

      </div>
    </section>
  );
};
