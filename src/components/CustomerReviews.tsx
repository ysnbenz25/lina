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
    <section id="reviews" className="py-24 sm:py-32 bg-[#F7F1E8] border-b border-[#D8C8B8]/40 text-[#241B18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-serif text-[11px] tracking-[0.35em] text-[#722F3F] uppercase block font-bold">
            AVIS DE NOS CLIENTS • آراء العملاء
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#241B18] font-bold tracking-tight">
            ماذا يقول عملاؤنا في تونس؟
          </h2>
          <p className="text-xs sm:text-sm text-[#57413C] font-serif max-w-md mx-auto">
            أكثر من 4,200 زبون يثقون في عطورنا وتركيباتنا في كامل تراب الجمهورية التونسية
          </p>
        </div>

        {/* 3 Editorial Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-[#FFF9F1] border border-[#D8C8B8]/60 hover:border-[#722F3F]/40 transition-all duration-300 flex flex-col justify-between text-right relative rounded-2xl shadow-sm hover:shadow-md"
            >
              <Quote className="w-10 h-10 text-[#722F3F]/10 absolute top-6 left-6" />

              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#D6B56A]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#241B18] leading-relaxed font-serif font-normal">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author and verified purchase */}
              <div className="mt-8 pt-4 border-t border-[#D8C8B8]/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-[#241B18]">{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#722F3F]" />
                  </div>
                  <span className="text-[10px] text-[#57413C] block font-sans">{rev.city} • تم التحقق</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-serif text-[#722F3F] font-bold block">{rev.perfume}</span>
                  <span className="text-[9px] text-[#57413C]/70 font-sans">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
