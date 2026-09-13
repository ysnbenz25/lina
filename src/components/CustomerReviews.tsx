import React from 'react';
import { Star, CheckCircle2, Quote, MapPin } from 'lucide-react';
import { TUNISIAN_REVIEWS } from '../data/testimonials';

export const CustomerReviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#0a0a0e] border-t border-white/5 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <p className="text-[#d4af37] text-xs font-serif tracking-widest uppercase font-bold">
            TÉMOIGNAGES CLIENTS • تجارب حقيقية
          </p>
          <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-bold font-serif text-white">
            آراء حرفائنا في تونس
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
            انطباعات وتجارب نخبة من عشاق العطور الفاخرة الذين وثقوا بدار Lina Shop في مختلف ولايات الجمهورية.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TUNISIAN_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              id={`review-card-${rev.id}`}
              className="bg-[#101014] rounded-2xl border border-white/10 hover:border-[#d4af37]/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/5 relative group"
            >
              <div className="space-y-4">
                {/* Quote icon & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-right font-sans">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-right">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white font-serif">{rev.name}</h4>
                      {rev.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" title="طلب مؤكد بتونس" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <MapPin className="w-3 h-3 text-[#d4af37]" />
                      <span>{rev.city}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-neutral-500">{rev.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
