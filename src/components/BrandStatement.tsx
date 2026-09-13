import React from 'react';

interface BrandStatementProps {
  statement?: string;
}

export const BrandStatement: React.FC<BrandStatementProps> = ({ statement }) => {
  const defaultText = "العطر ليس مجرد رائحة.\nإنه حضور.";
  const text = statement || defaultText;

  return (
    <section id="brand-statement" className="py-24 sm:py-32 bg-[#0A0A0A] relative overflow-hidden border-b border-white/5">
      {/* Subtle luxury ambient texture */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Minimal Gold Roman Monogram / Divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-12 h-[1px] bg-[#C9A227]/40" />
          <span className="font-cinzel text-xs tracking-[0.4em] text-[#C9A227] uppercase">PHILOSOPHIE</span>
          <span className="w-12 h-[1px] bg-[#C9A227]/40" />
        </div>

        {/* Large Editorial Statement */}
        <blockquote className="space-y-4">
          <p className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#E8E1D5] font-light leading-[1.3] sm:leading-[1.35] tracking-tight whitespace-pre-line">
            {text}
          </p>
        </blockquote>

        {/* Subtitle / Context */}
        <p className="mt-8 text-xs sm:text-sm font-serif tracking-[0.25em] text-[#ACA394] uppercase max-w-xl mx-auto">
          LINA SHOP • HAUTE PARFUMERIE • TUNIS
        </p>

      </div>
    </section>
  );
};
