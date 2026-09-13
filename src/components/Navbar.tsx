import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Heart, User, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigateView: (view: 'home' | 'shop' | 'about' | 'contact' | 'tracking' | 'admin') => void;
  onNavigateCategory: (category: string) => void;
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onSearchChange?: (term: string) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onNavigateCategory,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
  onSearchChange,
  isAdminLoggedIn,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
    onNavigateView('shop');
    setSearchOpen(false);
  };

  return (
    <>
      {/* Admin Status Strip if active */}
      {isAdminLoggedIn && (
        <div id="admin-active-strip" className="bg-[#111111] text-[#E8E1D5] border-b border-[#C9A227]/30 py-1.5 px-4 text-center text-xs flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2 mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
            <span className="font-serif tracking-wider text-[11px] text-[#C9A227]">لوحة الإدارة مفعّلة</span>
            <span className="text-neutral-400 text-[11px] hidden sm:inline">| يمكنك تعديل المنتجات والطلبات والواجهة</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#E8E1D5] hover:text-[#C9A227] underline text-[11px] mr-2 font-bold cursor-pointer"
            >
              الذهاب للوحة الإدارة
            </button>
          </div>
        </div>
      )}

      {/* Main Luxury Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-[#0A0A0A]/60 backdrop-blur-sm border-b border-white/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Desktop LEFT: Logo & Haute Parfumerie Subtitle */}
            <div className="flex items-center">
              <button
                onClick={() => onNavigateView('home')}
                id="brand-logo"
                className="text-right group cursor-pointer focus:outline-none flex items-center gap-3"
              >
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#E8E1D5] group-hover:text-white transition-colors uppercase">
                      LINA SHOP
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mb-1" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#C9A227] font-serif uppercase -mt-0.5">
                    HAUTE PARFUMERIE
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop CENTER: Navigation Menu */}
            <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#E8E1D5]/80">
              <button
                onClick={() => onNavigateView('home')}
                className={`transition-colors py-1 cursor-pointer hover:text-white ${
                  currentView === 'home' ? 'text-white border-b border-[#C9A227]' : ''
                }`}
              >
                الرئيسية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('الكل');
                  onNavigateView('shop');
                }}
                className={`transition-colors py-1 cursor-pointer hover:text-white ${
                  currentView === 'shop' ? 'text-white border-b border-[#C9A227]' : ''
                }`}
              >
                المتجر
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عطور نسائية');
                  onNavigateView('shop');
                }}
                className="transition-colors py-1 cursor-pointer hover:text-white"
              >
                عطور نسائية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عطور رجالية');
                  onNavigateView('shop');
                }}
                className="transition-colors py-1 cursor-pointer hover:text-white"
              >
                عطور رجالية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عروض خاصة');
                  onNavigateView('shop');
                }}
                className="transition-colors py-1 cursor-pointer hover:text-[#C9A227] text-[#C9A227]"
              >
                العروض
              </button>

              <button
                onClick={() => onNavigateView('about')}
                className={`transition-colors py-1 cursor-pointer hover:text-white ${
                  currentView === 'about' ? 'text-white border-b border-[#C9A227]' : ''
                }`}
              >
                عن المتجر
              </button>

              <button
                onClick={() => onNavigateView('contact')}
                className={`transition-colors py-1 cursor-pointer hover:text-white ${
                  currentView === 'contact' ? 'text-white border-b border-[#C9A227]' : ''
                }`}
              >
                تواصل معنا
              </button>
            </nav>

            {/* Desktop RIGHT: Search, Account / Admin, Cart */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Icon */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#E8E1D5]/80 hover:text-[#C9A227] transition-colors cursor-pointer rounded-full hover:bg-white/5"
                aria-label="بحث"
                title="بحث"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Account / Admin Trigger */}
              <button
                id="account-btn"
                onClick={onOpenAdmin}
                className="p-2 text-[#E8E1D5]/80 hover:text-[#C9A227] transition-colors cursor-pointer rounded-full hover:bg-white/5 relative group"
                aria-label="حسابي أو الإدارة"
                title={isAdminLoggedIn ? "لوحة الإدارة" : "حسابي / المشرف"}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                {isAdminLoggedIn && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C9A227]" />
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                id="cart-drawer-trigger"
                onClick={onOpenCart}
                className="relative p-2 text-[#E8E1D5] hover:text-[#C9A227] transition-colors flex items-center justify-center cursor-pointer rounded-full hover:bg-white/5"
                aria-label="سلة التسوق"
                title="سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span
                    id="cart-counter-badge"
                    className="absolute -top-0.5 -right-0.5 bg-[#C9A227] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans shadow"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#E8E1D5] hover:text-white cursor-pointer"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

          {/* Minimal Search Bar Dropdown */}
          {searchOpen && (
            <div className="pt-3 pb-1 transition-all">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  placeholder="ابحث عن اسم العطر أو المكونات (مسك، عود، نيرولي، كرز، فانيليا)..."
                  className="w-full pl-10 pr-12 py-3 rounded-none bg-[#111111] border border-[#C9A227]/40 text-[#E8E1D5] placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#C9A227] text-right"
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                  >
                    مسح
                  </button>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden bg-[#0A0A0A]/98 border-b border-white/10 px-6 py-6 space-y-4 text-right shadow-2xl transition-all"
          >
            <div className="flex flex-col space-y-3.5 font-serif text-sm text-[#E8E1D5]">
              <button
                onClick={() => {
                  onNavigateView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                الرئيسية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('الكل');
                  onNavigateView('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                المتجر
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عطور نسائية');
                  onNavigateView('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                عطور نسائية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عطور رجالية');
                  onNavigateView('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                عطور رجالية
              </button>

              <button
                onClick={() => {
                  onNavigateCategory('عروض خاصة');
                  onNavigateView('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 text-[#C9A227] border-b border-white/5"
              >
                العروض الخاصة
              </button>

              <button
                onClick={() => {
                  onNavigateView('about');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                عن المتجر
              </button>

              <button
                onClick={() => {
                  onNavigateView('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 hover:text-[#C9A227] border-b border-white/5"
              >
                تواصل معنا
              </button>

              <button
                onClick={() => {
                  onOpenTracking();
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 text-[#C9A227] hover:underline flex items-center justify-between"
              >
                <span>تتبع طلبك</span>
                <ArrowLeft className="w-4 h-4 text-[#C9A227]" />
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 bg-[#111111] hover:bg-[#181818] text-[#E8E1D5] text-xs font-serif tracking-wider border border-white/10 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>لوحة التحكم الإدارية</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
