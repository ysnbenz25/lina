import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'ياسمين بن سالم',
      city: 'تونس العاصمة',
      perfume: 'عود إمبريال',
      rating: 5,
      date: 'منذ يومين',
      comment: 'عطر يفوق الوصف بكل صراحة! الثبات يدوم أكثر من يوم كامل على الملابس والفوحان استثنائي. تعامل محترم وتوصيل في أقل من 24 ساعة.',
    },
    {
      id: 2,
      name: 'مهدي الطرابلسي',
      city: 'سوسة',
      perfume: 'لينا سيغنتشر',
      rating: 5,
      date: 'منذ أسبوع',
      comment: 'كنت متردد في البداية لأن الشراء أونلاين، لكن التغليف فخم جداً والعطر أصلي ورائحته نقية بدون كحول حاد. التوصيل لباب الدار والدفع عند الاستلام مريح جداً.',
    },
    {
      id: 3,
      name: 'سيرين الماجري',
      city: 'صفاقس',
      perfume: 'مسك روز بريميوم',
      rating: 5,
      date: 'منذ 5 أيام',
      comment: 'من أرقى العطور التي جربتها في تونس. ريحة ناعمة ومميزة تسحر كل من يشمها. شكراً لينا شوب على الاحترافية والهدية المرفقة مع الطلب.',
    },
  ];

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-serif text-[11px] tracking-[0.35em] text-[#C9A227] uppercase block">
            AVIS DE NOS CLIENTS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-xs sm:text-sm text-[#ACA394] font-serif max-w-md mx-auto">
            أكثر من 4,200 زبون يثقون في عطورنا في كامل الجمهورية التونسية
          </p>
        </div>

        {/* 3 Editorial Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-[#111111] border border-white/5 hover:border-[#C9A227]/30 transition-all duration-300 flex flex-col justify-between text-right relative"
            >
              <Quote className="w-8 h-8 text-white/5 absolute top-6 left-6" />

              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#C9A227]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#E8E1D5] leading-relaxed font-serif font-light">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author and verified purchase */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-[#E8E1D5]">{rev.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-[#C9A227]" />
                  </div>
                  <span className="text-[10px] text-[#ACA394] block font-sans">{rev.city} • تم التحقق</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-serif text-[#C9A227] block">{rev.perfume}</span>
                  <span className="text-[9px] text-neutral-500 font-sans">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
