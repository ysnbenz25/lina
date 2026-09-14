import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface PremiumCollectionBannerProps {
  onExplore: () => void;
}

export const PremiumCollectionBanner: React.FC<PremiumCollectionBannerProps> = ({ onExplore }) => {
  return (
    <section id="elite-collection" className="relative py-24 md:py-36 overflow-hidden border-y border-[#D6B56A]/30">
      {/* Background Image with Dark Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1920&q=85"
          alt="Lina Haute Parfumerie Elite Collection"
          className="w-full h-full object-cover object-center filter brightness-40 contrast-125"
        />
        {/* Luxury Vignette & Deep Warm Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241B18] via-[#241B18]/75 to-[#241B18]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#722F3F]/25 to-[#241B18]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#722F3F]/60 border border-[#D6B56A]/40 text-[#D6B56A] text-xs font-serif tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B56A]" />
            <span>COLLECTION PRIVÉE • ÉDITION LIMITÉE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#FFF9F1] tracking-tight leading-tight">
            مجموعة النخبة
          </h2>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6B56A] to-transparent mx-auto" />

          <p className="text-lg sm:text-xl md:text-2xl text-[#D6B56A] font-serif max-w-2xl mx-auto leading-relaxed italic">
            "اختيارات صممت لمن يبحث عن حضور لا يُنسى بأسعار رمزية."
          </p>

          <p className="text-xs sm:text-sm text-[#D8C8B8] max-w-lg mx-auto font-sans">
            عطور مكثفة وزيوت نقية معتقة بدقة متناهية، تعكس المكانة الرفيعة والأناقة الخالدة لكل محبي العطور في تونس.
          </p>

          <div className="pt-4">
            <button
              onClick={onExplore}
              className="px-10 py-4 bg-[#722F3F] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#FFF9F1] font-bold text-sm tracking-wider rounded-xl transition-all transform hover:-translate-y-0.5 shadow-2xl shadow-[#722F3F]/40 inline-flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>اكتشف المجموعة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
