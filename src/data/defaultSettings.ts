import {
  Category,
  HomepageSettings,
  WebsiteSettings,
  ThemeSettings,
  SEOSettings,
  DeliverySettings,
  ContentSettings,
  CustomerReviewItem,
  NavigationItem,
  SpecialOfferItem,
  MediaItem,
  PromotionCoupon,
  TUNISIA_GOVERNORATES,
} from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: "Women's Fragrances",
    arabicName: "عطور نسائية",
    slug: 'women',
    description: 'توليفات أنثوية راقية من أريج الورد والياسمين وزهر البرتقال بنفحات ساحرة',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 1,
  },
  {
    id: 'cat-2',
    name: "Men's Fragrances",
    arabicName: "عطور رجالية",
    slug: 'men',
    description: 'روائح خشبية وجلدية وأمبرية ذات حضور حاسم وهيبة لا تضاهى',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 2,
  },
  {
    id: 'cat-3',
    name: "Unisex Fragrances",
    arabicName: "عطور للجنسين",
    slug: 'unisex',
    description: 'نقاء المسك والنيرولي التونسي الفاخر في توازن استثنائي لكل الأذواق',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 3,
  },
  {
    id: 'cat-4',
    name: "Pure Perfume Oils",
    arabicName: "العطور الزيتية",
    slug: 'oils',
    description: 'زيوت عطرية مركزة 100% بدون كحول بفوحان عميق وثبات يدوم لأيام',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 4,
  },
  {
    id: 'cat-5',
    name: "Special Offers",
    arabicName: "عروض خاصة",
    slug: 'offers',
    description: 'باقات مخفضة وأسعار رمزية حصرية في تونس للتوفير القصوى',
    image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 5,
  }
];

