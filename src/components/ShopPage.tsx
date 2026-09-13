import React, { useState, useMemo } from 'react';
import { ShoppingBag, Heart, Eye, Filter, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { Perfume } from '../types';

interface ShopPageProps {
  perfumes: Perfume[];
  initialCategory?: string;
  initialSearch?: string;
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (perfume: Perfume) => void;
  onSelectProduct: (perfume: Perfume) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  perfumes,
  initialCategory = 'الكل',
  initialSearch = '',
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(350);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('bestseller');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories = ['الكل', 'عطور نسائية', 'عطور رجالية', 'عطور للجنسين', 'عطور فاخرة', 'عروض خاصة'];

  const filteredProducts = useMemo(() => {
    return perfumes.filter((perfume) => {
      if (perfume.isActive === false) return false;

      // Category filter
      if (selectedCategory === 'عروض خاصة') {
        if (!perfume.isSpecialOffer && !(perfume.originalPrice && perfume.originalPrice > perfume.price)) {
          return false;
        }
      } else if (selectedCategory !== 'الكل') {
        if (perfume.category !== selectedCategory) return false;
      }

      // Gender filter
      if (selectedGender !== 'all') {
        if (perfume.gender && perfume.gender !== selectedGender && perfume.gender !== 'unisex') {
          return false;
        }
      }

      // Size filter
      if (selectedSize !== 'all') {
        if (!perfume.volume?.toLowerCase().includes(selectedSize.toLowerCase()) && !perfume.sizes?.includes(selectedSize)) {
          return false;
        }
      }

      // Price filter
      if (perfume.price > priceRange) return false;

      // Offers only filter
      if (onlyOffers && !perfume.isSpecialOffer && !(perfume.originalPrice && perfume.originalPrice > perfume.price)) {
        return false;
      }

      // In stock only filter
      if (onlyInStock && perfume.inStock === false) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = perfume.name.toLowerCase().includes(q) || (perfume.arabicName && perfume.arabicName.toLowerCase().includes(q));
        const matchesCat = perfume.category.toLowerCase().includes(q);
        const matchesNotes = perfume.notes && (
          (perfume.notes.top && perfume.notes.top.toLowerCase().includes(q)) ||
          (perfume.notes.heart && perfume.notes.heart.toLowerCase().includes(q)) ||
          (perfume.notes.base && perfume.notes.base.toLowerCase().includes(q))
        );
        if (!matchesName && !matchesCat && !matchesNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // Default: bestseller
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [perfumes, selectedCategory, selectedGender, selectedSize, priceRange, onlyOffers, onlyInStock, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('الكل');
    setSelectedGender('all');
    setSelectedSize('all');
    setPriceRange(350);
    setOnlyOffers(false);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#E8E1D5] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Header */}
        <div className="text-right space-y-3 mb-10 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 text-[11px] font-serif uppercase tracking-[0.3em] text-[#C9A227]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CATALOGUE HAUTE PARFUMERIE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#E8E1D5] tracking-tight">
            اكتشف العطور
          </h1>
          <p className="text-xs sm:text-sm text-[#ACA394] font-sans font-light max-w-xl">
            مجموعة عطور راقية مستوحاة من التراث التونسي وعالم النيش الفاخر. تركيبات استثنائية وثبات يدوم طويلاً.
          </p>
        </div>

        {/* Top Controls Bar: Categories Pills + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-serif tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#E8E1D5] text-[#0A0A0A] font-bold border-[#E8E1D5]'
                    : 'bg-[#111111] text-[#ACA394] border-white/5 hover:border-[#C9A227]/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Toolbar: Mobile Filter Trigger & Sort Dropdown */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-[#111111] border border-white/10 text-xs font-serif text-[#E8E1D5] flex items-center gap-2 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>تصفية ({filteredProducts.length})</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#111111] border border-white/10 px-3 py-1.5 text-xs text-[#E8E1D5]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A227]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-serif text-[#E8E1D5] focus:outline-none cursor-pointer text-right"
              >
                <option value="bestseller" className="bg-[#111111] text-[#E8E1D5]">الأكثر طلباً</option>
                <option value="newest" className="bg-[#111111] text-[#E8E1D5]">الأحدث</option>
                <option value="price-low" className="bg-[#111111] text-[#E8E1D5]">السعر: من الأقل للأعلى</option>
                <option value="price-high" className="bg-[#111111] text-[#E8E1D5]">السعر: من الأعلى للأقل</option>
                <option value="rating" className="bg-[#111111] text-[#E8E1D5]">الأعلى تقييماً</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Layout: Filters Sidebar (Desktop) + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <aside className={`lg:col-span-3 bg-[#111111] border border-white/5 p-6 space-y-6 text-right ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0A] p-6' : 'hidden lg:block'
          }`}>
            
            {/* Mobile Header with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 lg:hidden">
              <span className="font-serif font-bold text-lg text-[#E8E1D5]">خيارات التصفية</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#E8E1D5]">خيارات الفرز</span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#C9A227] hover:underline cursor-pointer"
              >
                إعادة ضبط
              </button>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-serif text-[#ACA394] uppercase tracking-wider block">
                الفئة / الجنس:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { label: 'الكل', val: 'all' },
                  { label: 'نسائي', val: 'women' },
                  { label: 'رجالي', val: 'men' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedGender(item.val)}
                    className={`py-1.5 text-[11px] font-serif border transition-all cursor-pointer ${
                      selectedGender === item.val
                        ? 'bg-[#E8E1D5] text-[#0A0A0A] border-[#E8E1D5] font-bold'
                        : 'bg-[#161616] text-[#ACA394] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-[#E8E1D5]">{priceRange} د.ت</span>
                <span className="text-[11px] font-serif text-[#ACA394] uppercase tracking-wider">
                  أقصى سعر:
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="350"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#C9A227] cursor-pointer bg-neutral-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-serif">
                <span>350 د.ت</span>
                <span>50 د.ت</span>
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-serif text-[#ACA394] uppercase tracking-wider block">
                حجم العطر:
              </span>
              <div className="flex gap-2 text-xs">
                {['all', '50 ml', '100 ml'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-1.5 text-[11px] font-serif border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#E8E1D5] text-[#0A0A0A] border-[#E8E1D5] font-bold'
                        : 'bg-[#161616] text-[#ACA394] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {size === 'all' ? 'جميع الأحجام' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="flex items-center justify-between text-xs text-[#E8E1D5] cursor-pointer">
                <span>عروض وتخفيضات خاصة فقط</span>
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="accent-[#C9A227] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-[#E8E1D5] cursor-pointer">
                <span>المتوفر في المخزن فقط</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-[#C9A227] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Mobile apply button */}
            {mobileFilterOpen && (
              <div className="pt-4 lg:hidden">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#C9A227] text-[#0A0A0A] font-serif font-bold text-xs uppercase"
                >
                  تطبيق النتائج ({filteredProducts.length})
                </button>
              </div>
            )}

          </aside>

          {/* Products Grid: Desktop 4 columns, Tablet 3 columns, Mobile 2 columns */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-[#111111] border border-white/5 p-8">
                <p className="font-serif text-lg text-[#E8E1D5]">لا توجد عطور مطابقة للخيارات المحددة.</p>
                <p className="text-xs text-[#ACA394]">جرب تغيير خيارات التصفية أو مسح كلمات البحث.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2.5 bg-[#E8E1D5] text-[#0A0A0A] font-serif text-xs uppercase tracking-wider"
                >
                  إعادة ضبط الكل
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((perfume) => {
                  const isWishlisted = wishlistIds.includes(perfume.id);
                  const discountPercent = perfume.originalPrice && perfume.originalPrice > perfume.price
                    ? Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)
                    : null;

                  return (
                    <div
                      key={perfume.id}
                      className="group relative flex flex-col bg-[#111111] border border-white/5 hover:border-[#C9A227]/40 transition-all duration-300"
                    >
                      {/* Product Image Box */}
                      <div
                        onClick={() => onSelectProduct(perfume)}
                        className="relative aspect-[3/4] overflow-hidden bg-[#141414] cursor-pointer"
                      >
                        <img
                          src={perfume.image}
                          alt={perfume.arabicName || perfume.name}
                          className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                          {discountPercent && (
                            <span className="bg-[#C9A227] text-[#0A0A0A] text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase font-sans">
                              -{discountPercent}%
                            </span>
                          )}
                          {perfume.isNew && (
                            <span className="bg-[#E8E1D5] text-[#0A0A0A] text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase font-sans">
                              جديد
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(perfume.id);
                          }}
                          className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                            isWishlisted
                              ? 'bg-[#C9A227] text-[#0A0A0A]'
                              : 'bg-[#0A0A0A]/60 text-white hover:text-[#C9A227] hover:bg-[#0A0A0A]'
                          }`}
                          aria-label="إضافة للمفضلة"
                        >
                          <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>

                        {/* Quick hover add button */}
                        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(perfume);
                            }}
                            className="flex-1 py-2 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] text-[11px] font-serif tracking-wider uppercase flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </div>

                      {/* Product Metadata */}
                      <div className="p-3.5 sm:p-4 flex flex-col flex-1 text-right space-y-1.5">
                        <span className="text-[10px] text-[#C9A227] font-serif uppercase tracking-wider block">
                          {perfume.category}
                        </span>

                        <h3
                          onClick={() => onSelectProduct(perfume)}
                          className="text-sm sm:text-base font-serif font-bold text-[#E8E1D5] group-hover:text-white transition-colors cursor-pointer leading-tight line-clamp-1"
                        >
                          {perfume.arabicName || perfume.name}
                        </h3>

                        <p className="text-[11px] text-[#ACA394] font-serif tracking-wider uppercase font-light">
                          {perfume.name}
                        </p>

                        <div className="pt-2 mt-auto border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-base font-serif font-bold text-[#E8E1D5]">
                              {perfume.price} د.ت
                            </span>
                            {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                              <span className="text-[10px] text-neutral-500 line-through">
                                {perfume.originalPrice} د.ت
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onAddToCart(perfume)}
                            className="text-xs text-[#C9A227] hover:text-white font-serif uppercase cursor-pointer"
                          >
                            + شراء
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
