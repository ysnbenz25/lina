const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jkdwpnmcnidfftebypet.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Curated high-resolution perfume imagery by fragrance category
const MEN_IMAGES = [
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
];

const WOMEN_IMAGES = [
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592945403407-953e5e495a8b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?auto=format&fit=crop&w=800&q=80',
];

const UNISEX_IMAGES = [
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
];

// Raw list supplied by user
const RAW_CATALOG = `
Ana abiyedh lattafa unisex
Invictus rabanne homme
Acqua di gio profondo giorgio armani homme
Vibrato sospiro unisex
212 homme carolina herrera homme
Dior homme intense dior homme
Odyssey mandarin sky armaf homme
9pm afnan homme
Chloe chloe femme
Premier jour nina ricci femme
Bare sueded vanilla victoria secret femme
Greenley de marly unisex
Oud maracuja crivelli unisex
Golden dust sunnamusk unisex
Erba gold xerjoff unisex
Teriaq lattafa unisex
Hibiscus mahajád crivelli unisex
Lost cherry tom ford unisex
Sava gissah unisex
Musk tahara unisex
Musk sir el ounoutha femme
Althair de marly homme
Aventus creed homme
Acqua di gio giorgio armani homme
Almaz kajal unisex
Alien mugler femme
Angelique noire guerlain unisex
Allure sport chanel homme
Armani code giorgio armani homme
Angel's share kilian unisex
Aican kajal unisex
Astrum nova electimuss unisex
Boss the scent hugo boss homme
Black vanilla mancera unisex
Baccarat rouge 540 francis kurkdjian unisex
Bloom midnight victoria secret femme
Bleu de chanel chanel homme
Black xs rabanne homme
Burberry her burberry femme
Brut brut parfums prestige homme
Bois talisman dior unisex
Bianco latte giardini di toscana unisex
Blanche bete les liquides imaginaires unisex
Black sea lorenzo pazzaglia unisex
Boss bottled pacific hugo boss homme
Baliflora laboratorio olfattivo unisex
Beijos de sol sol de janeiro femme
Coucou toi arona femme
Coco vanille mancera femme
Coconut passion victoria secret femme
Creme brulee theodoros kalotinis unisex
Class class homme
Castley de marly homme
Carioca crush sol de janeiro femme
Cheirosa 59 sol de janeiro femme
Cheeky biquini sol de janeiro femme
Delina de marly femme
Diable bleu creation lamis homme
Donna born in roma valentino femme
Donna born in roma green stravaganza valentino femme
Dunhill alfred dunhill homme
D red diesel unisex
Dgvib3 dolce&gabbana unisex
Erba pura xerjoff unisex
Escada moon sparkle escada femme
Escada candy love escada femme
Escada taj sunset escada femme
Eclaire lattafa femme
Eros versace homme
Forever wanted elixir azzaro homme
Fantasmagory  louis vuitton unisex
For him hawas homme
Flora gucci femme
Fakhar rose lattafa femme
Gentleman givenchy homme
God of fire stéphane humbert lucas 777 unisex
Guilty gucci femme
Grand soir francis kurkdjian unisex
Hypnotic poison dior femme
Hacivat nishane unisex
Idole lancome femme
Imagination louis vuitton homme
Jasmin noir bvlgari femme
Kayali eden juicy apple 01 kayali femme
Kayali yum pistachio gelato 33 kayali unisex
Kayali yum boujee marshmallow 81 kayali femme
Kayali freedom musk bouquet 27 kayali unisex
Kayali vanilla candy rock sugar 42 kayali femme
Kayali maui in a bottle sweet banana 37 kayali femme
Kayali eden sparkling lychee 39 kayali femme
Kayali fleur majesty rose royale 31 kayali femme
Kayali deja vue white flower 57 kayali unisex
Kayali maldives in a bottle ylang coco 20 kayali femme
Kayali the wedding silk santal 36 kayali femme
Kayali utopia vanilla coco 21 kayali unisex
Kayali eden sweet peach 35 kayali femme
Kayali eden plush pear 23 kayali femme
Kirke tiiziana terenzi unisex
Kissing burns 6.4 calories a minute. wanna workout? kilian unisex
Khamrah lattafa unisex
Khamrah qahwa lattafa unisex
Le male elixir jean paul gaultier homme
Le beau paradise garden jean paul gaultier homme
Lacoste blanc l.12.12 lacoste homme
Light blue dolce&gabbana homme
Libre yves saint laurent femme
Libre vanille couture yves saint laurent femme
L'interdit givenchy femme
Le jardin de mr li hermes unisex
La vie est belle vanille nude lancome femme
L'eau pure kenzo unisex
L'homme a la rose francis kurkdjian homme
Libre berry crush yves saint laurent femme
Limonada gelada sol de janeiro femme
My burberry burberry femme
My way giorgio armani femme
Megamare orto parisi unisex
Myslf yves saint laurent homme
Man glacial bvlgari homme
Million gold for her rabanne femme
Melody of the sun mancera unisex
Madawi arabian oud femme
Naxos xj 1861 xerjoff unisex
Narciso poudree narciso rodriguez femme
One million royal rabanne homme
One million elixir rabanne homme
Oriana de marly femme
One & only gissah femme
Pineapple dolce&gabbana unisex
Prada paradoxe prada femme
Polo blue ralph lauren homme
Pegasus de marly homme
Pacific chill louis vuitton unisex
Power of you giorgio armani femme
Petit matin francis kurkdjian unisex
Pure xs for her rabanne femme
Red tobacco mancera unisex
Rosso accento sospiro unisex
Rose amira guerlain unisex
Rose star dior unisex
StrongerStronger with you giorgio armani homme
Scandal homme jean paul gaultier homme
Scandal femme jean paul gaultier femme
Sauvage dior homme
Silver scent jacques bogart homme
Summer hammer lorenzo pazzaglia unisex
Symphony louis vuitton unisex
Shalimar souffle guerlain femme
sencial orchid laurent mazzone femme
Safran secret crivelli unisex
Stronger with you sandalwood giorgio armani unisex
Stronger with you intensely giorgio armani homme
Stellar times louis vuitton unisex
Speed legends living on the edge ex nihilo unisex
Smoking hot kilian unisex
Summer e amor sol de janeiro femme
The one homme dolce&gabbana homme
Terre dhermes hermes homme
Tubereuse astrale crivelli unisex
Torino24 xerjoff unisex
The most wanted azzaro homme
Venus nina ricci femme
Vanilla powder matiere premiere unisex
Voila! gissah femme
Whisky silver evaflor homme
Yara lattafa femme
Y yves saint laurent homme
`;

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Map brands/houses to Arabic name representation
const BRAND_ARABIC = {
  'lattafa': 'لطافة',
  'rabanne': 'باكو رابان',
  'paco rabanne': 'باكو رابان',
  'giorgio armani': 'جورجيو أرماني',
  'armani': 'جورجيو أرماني',
  'sospiro': 'سوسبيرو',
  'carolina herrera': 'كارولينا هيريرا',
  'dior': 'ديور',
  'armaf': 'أرماف',
  'afnan': 'أفنان',
  'chloe': 'كلوي',
  'nina ricci': 'نينا ريتشي',
  'victoria secret': 'فيكتوريا سيكريت',
  'de marly': 'بارفان دو مارلي',
  'parfums de marly': 'بارفان دو مارلي',
  'crivelli': 'ميزون كريفيللي',
  'sunnamusk': 'سنامسك',
  'xerjoff': 'زيرجوف',
  'tom ford': 'توم فورد',
  'gissah': 'قصة',
  'creed': 'كريد',
  'kajal': 'كاجال',
  'mugler': 'موغلر',
  'guerlain': 'جيرلان',
  'chanel': 'شانيل',
  'kilian': 'كيليان',
  'electimuss': 'إليكتيموس',
  'hugo boss': 'هوغو بوس',
  'mancera': 'مانسيرا',
  'francis kurkdjian': 'ميزون فرانسيس كوركدجيان',
  'prestige': 'بريستيج',
  'giardini di toscana': 'جيارديني دي توسكانا',
  'les liquides imaginaires': 'لي ليكيد إيماجينير',
  'lorenzo pazzaglia': 'لورينزو بازاليا',
  'laboratorio olfattivo': 'لابوراتوريو أولفاتيفو',
  'sol de janeiro': 'سول دي جانيرو',
  'arona': 'أرونا',
  'theodoros kalotinis': 'ثيودوروس كالوتينيس',
  'class': 'كلاس',
  'creation lamis': 'كرياشن لاميس',
  'valentino': 'فالنتينو',
  'alfred dunhill': 'دنهل',
  'diesel': 'ديزل',
  'dolce&gabbana': 'دولتشي آند غابانا',
  'escada': 'إسكادا',
  'versace': 'فرزاتشي',
  'azzaro': 'أزارو',
  'louis vuitton': 'لويس فيتون',
  'hawas': 'رصاصي هوس',
  'gucci': 'غوتشي',
  'givenchy': 'جيفنشي',
  'stéphane humbert lucas 777': 'ستيفان همبرت لوكاس',
  'nishane': 'نيشاني',
  'lancome': 'لانكوم',
  'bvlgari': 'بولغاري',
  'kayali': 'خيالي (كيالي)',
  'tiiziana terenzi': 'تيزيانا تيرينزي',
  'jean paul gaultier': 'جان بول غوتييه',
  'lacoste': 'لاكوست',
  'yves saint laurent': 'إيف سان لوران',
  'hermes': 'هيرميس',
  'kenzo': 'كينزو',
  'orto parisi': 'أورتو باريسي',
  'arabian oud': 'العربية للعود',
  'narciso rodriguez': 'نارسيسو رودريغيز',
  'prada': 'برادا',
  'ralph lauren': 'رالف لورين',
  'jacques bogart': 'جاك بوغارت',
  'laurent mazzone': 'لوران مازون',
  'ex nihilo': 'إكس نيهيلو',
  'matiere premiere': 'ماتيير بريميير',
  'evaflor': 'إيفافلور'
};