export const DEFAULT_HOMEPAGE_CMS: HomepageSettings = {
  heroTitle: "عطور تركيبية فاخرة وعطور زيتية بأسعار رمزية",
  heroSubtitle: "روائح مستوحاة من أشهر الماركات العالمية بدقة متناهية وثبات استثنائي",
  heroDescription: "متجر لينا التونسي يقدم لك تشكيلة راقية من العطور الزيتية والتركيبية بأحجام متعددة (من 5ml إلى 100ml) بأسعار تبدأ من 5 د.ت فقط مع توصيل لكافة الولايات التونسية.",
  heroImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200",
  heroBadge: "متجر تونسي 100% • توصيل لـ 24 ولاية",
  heroPrimaryBtnText: "اكتشف العطور واطلب الآن",
  heroPrimaryBtnLink: "#shop",
  heroSecondaryBtnText: "دليل الأحجام والأسعار",
  heroSecondaryBtnLink: "#sizes",
  brandStatement: "LINA SHOP - الفخامة والأناقة في متناول الجميع",
  sectionOrder: [
    'hero',
    'featuresStrip',
    'specialOffers',
    'sizesGuide',
    'categories',
    'bestSellers',
    'featuredCollection',
    'theLinaCollection',
    'whyLina',
    'testimonials',
    'about',
    'faq',
    'footer'
  ],
  sectionTitles: {
    hero: { title: "الواجهة الرئيسية", subtitle: "الترحيب والتقديم الأولي" },
    featuresStrip: { title: "ميزات لينا شوب", subtitle: "سرعة التوصيل وضمان الجودة والدفع عند الاستلام" },
    specialOffers: { title: "العروض الحصرية", subtitle: "خصومات استثنائية وأسعار تفاضلية لفترة محدودة" },
    sizesGuide: { title: "دليل الأحجام والأسعار", subtitle: "اختر الحجم المناسب لاحتياجك من 5ml إلى 100ml" },
    categories: { title: "استكشف التشكيلات", subtitle: "عطور نسائية، رجالية، للجنسين، وزيوت نقية" },
    bestSellers: { title: "العطور الأكثر طلباً", subtitle: "الاختيارات المفضلة لدى عملائنا في تونس" },
    featuredCollection: { title: "التشكيلة المختارة", subtitle: "مستخلصات نيش فاخرة برائحة تأسر الحواس" },
    theLinaCollection: { title: "مجموعة لينا الحصرية", subtitle: "بصمة متفردة وتركيبات خاصة بدار لينا" },
    whyLina: { title: "لماذا لينا شوب؟", subtitle: "أعلى ثبات وأجود المواد الخام بأسعار في المتناول" },
    testimonials: { title: "آراء عملائنا في تونس", subtitle: "تقييمات حقيقية وتجارب موثقة من مختلف الولايات" },
    about: { title: "قصة دار لينا", subtitle: "شغف العطور التونسية المستوحاة من سحر الطبيعة" },
    faq: { title: "الأسئلة الشائعة", subtitle: "إجابات فورية وشفافة عن الطلب، الدفع، والتوصيل" },
    footer: { title: "تذييل الموقع", subtitle: "بيانات التواصل، الروابط السريعة وحقوق النشر" }
  },
  sections: {
    hero: true,
    brandStatement: true,
    featuresStrip: true,
    specialOffers: true,
    sizesGuide: true,
    categories: true,
    bestSellers: true,
    featuredCollection: true,
    featuredProduct: true,
    theLinaCollection: true,
    linaCollection: true,
    whyLina: true,
    testimonials: true,
    about: true,
    faq: true,
    footer: true,
  },
  topBanner: {
    enabled: true,
    text: "✨ توصيل مجاني لكافة ولايات تونس عند الطلب بـ 70 د.ت فما فوق! الدفع عند الاستلام أو عبر D17 🚚",
    link: "#shop",
    bgColor: "#722F3F",
    textColor: "#FFF9F1"
  },
  popup: {
    enabled: false,
    title: "مرحباً بك في LINA SHOP! 🌸",
    subtitle: "استمتع بخصم 10% على أول طلب عطور بأسعار رمزية وجودة ممتازة",
    discountText: "كود الخصم: LINA10",
    buttonText: "تسوق التشكيلة الآن",
    buttonLink: "#shop",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
    delaySeconds: 5
  }
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  storeName: "LINA SHOP",
  subtitle: "عطور زيتية وتركيبات مستوحاة في تونس",
  logoUrl: "",
  faviconUrl: "",
  phone: "+216 55 889 900",
  whatsapp: "+216 55 889 900",
  email: "contact@linashop.tn",
  instagram: "https://instagram.com/linashop.tn",
  facebook: "https://facebook.com/linashop.tn",
  tiktok: "https://tiktok.com/@linashop.tn",
  address: "شارع الحبيب بورقيبة، تونس العاصمة، الجمهورية التونسية",
  currency: "TND",
  currencySymbol: "د.ت",
  shippingPrice: 7,
  freeShippingThreshold: 70,
  deliveryInfo: "توصيل سريع ومؤمن إلى كافة ولايات الجمهورية التونسية الـ 24 خلال 24 إلى 48 ساعة عمل. مع إمكانية الدفع عند الاستلام.",
  returnPolicy: "ضمان الاستبدال أو الإرجاع خلال 7 أيام من تاريخ الاستلام في حال وجود أي عيب مصنعي في البخاخ أو القارورة.",
  privacyPolicy: "نلتزم بحماية خصوصية عملائنا ولا نشارك أي بيانات شخصية أو أرقام هواتف مع أي طرف ثالث تحت أي ظرف.",
  terms: "جميع منتجاتنا تركيبات عطرية مستوحاة وزيوت نقية مصنعة وفق أعلى معايير الجودة والسلامة بأسعار رمزية في متناول الجميع.",
  workingHours: "كامل أيام الأسبوع من 09:00 صباحاً إلى 20:00 مساءً",
  welcomeMessage: "أهلاً بك في متجر لينا للعطور التونسية الفاخرة بأسعار رمزية"
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primaryColor: "#D6B56A", // Champagne Gold
  secondaryColor: "#722F3F", // Burgundy
  accentColor: "#C98F91", // Dusty Rose
  backgroundColor: "#241B18", // Deep Espresso
  cardBgColor: "#332522", // Secondary Espresso
  textColor: "#F7F1E8", // Warm Cream
  borderRadius: "xl",
  headingFont: "Amiri",
  bodyFont: "Tajawal",
  buttonStyle: "rounded"
};

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  siteTitle: "Lina Shop | عطور زيتية وتركيبات مستوحاة في تونس بأسعار رمزية",
  metaDescription: "متجر Lina Shop التونسي المتخصص في العطور الزيتية المركزة والتركيبات المستوحاة من أشهر العطور العالمية بأسعار رمزية وأحجام من 5ml إلى 100ml. توصيل لـ 24 ولاية.",
  keywords: "عطور تونس, زيوت عطرية, عطور زيتية, تركيبات عطرية, sauvage, baccarat rouge, أسعار رمزية تونس, عطور رخيصة, لينا شوب, تونس العاصمة",
  ogTitle: "Lina Shop | عطور زيتية وتركيبات مستوحاة بأسعار رمزية في تونس",
  ogDescription: "اكتشف أرقى العطور والزيوت بأسعار تبدأ من 5 د.ت مع توصيل سريع لجميع ولايات تونس والدفع عند الاستلام أو عبر D17.",
  ogImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85"
};

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  baseShippingPrice: 7,
  freeShippingThreshold: 70,
  freeShippingEnabled: true,
  deliveryDurationText: "24 إلى 48 ساعة عمل",
  governorateRates: TUNISIA_GOVERNORATES.map((gov) => {
    let price = 7;
    let duration = "24-48 ساعة";
    if (gov.includes("تونس") || gov.includes("أريانة") || gov.includes("بن عروس") || gov.includes("منوبة")) {
      price = 7;
      duration = "خلال 24 ساعة";
    } else if (gov.includes("سوسة") || gov.includes("المنستير") || gov.includes("نابل") || gov.includes("بنزرت")) {
      price = 7;
      duration = "24-48 ساعة";
    } else if (gov.includes("تطاوين") || gov.includes("توزر") || gov.includes("قبلي") || gov.includes("مدنين")) {
      price = 8;
      duration = "48-72 ساعة";
    }
    return {
      governorate: gov,
      price,
      active: true,
      duration
    };
  })
};

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  faqList: [
    {
      id: 'faq-1',
      question: 'ما هي طبيعة العطور والتركيبات المتوفرة في LINA SHOP؟',
      answer: 'LINA SHOP متجر تونسي متخصص في الزيوت العطرية المركزة والتركيبات المستوحاة بدقة من أشهر الروائح العالمية. نقدم بدائل تركيبية وزيوت نقية بأعلى درجات الثبات والفوحان وبأسعار رمزية ومناسبة للجميع.',
      order: 1,
      active: true,
    },
    {
      id: 'faq-2',
      question: 'كم تكلفة التوصيل في تونس؟',
      answer: 'نوفر التوصيل السريع لكافة الـ 24 ولاية تونسية بتكلفة رمزية قدرها 7 دنانير فقط، وتوصيل مجاني تماماً للطلبات التي تتجاوز 70 ديناراً.',
      order: 2,
      active: true,
    },
    {
      id: 'faq-3',
      question: 'كم يستغرق وصول الطلب إلى باب منزلي؟',
      answer: 'يستغرق التوصيل بين 24 إلى 48 ساعة عمل كحد أقصى. يتصل بك عون التوصيل هاتفياً قبل الوصول لتأكيد العنوان والوقت المناسب لك.',
      order: 3,
      active: true,
    },
    {
      id: 'faq-4',
      question: 'هل الدفع عند الاستلام متاح؟ وكيف يعمل الدفع عبر D17؟',
      answer: 'نعم، الدفع عند الاستلام (Paiement à la livraison) هو الخيار الأساسي. كما نوفر إمكانية الدفع المسبق عبر تطبيق D17 التابع للبريد التونسي لمن يفضل ذلك مع تأكيد فوري للطلب.',
      order: 4,
      active: true,
    },
    {
      id: 'faq-5',
      question: 'ما هي الأحجام المتوفرة من العطور والزيوت؟',
      answer: 'نوفر تشكيلة واسعة: قوارير الزيت العطري المركز (5ml و10ml و20ml)، وبخاخات التركيبة العطرية المستوحاة (30ml و50ml و100ml).',
      order: 5,
      active: true,
    }
  ],
  aboutTitle: "عن دار لينا للعطور",
  aboutDescription: "شغف تونسي أصيل بابتكار العطور والزيوت النقية التي تجمع بين فخامة الرائحة والسعر الرمزي.",
  aboutStory: "انطلقت فكرة LINA SHOP من الرغبة في تمكين كل تونسي وتونسية من التمتع بأرقى العطور العالمية دون دفع مئات الدنانير. نحن نختار أجود الزيوت العطرية النقية بدون إضافات ضارة ونركبها بحرفية عالية لتمنحك ثباتاً حقيقياً يرافقك طوال اليوم.",
  aboutBadge: "حرفية تونسية • مكونات نقية 100%",
  deliveryPageText: "خدمة التوصيل السريع تغطي كافة المعتمديات والولايات التونسية الـ 24 عبر شبكة موزعين معتمدين خلال 24 إلى 48 ساعة من تأكيد الطلب.",
  contactHeading: "يسعدنا دائماً تواصلك معنا",
  contactSubheading: "فريق لينا شوب في خدمتكم للإجابة عن كافة الاستفسارات والمساعدة في اختيار عطرك المثالي.",
  footerBio: "متجر تونسي متخصص في أرقى الزيوت العطرية والتركيبات المستوحاة من أشهر العطور العالمية. جودة وثبات ممتاز بأسعار رمزية ومناسبة للجميع.",
  footerCopyright: "© 2026 LINA SHOP. جميع الحقوق محفوظة • متجر تونسي رسمي للعطور",
  uiTexts: {
    addToCartBtn: "أضف للسلة",
    buyNowBtn: "اشتري الآن (دفع عند الاستلام)",
    checkoutBtn: "إتمام الطلب وتأكيد الشحن",
    emptyCartText: "سلة التسوق فارغة حالياً",
    freeShippingBadge: "توصيل مجاني",
    currencySymbol: "د.ت",
    codLabel: "الدفع عند الاستلام (Paiement à la livraison)",
    codDesc: "ادفع نقداً لعون التوصيل بعد استلام طردك وفحصه في باب منزلك",
    d17Label: "الدفع عبر تطبيق D17 (البريد التونسي)",
    d17Desc: "تحويل فوري ومباشر عبر تطبيق D17 إلى حساب المتجر مع تأكيد سريع"
  }
};

