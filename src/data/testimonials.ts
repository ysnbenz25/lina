export interface CustomerReview {
  id: number;
  name: string;
  city: string;
  avatar: string;
  perfumeBought: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const TUNISIAN_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: "سليم الماجري",
    city: "تونس (المرسى)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Imperial Oud Noir",
    rating: 5,
    date: "منذ 4 أيام",
    comment: "وصلتني الشحنة إلى المرسى في أقل من 24 ساعة. عطر عود إمبريال نوار ذو فوحان استثنائي وثبات تجاوز اليومين على الملابس. التغليف فخم جداً ومعه عينة تجربة مجانية.",
    verified: true
  },
  {
    id: 2,
    name: "مريم الطرابلسي",
    city: "سوسة (خزامة)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Velvet Rose & Tonka",
    rating: 5,
    date: "منذ أسبوع",
    comment: "مسك لينا وروز وتونكا من أروع ما جربت! الرائحة أنثوية وناعمة بدون ما تكون قوية برشا، والتعامل مع خدمة الحرفاء كان في قمة الاحترافية. دفعت عند الاستلام بدون أي تعقيد.",
    verified: true
  },
  {
    id: 3,
    name: "طارق بن سالم",
    city: "صفاقس",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Lina Royal Musk",
    rating: 5,
    date: "منذ أسبوعين",
    comment: "عطر مسك لينا الملكي أصبح عطري اليومي الأساسي للعمل. رائحة نقاء ونظافة تدوم طوال النهار. فخور بوجود دار عطور بهذه الفخامة في تونس.",
    verified: true
  },
  {
    id: 4,
    name: "هدى النفاتي",
    city: "بنزرت",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Fleur de Néroli Tunisien",
    rating: 5,
    date: "منذ 3 أسابيع",
    comment: "نوتة زهر النيرولي فكرتني في ربيع نابل وبساتين الوطن القبلي. جودة ونقاء الزيوت العطرية واضحة من أول رشة. شكراً لفريق لينا شوب على هذا الإبداع.",
    verified: true
  }
];
