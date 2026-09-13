import { Perfume } from '../types';

export const PERFUMES_DATA: Perfume[] = [
  {
    id: 1,
    name: "Imperial Oud Noir",
    arabicName: "عود إمبريال نوار",
    badge: "الأكثر مبيعاً بتونس",
    category: "عطور النيش",
    price: 280,
    originalPrice: 340,
    volume: "100 ml - Extrait de Parfum",
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    description: "تحفة نيش ملكية تجمع بين فخامة العود الكمبودي المعتق، ونفحات الزعفران الملكي، مع قاعدة عنبرية دافئة تمنحك هيبة آسرة وثباتاً يفوق 24 ساعة.",
    notes: {
      top: "زعفران ملكي، برغموت إيطالي، حب الهال",
      heart: "ورد طائفي، خشب الصندل، باتشولي فاخر",
      base: "عود كمبودي معتق، عنبر أسود، جلد ملكي"
    }
  },
  {
    id: 2,
    name: "Velvet Rose & Tonka",
    arabicName: "مخمل الورد والتونكا",
    badge: "إصدار محدود",
    category: "العطور الفاخرة",
    price: 220,
    originalPrice: 270,
    volume: "100 ml - Eau de Parfum",
    rating: 4.8,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    description: "مزيج ساحر مفعم بالأنوثة والجاذبية يفتتح بعبير الورد الجوري والكرز المخملي، وتستقر قاعدته على لمسات دافئة من حبوب التونكا وفانيليا مدغشقر.",
    notes: {
      top: "كرز أسود، ليتشي وردي، توت العليق",
      heart: "ورد دمشقي نادر، زنبق الوادي",
      base: "حبوب التونكا البرازيلية، فانيليا مدغشقر، مسك أبيض"
    }
  },
  {
    id: 3,
    name: "Smoky Amber & Cedar",
    arabicName: "العنبر المدخن والأرز",
    badge: "نيش مميز",
    category: "عطور النيش",
    price: 250,
    originalPrice: 310,
    volume: "100 ml - Extrait de Parfum",
    rating: 4.9,
    reviewsCount: 114,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    description: "عطر مفعم بالغموض والجاذبية للباحثين عن البصمة المميزة؛ نغمات خشب الأرز الأطلسي مع بخور اللبان العماني وجاذبية العنبر الرمادي الدافئ.",
    notes: {
      top: "فلفل وردي، جوزة الطيب، إكليل الجبل",
      heart: "خشب الأرز الأطلسي، بخور اللبان",
      base: "عنبر رمادي مدخن، نجيل الهند، بلسم بيرو"
    }
  },
  {
    id: 4,
    name: "Lina Royal Musk",
    arabicName: "مسك لينا الملكي",
    badge: "عطر يومي أيقوني",
    category: "العطور اليومية الراقية",
    price: 170,
    originalPrice: 220,
    volume: "100 ml - Eau de Parfum",
    rating: 5.0,
    reviewsCount: 230,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    description: "الأيقونة الأكثر طلباً في متجرنا؛ نقاء المسك الأبيض الملكي مع نفحات زهر البرتقال التونسي (النيرولي) النقي وزنبق الوادي، ليمنحك إحساساً بالنظافة والفخامة طوال اليوم.",
    notes: {
      top: "زهر البرتقال التونسي الفاخر (Néroli de Nabeul)، برغموت ناصع",
      heart: "ياسمين سامباك، سوسن فلورنسا، زنبق أبيض",
      base: "مسك أبيض ملكي نقي، بودرة العنبر، خشب الكشمير"
    }
  }
];
