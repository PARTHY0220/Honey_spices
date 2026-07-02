import { useState, useEffect } from 'react';
import logoImg from '../assets/logo.webp';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  { name: 'Home', view: 'home' },
  { name: 'Products', view: 'products' },
  { name: 'About Us', view: 'about' },
  { name: 'Contact', view: 'contact' },
];

const Navbar = ({ setView, currentView, cartCount = 0 }) => {
  const { user, profile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavLinkClick = (e, targetView) => {
    e.preventDefault();
    setIsOpen(false);
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/55 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <button
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
        >
          {/* Honey Spices Image Logo */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-500/25 group-hover:border-amber-500 transition-colors duration-500 bg-neutral-900 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <img
              src={logoImg}
              alt="Honey Spices Logo"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-serif tracking-[0.2em] text-sm sm:text-base font-bold transition-colors duration-300 group-hover:text-amber-400">
              HONEY SPICES
            </span>
            <span className="text-[7.5px] text-amber-500 tracking-[0.34em] uppercase -mt-0.5 font-bold">
              Pure • Natural • Authentic
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={`#${link.view}`}
              onClick={(e) => handleNavLinkClick(e, link.view)}
              className={`relative py-2 text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-300 group ${
                currentView === link.view ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-orange-500 to-amber-500 transform transition-transform duration-300 origin-left ${
                currentView === link.view ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </a>
          ))}
        </div>

        {/* Desktop Icon Controls (Search, User, Cart) */}
        <div className="hidden lg:flex items-center space-x-6 text-zinc-300">
          {/* Search Button */}
          <button
            onClick={() => setView('products')}
            className="hover:text-amber-400 transition-colors duration-300 cursor-pointer focus:outline-none"
            aria-label="Search Catalog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* User Profile Button */}
          {user ? (
            <div className="relative group flex items-center">
              <button
                className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black flex items-center justify-center text-[10px] font-bold transition-all duration-300 cursor-pointer focus:outline-none uppercase font-mono"
                aria-label="User Account Options"
              >
                {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
              </button>
              {/* Dropdown Menu on hover */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-950/95 border border-white/10 shadow-2xl py-2 rounded-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-xs">
                <div className="px-4 py-2 border-b border-white/5 text-[9px] uppercase font-mono tracking-widest text-zinc-500">
                  Welcome, {profile?.full_name || 'Terroir User'}
                </div>
                <button
                  onClick={() => { setView('profile'); }}
                  className="w-full text-left px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-white/5 transition-all focus:outline-none cursor-pointer text-xs"
                >
                  My Profile
                </button>
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => { setView('admin'); }}
                    className="w-full text-left px-4 py-2 text-zinc-300 hover:text-amber-400 hover:bg-white/5 transition-all focus:outline-none cursor-pointer text-xs"
                  >
                    Curator Workspace
                  </button>
                )}
                <button
                  onClick={async () => {
                    await logout();
                    setView('home');
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all focus:outline-none cursor-pointer text-xs"
                >
                  Logout Session
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-amber-400 transition-colors duration-300 cursor-pointer focus:outline-none ${
                currentView === 'login' ? 'text-amber-400' : ''
              }`}
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}

          {/* Cart Icon with Item Count */}
          <button
            onClick={() => setView('cart')}
            className={`relative hover:text-amber-400 transition-colors duration-300 cursor-pointer focus:outline-none ${
              currentView === 'cart' ? 'text-amber-400' : ''
            }`}
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center space-x-4">
          {/* Compact Cart Icon for Mobile Navigation bar */}
          <button
            onClick={() => setView('cart')}
            className="relative text-white hover:text-amber-400 transition-colors duration-300 mr-2 cursor-pointer focus:outline-none"
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-amber-400 focus:outline-none p-2 transition-colors duration-300 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative">
              <span
                className={`w-6 h-[1.5px] bg-current absolute transition-all duration-300 ease-in-out ${
                  isOpen ? 'rotate-45' : '-translate-y-2'
                }`}
              ></span>
              <span
                className={`w-6 h-[1.5px] bg-current absolute transition-all duration-300 ease-in-out ${
                  isOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-6 h-[1.5px] bg-current absolute transition-all duration-300 ease-in-out ${
                  isOpen ? '-rotate-45' : 'translate-y-2'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-white/10 transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex flex-col space-y-6 px-8 items-center text-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={`#${link.view}`}
              onClick={(e) => handleNavLinkClick(e, link.view)}
              className={`text-sm tracking-[0.2em] uppercase font-semibold py-1 w-full border-b border-white/5 hover:border-amber-500/20 transition-all duration-300 ${
                currentView === link.view ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile Utility Controls (Search & User shortcuts inside mobile dropdown) */}
          <div className="flex flex-col space-y-4 w-full pt-4 border-t border-white/10 items-center">
            {/* Search and User Profile trigger row */}
            <div className="flex justify-center items-center space-x-12 w-full">
              {/* Search */}
              <button
                onClick={() => { setIsOpen(false); setView('products'); }}
                className="text-zinc-300 hover:text-amber-400 flex items-center space-x-2 transition-colors duration-300 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs uppercase tracking-[0.1em] font-semibold">Search</span>
              </button>
              
              {/* Account/Profile */}
              {user ? (
                <div className="flex items-center space-x-2 text-zinc-300">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center text-[10px] font-bold uppercase font-mono">
                    {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}
                  </div>
                  <span className="text-xs uppercase tracking-[0.1em] font-semibold font-mono text-zinc-400">
                    {profile?.full_name ? profile.full_name.split(' ')[0] : 'User'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => { setIsOpen(false); setView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`hover:text-amber-400 flex items-center space-x-2 transition-colors duration-300 cursor-pointer focus:outline-none ${
                    currentView === 'login' ? 'text-amber-400' : 'text-zinc-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs uppercase tracking-[0.1em] font-semibold">Profile</span>
                </button>
              )}
            </div>

            {/* Session Action Buttons when Logged In */}
            {user && (
              <div className="flex flex-col space-y-3 w-full max-w-[240px] pt-2">
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => { setIsOpen(false); setView('admin'); }}
                    className="w-full py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-300 focus:outline-none cursor-pointer text-xs uppercase tracking-[0.1em] font-semibold"
                  >
                    Curator Workspace
                  </button>
                )}
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await logout();
                    setView('home');
                  }}
                  className="w-full py-2 bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 focus:outline-none cursor-pointer text-xs uppercase tracking-[0.1em] font-semibold"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
