import { Perfume } from '../types';

export const PERFUMES_DATA: Perfume[] = [
  {
    id: 1,
    name: "Lina Royal Musk",
    arabicName: "مسك لينا الملكي",
    badge: "الأكثر مبيعاً بتونس",
    category: "عطور للجنسين",
    gender: "unisex",
    price: 175,
    originalPrice: 220,
    volume: "100 ml - Extrait de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 4.9,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isSpecialOffer: false,
    description: "الأيقونة الأكثر طلباً في متجرنا؛ نقاء المسك الأبيض الملكي مع نفحات زهر البرتقال التونسي (النيرولي) النقي وزنبق الوادي، ليمنحك إحساساً بالنظافة والفخامة طوال اليوم.",
    notes: {
      top: "زهر البرتقال التونسي الفاخر (Néroli de Nabeul)، برغموت ناصع",
      heart: "ياسمين سامباك، سوسن فلورنسا، زنبق أبيض",
      base: "مسك أبيض ملكي نقي، بودرة العنبر، خشب الكشمير"
    }
  },
  {
    id: 2,
    name: "Imperial Oud Noir",
    arabicName: "عود إمبريال نوار",
    badge: "مجموعة النخبة",
    category: "عطور فاخرة",
    gender: "unisex",
    price: 280,
    originalPrice: 340,
    volume: "100 ml - Extrait de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 5.0,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isSpecialOffer: false,
    description: "تحفة نيش ملكية تجمع بين فخامة العود المعتق، ونفحات الزعفران الملكي، مع قاعدة عنبرية دافئة تمنحك هيبة آسرة وثباتاً يفوق 24 ساعة.",
    notes: {
      top: "زعفران ملكي، برغموت إيطالي، حب الهال",
      heart: "ورد طائفي، خشب الصندل، باتشولي فاخر",
      base: "عود كمبودي معتق، عنبر أسود، جلد ملكي"
    }
  },
  {
    id: 3,
    name: "Velvet Rose & Tonka",
    arabicName: "مخمل الورد والتونكا",
    badge: "عطور نسائية راقية",
    category: "عطور نسائية",
    gender: "women",
    price: 215,
    originalPrice: 260,
    volume: "100 ml - Eau de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 4.8,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isSpecialOffer: false,
    description: "مزيج ساحر مفعم بالأنوثة والجاذبية يفتتح بعبير الورد الجوري والكرز المخملي، وتستقر قاعدته على لمسات دافئة من حبوب التونكا وفانيليا مدغشقر.",
    notes: {
      top: "كرز أسود، ليتشي وردي، توت العليق",
      heart: "ورد دمشقي نادر، زنبق الوادي",
      base: "حبوب التونكا البرازيلية، فانيليا مدغشقر، مسك أبيض"
    }
  },
  {
    id: 4,
    name: "Smoky Amber & Cedar",
    arabicName: "العنبر المدخن والأرز",
    badge: "عطور رجالية مميزة",
    category: "عطور رجالية",
    gender: "men",
    price: 240,
    originalPrice: 295,
    volume: "100 ml - Extrait de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 4.9,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isSpecialOffer: false,
    description: "عطر مفعم بالغموض والجاذبية للباحثين عن البصمة المميزة؛ نغمات خشب الأرز الأطلسي مع بخور اللبان العماني وجاذبية العنبر الرمادي الدافئ.",
    notes: {
      top: "فلفل وردي، جوزة الطيب، إكليل الجبل",
      heart: "خشب الأرز الأطلسي، بخور اللبان",
      base: "عنبر رمادي مدخن، نجيل الهند، بلسم بيرو"
    }
  },
  {
    id: 5,
    name: "Fleur de Néroli Tunisien",
    arabicName: "زهر النيرولي التونسي",
    badge: "توقيع تونسي فاخر",
    category: "عطور للجنسين",
    gender: "unisex",
    price: 190,
    originalPrice: 235,
    volume: "100 ml - Eau de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 4.9,
    reviewsCount: 43,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    isSpecialOffer: false,
    description: "قصيدة عطرة تحتفي برائحة بساتين الوطن القبلي؛ نيرولي نابل النقي المعصور على البارد مع نسيم البحر الأبيض المتوسط وخشب الأرز المنعش.",
    notes: {
      top: "زهر الليمون، نيرولي نابل الطازج، مندرين صقلي",
      heart: "زهر البرتقال، ياسمين أبيض، شاي أخضر",
      base: "خشب الأرز، مسك شمسي، عنبر خفيف"
    }
  },
  {
    id: 6,
    name: "Cuir Noir & Tabac",
    arabicName: "كوير نوار والتبغ الفاخر",
    badge: "عرض خاص",
    category: "عروض خاصة",
    gender: "men",
    price: 210,
    originalPrice: 280,
    volume: "100 ml - Extrait de Parfum",
    sizes: ["50 ml", "100 ml"],
    rating: 4.8,
    reviewsCount: 37,
    image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    isSpecialOffer: true,
    description: "عطر الجرأة والأناقة الكلاسيكية بامتياز؛ نفحات أوراق التبغ الكوبية مع الجلد الأسود المدبوغ الفاخر وقطرات العسل الجبلي.",
    notes: {
      top: "زعفران أحمر، حبوب القهوة، زنجبيل دافئ",
      heart: "أوراق التبغ الكوبي، حبوب الكاكاو، خشب الغاياك",
      base: "جلد أسود، فانيليا تاهيتي، خشب الباتشولي"
    }
  }
];