function formatPerfumeRow(rawLine, index) {
  let line = rawLine.trim();
  // Fix typos in user prompt
  if (line.startsWith('StrongerStronger')) {
    line = line.replace('StrongerStronger', 'Stronger');
  }

  let gender = 'unisex';
  let category = 'عطور للجنسين';
  let imageList = UNISEX_IMAGES;

  if (line.endsWith('homme')) {
    gender = 'men';
    category = 'عطور رجالية';
    imageList = MEN_IMAGES;
    line = line.replace(/\s+homme$/, '');
  } else if (line.endsWith('femme')) {
    gender = 'women';
    category = 'عطور نسائية';
    imageList = WOMEN_IMAGES;
    line = line.replace(/\s+femme$/, '');
  } else if (line.endsWith('unisex')) {
    gender = 'unisex';
    category = 'عطور للجنسين';
    imageList = UNISEX_IMAGES;
    line = line.replace(/\s+unisex$/, '');
  }

  const englishName = toTitleCase(line);
  
  // Pick image
  const image = imageList[index % imageList.length];

  // Derive Arabic name
  let brandAr = '';
  const lowerLine = line.toLowerCase();
  for (const [key, val] of Object.entries(BRAND_ARABIC)) {
    if (lowerLine.includes(key)) {
      brandAr = val;
      break;
    }
  }

  let arabicName = `تركيبة مستوحاة من ${englishName}`;
  if (brandAr) {
    arabicName = `${englishName} ~ ${brandAr}`;
  }

  const badges = ['إصدار فاخر', 'الأكثر طلباً', 'مستوحى بحرفية', 'ثبات عالي', 'عرض حصري'];
  const badge = badges[index % badges.length];

  return {
    id: `prod_${String(index + 10).padStart(3, '0')}`,
    name: englishName,
    arabic_name: arabicName,
    price: 16,
    original_price: 22,
    category: category,
    image: image,
    description: `تركيبة عطرية مستوحاة من ${englishName} بأعلى تركيز وثباتية تدوم طويلاً، متوفرة حصرياً لدى متجر لينا للعطور بالأحجام 30ml و50ml و100ml.`,
    in_stock: true,
    volume: '30ml (متوفر 30ml / 50ml / 100ml)',
    badge: badge,
    top_note: gender === 'men' ? 'برغموت منعش، خزامى، فلفل وردي' : gender === 'women' ? 'زهور بيضاء، فانيلا، فواكه استوائية' : 'عنبر ناعم، برغموت، خشب الصندل',
    heart_note: gender === 'men' ? 'فلفل أسود، باتشولي، خشب الأرز' : gender === 'women' ? 'ياسمين، مسك الروم، ورد تركي' : 'أزهار شرقية، هيل، توابل دافئة',
    base_note: gender === 'men' ? 'عنبر، مسك، نجيل الهند' : gender === 'women' ? 'فانيليا بوربون، مسك، خشب الصندل' : 'أمبروكسان، خشب الصندل، مسك نقي',
    longevity: 'يدوم أكثر من 18 ساعة',
    sillage: 'قوي ونفاذ جداً',
    season: 'جميع الفصول / مناسبات خاصة',
    rating: Number((4.7 + ((index % 4) * 0.1)).toFixed(1)),
    reviews_count: 15 + (index % 40) * 3,
  };
}

