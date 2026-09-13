import React from 'react';
import { Sparkles, Crown, Flame, Gem, Heart, ArrowLeft } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  frenchName: string;
  countText: string;
  image: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "عطور نسائية",
    name: "عطور نسائية",
    frenchName: "Pour Femme",
    countText: "أنوثة وجاذبية ساحرة",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    icon: Heart
  },
  {
    id: "عطور رجالية",
    name: "عطور رجالية",
    frenchName: "Pour Homme",
    countText: "هيبة وحضور ذكوري قوي",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    icon: Crown
  },
  {
    id: "عطور للجنسين",
    name: "عطور للجنسين",
    frenchName: "Unisexe",
    countText: "تناغم ونقاء عطري فريد",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    icon: Gem
  },
  {
    id: "عطور فاخرة",
    name: "عطور فاخرة",
    frenchName: "Collection Privée",
    countText: "إصدارات نيش ملكية معتقة",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles
  },
  {
    id: "عروض خاصة",
    name: "عروض خاصة",
    frenchName: "Offres Spéciales",
    countText: "تخفيضات وباقات حصرية",
    image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=600&q=80",
    icon: Flame
  }
];

interface CategoriesSectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-16 md:py-24 bg-[#070709] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="text-right space-y-2">
            <p className="text-[#d4af37] text-xs font-serif tracking-widest uppercase font-bold">
              CATÉGORIES D'EXCEPTION • تشكيلات راقية
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              أقسام العطور الفاخرة
            </h2>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-sm text-right">
            استكشف عالم النيش حسب ميولك العطرية بتصنيفات راقية صممت لتلبي شتى الأذواق.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative h-72 sm:h-80 rounded-2xl overflow-hidden text-right p-5 flex flex-col justify-between transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-[1.02] shadow-xl shadow-[#d4af37]/10'
                    : 'border-white/10 hover:border-[#d4af37]/50 hover:shadow-lg'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-transparent" />
                </div>

                {/* Top Icon Badge */}
                <div className="relative z-10 self-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md border transition-colors ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#070709] border-[#d4af37]'
                      : 'bg-[#070709]/80 text-[#d4af37] border-white/10 group-hover:border-[#d4af37]/40'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#d4af37] block">
                    {cat.frenchName}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white group-hover:text-[#d4af37] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 font-sans line-clamp-1">
                    {cat.countText}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-[11px] text-[#d4af37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>عرض العطور</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>

              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
