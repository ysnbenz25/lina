import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FeaturedCollectionProps {
  onSelectCategory: (category: string) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'women',
      title: 'عطور نسائية',
      subtitle: 'POUR FEMME',
      description: 'أريج الزهور النادرة والفانيليا الساحرة',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      categoryQuery: 'عطور نسائية',
    },
    {
      id: 'men',
      title: 'عطور رجالية',
      subtitle: 'POUR HOMME',
      description: 'هيبة خشب الأرز والجلد الإيطالي الفاخر',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
      categoryQuery: 'عطور رجالية',
    },
    {
      id: 'unisex',
      title: 'عطور للجنسين',
      subtitle: 'COLLECTION MIXTE',
      description: 'تناغم المسك الأبيض ونيرولي نابل النقي',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
      categoryQuery: 'عطور للجنسين',
    },
    {
      id: 'niche',
      title: 'العطور الفاخرة',
      subtitle: 'HAUTE PARFUMERIE',
      description: 'إصدارات ملكية معتقة بنفحات العود والعنبر',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      categoryQuery: 'عطور فاخرة',
    },
  ];

  return (
    <section id="featured-collection" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="text-right space-y-2">
            <span className="font-serif text-[11px] tracking-[0.3em] text-[#C9A227] uppercase block">
              SÉLECTIONS EXCLUSIVES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
              المجموعات المختارة
            </h2>
          </div>
          <p className="text-[#ACA394] text-xs sm:text-sm font-sans max-w-md text-right font-light leading-relaxed">
            تشكيلات عطرية استثنائية صُممت لكل مناسبة وبصمة شخصية تدوم طويلاً.
          </p>
        </div>

        {/* 4 Large Collection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {collections.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.categoryQuery)}
              className="group relative aspect-[3/4] overflow-hidden bg-[#111111] border border-white/10 hover:border-[#C9A227]/60 transition-all duration-500 cursor-pointer flex flex-col justify-end p-6"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105 brightness-90 group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Vignette for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Top Roman Label */}
              <div className="absolute top-5 right-5 z-10">
                <span className="text-[9px] tracking-[0.3em] font-serif uppercase text-[#C9A227] bg-[#0A0A0A]/70 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                  {item.subtitle}
                </span>
              </div>

              {/* Content Overlay at bottom */}
              <div className="relative z-10 text-right space-y-1.5 transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#E8E1D5] group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#ACA394] font-sans line-clamp-1 font-light">
                  {item.description}
                </p>

                {/* Minimal CTA Arrow */}
                <div className="pt-2 flex items-center gap-2 text-[#C9A227] text-xs font-serif opacity-90 group-hover:opacity-100">
                  <span>استكشف المجموعة</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
