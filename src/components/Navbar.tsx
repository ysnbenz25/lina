import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Truck, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onNavigateCategory: (category: string) => void;
  onSearchChange?: (term: string) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount = 0,
  onOpenCart,
  onOpenTracking,
  onOpenAdmin,
  onNavigateCategory,
  onSearchChange,
  isAdminLoggedIn,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Detect scroll to toggle transparent/solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
    const productsEl = document.getElementById('products');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Admin status bar if logged in */}
      {isAdminLoggedIn && (
        <div id="admin-active-strip" className="bg-[#d4af37] text-[#070709] py-1 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 z-50 relative">
          <ShieldCheck className="w-4 h-4" />
          <span>لوحة المشرف مفعّلة: يمكنك تعديل العطور، الأسعار والطلبات.</span>
          <button
            onClick={onOpenAdmin}
            className="underline hover:text-black mr-2 font-black cursor-pointer"
          >
            فتح لوحة الأدمن
          </button>
        </div>
      )}

      {/* Main Header */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#070709]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-2xl py-3'
            : 'bg-[#070709]/70 backdrop-blur-sm border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Right (in RTL): Brand Logo */}
            <a href="#hero" id="brand-logo" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center bg-[#101015] text-[#d4af37] font-serif text-xl font-bold group-hover:border-[#d4af37] transition-all shadow-md shadow-[#d4af37]/10 group-hover:scale-105">
                L
              </div>
              <div className="flex flex-col text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-white group-hover:text-[#d4af37] transition-colors uppercase">
                  Lina Shop
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#d4af37] font-serif -mt-0.5">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </a>

            {/* Center (Desktop Navigation Links) */}
            <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-7 text-xs font-semibold text-neutral-300">
              <a
                href="#hero"
                className="hover:text-[#d4af37] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#d4af37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                الرئيسية
              </a>
              <a
                href="#products"
                onClick={() => onNavigateCategory('الكل')}
                className="hover:text-[#d4af37] transition-colors py-1"
              >
                المتجر
              </a>
              <button
                onClick={() => {
                  onNavigateCategory('عطور فاخرة');
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#d4af37] transition-colors py-1 cursor-pointer"
              >
                العطور الفاخرة
              </button>
              <button
                onClick={() => {
                  onNavigateCategory('عروض خاصة');
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#d4af37] transition-colors py-1 cursor-pointer text-[#e5ca78]"
              >
                العروض
              </button>
              <button
                onClick={onOpenTracking}
                className="hover:text-[#d4af37] transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>تتبع الطلب</span>
              </button>
              <a
                href="#contact"
                className="hover:text-[#d4af37] transition-colors py-1"
              >
                تواصل معنا
              </a>
            </nav>

            {/* Left Actions (Icons) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Toggle Button */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full bg-[#121218] border border-white/10 hover:border-[#d4af37]/50 text-neutral-300 hover:text-[#d4af37] transition-colors cursor-pointer"
                aria-label="بحث في العطور"
                title="بحث"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Shopping Cart Trigger */}
              <button
                id="cart-drawer-trigger"
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full bg-[#121218] border border-white/10 hover:border-[#d4af37]/60 transition-all text-white hover:text-[#d4af37] flex items-center justify-center group active:scale-95 cursor-pointer"
                aria-label="سلة التسوق"
                title="سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span
                    id="cart-counter-badge"
                    className="absolute -top-1 -right-1 bg-[#d4af37] text-[#070709] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-sans shadow-md animate-pulse"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Button */}
              <button
                id="admin-login-shortcut"
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121218] hover:bg-[#181822] text-neutral-300 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/40 text-xs font-semibold transition-colors cursor-pointer"
                title="لوحة الأدمن"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[11px]">الأدمن</span>
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="القائمة الرئيسية"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>

          {/* Search Dropdown Input Bar */}
          {searchOpen && (
            <div className="pt-3 pb-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  placeholder="ابحث عن عطرك المفضل... (مثال: عود إمبريال، مسك لينا، نيرولي)"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#101015] border border-[#d4af37]/40 text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] text-right"
                  autoFocus
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                  >
                    مسح
                  </button>
                )}
              </form>
            </div>
          )}

        </div>

        {/* Mobile Menu Drawer/Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden bg-[#0a0a0e] border-b border-[#d4af37]/20 px-6 py-5 space-y-3 text-right shadow-2xl animate-in slide-in-from-top duration-200"
          >
            <div className="flex flex-col space-y-3 font-serif text-sm">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-200 hover:text-[#d4af37] border-b border-white/5"
              >
                الرئيسية
              </a>
              <a
                href="#products"
                onClick={() => {
                  onNavigateCategory('الكل');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-neutral-200 hover:text-[#d4af37] border-b border-white/5"
              >
                المتجر
              </a>
              <button
                onClick={() => {
                  onNavigateCategory('عطور فاخرة');
                  setMobileMenuOpen(false);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-right py-2 text-neutral-200 hover:text-[#d4af37] border-b border-white/5"
              >
                العطور الفاخرة
              </button>
              <button
                onClick={() => {
                  onNavigateCategory('عروض خاصة');
                  setMobileMenuOpen(false);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-right py-2 text-[#e5ca78] hover:text-[#d4af37] border-b border-white/5"
              >
                العروض الخاصة
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="text-right py-2 text-neutral-200 hover:text-[#d4af37] border-b border-white/5 flex items-center justify-between"
              >
                <span>تتبع الطلب</span>
                <Truck className="w-4 h-4 text-[#d4af37]" />
              </button>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-200 hover:text-[#d4af37] border-b border-white/5"
              >
                تواصل معنا
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 bg-[#14141c] hover:bg-[#d4af37] text-neutral-300 hover:text-[#070709] text-xs font-semibold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>لوحة تحكم الأدمن</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