export const DEFAULT_REVIEWS: CustomerReviewItem[] = [
  {
    id: 1,
    name: "سليم الماجري",
    city: "تونس (المرسى)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Sauvage Tribute Accord",
    rating: 5,
    date: "منذ يومين",
    comment: "وصلتني الشحنة إلى المرسى في أقل من 24 ساعة. تركيبة عطر سوفاج ذو فوحان استثنائي وثبات ممتاز على الملابس بـ 16 د.ت فقط! تغليف فخم ومميز.",
    verified: true,
    active: true
  },
  {
    id: 2,
    name: "مريم الطرابلسي",
    city: "سوسة (خزامة)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "مسك الطهارة الأبيض النقي",
    rating: 5,
    date: "منذ 4 أيام",
    comment: "مسك الطهارة الزيتي ريحته نقاء ونظافة تدوم ليوم كامل! حبيت التعامل السريع والدفع عند الاستلام بكل ثقة.",
    verified: true,
    active: true
  },
  {
    id: 3,
    name: "طارق بن سالم",
    city: "صفاقس",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    perfumeBought: "Rouge 540 Crystal Essence",
    rating: 5,
    date: "منذ أسبوع",
    comment: "العطر مطابق بشكل مبهر للرائحة الأصلية وسعره رمزي جداً مقارنة بالجودة. أحيي دار لينا شوب على هذا المستوى الراقي.",
    verified: true,
    active: true
  }
];

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'nav-1', label: 'الرئيسية', link: '#home', order: 1, active: true },
  { id: 'nav-2', label: 'كل العطور', link: '#shop', order: 2, active: true },
  { id: 'nav-3', label: 'عطور نسائية', link: '#category-women', order: 3, active: true },
  { id: 'nav-4', label: 'عطور رجالية', link: '#category-men', order: 4, active: true },
  { id: 'nav-5', label: 'زيوت عطرية', link: '#category-oils', order: 5, active: true },
  { id: 'nav-6', label: 'العروض الخاصة', link: '#offers', order: 6, active: true },
  { id: 'nav-7', label: 'دليل الأحجام', link: '#sizes', order: 7, active: true },
  { id: 'nav-8', label: 'تتبع طلبي', link: '#tracking', order: 8, active: true },
  { id: 'nav-9', label: 'من نحن', link: '#about', order: 9, active: true },
  { id: 'nav-10', label: 'الأسئلة الشائعة', link: '#faq', order: 10, active: true }
];

