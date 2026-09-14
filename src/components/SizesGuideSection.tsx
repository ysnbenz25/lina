import React from 'react';
import { Sparkles, CheckCircle2, ArrowLeft, Droplets, Pocket, Clock, Star, Gift } from 'lucide-react';
import { SizeGuideItem } from '../types';

interface SizesGuideSectionProps {
  items?: SizeGuideItem[];
  onSelectSize?: (size: string) => void;
}

export const DEFAULT_SIZE_GUIDE: SizeGuideItem[] = [
  {
    size: "5ml",
    title: "حجم التجربة والاستكشاف",
    description: "للتجربة واكتشاف النوتات العطرية قبل اقتناء الأحجام الأكبر",
    recommendedFor: "مثالي للمبتدئين وتجربة عدة روائح",
    icon: "droplets"
  },
  {
    size: "10ml",
    title: "للاستعمال اليومي الخفيف",
    description: "حجم الجيب والحقيبة للاستعمال السريع أثناء التنقل اليومي",
    recommendedFor: "للعمل والمشاوير والسيارة",
    icon: "pocket"
  },
  {
    size: "30ml",
    title: "للاستعمال اليومي المثالي",
    description: "الحجم الأكثر شعبية يجمع بين السعر الرمزي والكمية الكافية لأسابيع",
    recommendedFor: "الخيار المفضل والأكثر طلباً",
    icon: "clock"
  },
  {
    size: "50ml",
    title: "اختيار متوازن وأفضل قيمة",
    description: "سعة ممتازة لعطرك المفضل مع توازن رائع بين الحجم والاقتصاد",
    recommendedFor: "للاستعمال المنتظم لشهور",
    icon: "star"
  },
  {
    size: "100ml",
    title: "للاستعمال المتكرر والتوفير الأكبر",
    description: "أكبر حجم وأعلى نسبة توفير؛ يدوم طويلاً لعطرك الذي لا تستغني عنه",
    recommendedFor: "للعشاق ولأكبر قدر من التوفير",
    icon: "gift"
  }
];

export const SizesGuideSection: React.FC<SizesGuideSectionProps> = ({
  items = DEFAULT_SIZE_GUIDE,
  onSelectSize,
}) => {
  const guideList = items && items.length > 0 ? items : DEFAULT_SIZE_GUIDE;

  return (
    <section id="sizes-guide" className="py-16 md:py-24 bg-[#F7F1E8] border-y border-[#D8C8B8]/40 relative overflow-hidden text-[#241B18]">
      {/* Background Subtle Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C98F91]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#722F3F]/10 border border-[#722F3F]/25 text-[#722F3F] text-xs font-serif tracking-[0.2em] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#722F3F]" />
            <span>GUIDE DES FORMATS • دليل الأحجام</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#241B18] tracking-tight">
            اختار الحجم اللي يناسبك
          </h2>

          <p className="text-[#57413C] text-xs sm:text-sm leading-relaxed">
            وفرنا لك تشكيلة واسعة من الأحجام بأسعار رمزية ومدروسة، من حجم التجربة الصغير إلى الحجم الأكبر للاستعمال الدائم.
          </p>
        </div>

        {/* Sizes Cards Grid: 5 columns on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {guideList.map((guide, idx) => {
            const isMostChosen = guide.size === '50ml';

            return (
              <div
                key={idx}
                id={`size-card-${guide.size}`}
                onClick={() => onSelectSize && onSelectSize(guide.size)}
                className={`group p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between text-right relative cursor-pointer ${
                  isMostChosen
                    ? 'bg-[#FFF9F1] border-2 border-[#722F3F] shadow-xl ring-2 ring-[#D6B56A]/40 sm:-translate-y-1'
                    : 'bg-[#FFF9F1] border border-[#D8C8B8]/70 hover:border-[#D6B56A] hover:shadow-md'
                }`}
              >
                {/* Most Chosen Pill for 50ml */}
                {isMostChosen && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#722F3F] text-[#FFF9F1] border border-[#D6B56A]/40 text-[10px] font-bold px-3 py-0.5 rounded-full font-serif shadow-md whitespace-nowrap">
                    ⭐ الأكثر اختيارًا
                  </span>
                )}

                {/* Top: Size volume pill */}
                <div className="flex items-center justify-between mb-4 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold font-sans text-[#241B18] group-hover:text-[#722F3F] transition-colors">
                    {guide.size}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-serif font-bold ${
                    isMostChosen 
                      ? 'bg-[#722F3F] text-[#FFF9F1] shadow-sm' 
                      : 'bg-[#722F3F]/10 border border-[#722F3F]/20 text-[#722F3F]'
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Mid: Title & Description */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-bold font-serif text-[#722F3F]">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#57413C] leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                {/* Bottom: Recommended use badge */}
                <div className="mt-4 pt-3 border-t border-[#D8C8B8]/40 flex items-center gap-1.5 text-[11px] text-[#57413C] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#722F3F] shrink-0" />
                  <span>{guide.recommendedFor}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small transparent note */}
        <div className="mt-10 p-4 rounded-xl bg-[#FFF9F1] border border-[#D8C8B8]/60 text-center text-xs text-[#57413C] max-w-xl mx-auto shadow-sm">
          💡 <strong className="text-[#241B18]">نصيحة لينا شوب:</strong> إذا كنت تجرب الرائحة للمرة الأولى ننصحك بـ <span className="text-[#722F3F] font-bold">10ml</span> أو <span className="text-[#722F3F] font-bold">30ml</span> للتمتع بها بأقل تكلفة رمزية ممكنة.
        </div>

      </div>
    </section>
  );
};
