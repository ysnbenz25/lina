import React from 'react';
import { Sparkles, Heart, Crown, Gem, Droplets, Flame, PackageOpen, Layers } from 'lucide-react';

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
    countText: "تركيبات زهرية وفانيليا ساحرة",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    icon: Heart
  },
  {
    id: "عطور رجالية",
    name: "عطور رجالية",
    frenchName: "Pour Homme",
    countText: "روائح منعشة وخشبية فواحة",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    icon: Crown
  },
  {
    id: "عطور للجنسين",
    name: "عطور للجنسين",
    frenchName: "Unisexe",
    countText: "أيقونات مشتركة تليق بالجميع",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    icon: Gem
  },
  {
    id: "العطور الزيتية",
    name: "العطور الزيتية",
    frenchName: "Huiles Concentrées",
    countText: "زيوت نقية بدون كحول فائقة الثبات",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80",
    icon: Droplets
  },
  {
    id: "الأكثر مبيعاً",
    name: "الأكثر مبيعاً",
    frenchName: "Best-Sellers",
    countText: "العطور الأكثر طلباً في تونس",
    image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles
  },
  {
    id: "العروض",
    name: "عروض وتخفيضات",
    frenchName: "Offres Spéciales",
    countText: "أسعار رمزية وتوفير حتى 35%",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
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
    <section id="categories" className="py-16 md:py-24 bg-[#241B18] border-t border-[#D8C8B8]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="text-right space-y-2">
            <p className="text-[#D6B56A] text-xs font-serif tracking-widest uppercase font-bold">
              CATÉGORIES LINA • تصنيفات المتجر
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#F7F1E8]">
              تصفح التشكيلات العطرية
            </h2>
          </div>
          <p className="text-[#D8C8B8] text-xs sm:text-sm max-w-sm text-right">
            عطور زيتية وتركيبات مستوحاة من أشهر الروائح مقسمة بعناية لتجد عطرك المفضل بسهولة وبأفضل الأسعار.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative h-64 sm:h-72 rounded-2xl overflow-hidden text-right p-4 flex flex-col justify-between transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'border-[#D6B56A] ring-2 ring-[#D6B56A]/40 scale-[1.02] shadow-xl shadow-[#D6B56A]/15'
                    : 'border-[#D8C8B8]/20 hover:border-[#D6B56A] hover:shadow-xl'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                  />
                  {/* Atmospheric overlay transitioning into warm Burgundy & Espresso */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241B18] via-[#241B18]/70 to-transparent group-hover:via-[#722F3F]/40 transition-colors duration-500" />
                </div>

                {/* Top Badge Icon */}
                <div className="relative z-10 w-9 h-9 rounded-xl bg-[#241B18]/85 backdrop-blur-md border border-[#D8C8B8]/20 flex items-center justify-center text-[#D6B56A] group-hover:bg-[#722F3F] group-hover:text-[#FFF9F1] transition-all">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Bottom Text Content */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] text-[#D6B56A] font-serif uppercase tracking-wider font-semibold block">
                    {cat.frenchName}
                  </span>
                  <h3 className="text-base font-bold text-[#FFF9F1] font-serif group-hover:text-[#D6B56A] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#D8C8B8] line-clamp-1">
                    {cat.countText}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