export const DEFAULT_SPECIAL_OFFERS: SpecialOfferItem[] = [
  {
    id: 'offer-1',
    title: 'عرض الثنائية الملكية: Sauvage + Baccarat Rouge',
    perfumeId: 1,
    selectedSize: '30ml',
    originalPrice: 48,
    offerPrice: 29,
    discountPercent: 40,
    badge: 'خصم 40%',
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'offer-2',
    title: 'باقة المسك النقي 3 زيوت مركزة',
    perfumeId: 3,
    selectedSize: '10ml',
    originalPrice: 36,
    offerPrice: 22,
    discountPercent: 38,
    badge: 'الأكثر توفيراً',
    active: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  }
];

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    name: 'زجاجة عطر لينا الفاخرة',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    size: '124 KB',
    createdAt: '2026-09-01'
  },
  {
    id: 'media-2',
    name: 'تركيبة رجالية فاخرة',
    url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    size: '115 KB',
    createdAt: '2026-09-01'
  },
  {
    id: 'media-3',
    name: 'زيوت عطرية نسائية',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    size: '98 KB',
    createdAt: '2026-09-01'
  },
  {
    id: 'media-4',
    name: 'مسك الطهارة وقوارير الزيت',
    url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    size: '142 KB',
    createdAt: '2026-09-01'
  }
];

export const DEFAULT_PROMOTIONS: PromotionCoupon[] = [
  {
    id: 'promo-1',
    code: 'LINA10',
    type: 'percentage',
    value: 10,
    minOrder: 70,
    expiresAt: '2026-12-31',
    active: true,
    usageCount: 18,
  },
  {
    id: 'promo-2',
    code: 'RAMADAN',
    type: 'percentage',
    value: 15,
    minOrder: 100,
    expiresAt: '2026-12-31',
    active: true,
    usageCount: 42,
  },
  {
    id: 'promo-3',
    code: 'BIENVENUE',
    type: 'fixed',
    value: 5,
    minOrder: 50,
    expiresAt: '2026-12-31',
    active: true,
    usageCount: 29,
  }
];