async function main() {
  console.log('--- Seeding Custom Catalog into public.products ---');
  
  // 1. Fetch existing products to avoid duplicating
  const { data: existingRows, error: fetchErr } = await supabase.from('products').select('id, name, arabic_name');
  if (fetchErr) {
    console.error('Error fetching existing rows:', fetchErr);
    process.exit(1);
  }
  
  const existingNames = new Set(
    (existingRows || []).map(r => (r.name || '').toLowerCase().trim())
  );
  console.log(`Found ${existingRows.length} existing products in Supabase.`);

  // 2. Parse raw lines
  const lines = RAW_CATALOG.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 1 && !/^[A-Z]$/.test(l));

  console.log(`Total valid perfume lines: ${lines.length}`);

  const toInsert = [];
  lines.forEach((line, idx) => {
    const item = formatPerfumeRow(line, idx);
    const normName = item.name.toLowerCase().trim();
    
    // Check if duplicate of existing in Supabase
    let alreadyExists = false;
    for (const ex of existingNames) {
      if (ex.includes(normName) || normName.includes(ex)) {
        alreadyExists = true;
        break;
      }
    }

    if (!alreadyExists) {
      toInsert.push(item);
    } else {
      console.log(`Skipping already existing perfume: ${item.name}`);
    }
  });

  console.log(`New perfumes to insert: ${toInsert.length}`);

  // Insert in batches of 20
  const BATCH_SIZE = 20;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)...`);
    const { data, error } = await supabase.from('products').insert(batch).select('id');
    if (error) {
      console.error('Batch insert error:', error);
      // Try item by item in this batch to identify culprit
      for (const singleItem of batch) {
        const { error: singleErr } = await supabase.from('products').insert(singleItem);
        if (singleErr) {
          console.error(`Error on single item ${singleItem.name}:`, singleErr.message);
        } else {
          console.log(`Successfully inserted individual item: ${singleItem.name}`);
        }
      }
    } else {
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} inserted successfully!`);
    }
  }

  // Final count
  const { data: finalRows } = await supabase.from('products').select('id', { count: 'exact' });
  console.log(`--- Finished! Total products now in public.products: ${finalRows?.length} ---`);
}

main();
