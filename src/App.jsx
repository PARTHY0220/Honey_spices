import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Products from './components/Products.jsx';
import AboutSection from './components/AboutSection.jsx';
import Testimonials from './components/Testimonials.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';

import CartView from './components/CartView.jsx';
import CheckoutView from './components/CheckoutView.jsx';
import SuccessView from './components/SuccessView.jsx';
import LoginView from './components/LoginView.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

function App() {
  const [view, setView] = useState('home'); // 'home', 'products', 'cart', 'checkout', 'success'
  const [cart, setCart] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState(null);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Open Cart page for immediate user confirmation
    setView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const onCheckoutSuccess = () => {
    setCart([]); // Clear the ledger order
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Global Smoke Clouds generated once
  const globalSmokeClouds = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const startX = Math.random() * 80 + 10;
      const scale = Math.random() * 0.8 + 1.0;
      const duration = Math.random() * 15 + 25;
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.05 + 0.05; // very subtle 5% to 10%
      return { id: i, startX, scale, duration, delay, opacity };
    });
  }, []);

  // Bypass storefront and render Admin Dashboard
  if (view === 'admin') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="admin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <AdminDashboard setView={setView} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-[#0B0B0B] text-zinc-100 min-h-screen font-sans selection:bg-amber-500/30 selection:text-white overflow-x-hidden flex flex-col justify-between relative">
      
      {/* 1. Global Drifting Colored Shadows & Smoke (Z-0 background) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        
        {/* Turmeric Cloud (Bottom-Left) */}
        <motion.div
          animate={{
            x: [0, 45, -20, 0],
            y: [0, -35, 20, 0],
            scale: [1, 1.18, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full filter blur-[120px] opacity-[0.16]"
          style={{
            background: 'radial-gradient(circle, #F5C518 0%, rgba(245, 197, 24, 0) 70%)',
          }}
        />

        {/* Chili Cloud (Top-Right) */}
        <motion.div
          animate={{
            x: [0, -50, 15, 0],
            y: [0, 35, -15, 0],
            scale: [1, 1.12, 0.9, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-15%] right-[-15%] w-[65vw] h-[65vw] rounded-full filter blur-[120px] opacity-[0.11]"
          style={{
            background: 'radial-gradient(circle, #FF3B30 0%, rgba(255, 59, 48, 0) 70%)',
          }}
        />

        {/* Cinnamon Cloud (Center Background) */}
        <motion.div
          animate={{
            x: [0, 25, -25, 0],
            y: [0, 30, -30, 0],
            scale: [0.95, 1.05, 0.95],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[25%] left-[25%] w-[65vw] h-[65vw] rounded-full filter blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #C68B59 0%, rgba(198, 139, 89, 0) 70%)',
          }}
        />

        {/* Rising Smoke Mist waves */}
        {globalSmokeClouds.map((s) => (
          <motion.div
            key={`global-smoke-${s.id}`}
            initial={{
              x: `${s.startX}vw`,
              y: '105vh',
              opacity: 0,
              scale: s.scale,
            }}
            animate={{
              x: [`${s.startX}vw`, `${s.startX + (s.id % 2 === 0 ? 5 : -5)}vw`, `${s.startX}vw`],
              y: '-25vh',
              opacity: [0, s.opacity, s.opacity * 1.25, 0],
              scale: [s.scale, s.scale * 1.25, s.scale * 0.9],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full filter blur-[100px]"
            style={{
              width: '35vw',
              height: '35vw',
              background: 'radial-gradient(circle, rgba(213, 160, 112, 0.18) 0%, rgba(213, 160, 112, 0.03) 50%, rgba(253, 251, 247, 0) 70%)',
            }}
          />
        ))}

      </div>

      {/* 2. Global Views Container (Z-10 content) */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <div>
          {/* Core Premium Header */}
          <Navbar setView={setView} currentView={view} cartCount={cartCount} />

          {/* View Transitions using Framer Motion AnimatePresence */}
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Hero setView={setView} />
              </motion.div>
            )}

            {view === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Products onProductClick={setSelectedSpice} onAddToCart={addToCart} showFilters={true} setView={setView} />
              </motion.div>
            )}



            {view === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <AboutSection />
                <Testimonials />
              </motion.div>
            )}

            {view === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <ContactSection />
              </motion.div>
            )}

            {view === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <CartView
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                  setView={setView}
                />
              </motion.div>
            )}

            {view === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <CheckoutView cart={cart} onCheckoutSuccess={onCheckoutSuccess} setView={setView} />
              </motion.div>
            )}

            {view === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SuccessView setView={setView} />
              </motion.div>
            )}

            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <LoginView setView={setView} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Product Details overlay drawer modal */}
          {selectedSpice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
              <div className="bg-[#161616]/90 border border-white/10 p-8 sm:p-10 max-w-md w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-scale-up backdrop-blur-md">
                <button
                  onClick={() => setSelectedSpice(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-amber-400 text-lg transition-colors duration-300 cursor-pointer focus:outline-none"
                  aria-label="Close Modal"
                >
                  ✕
                </button>
                <div className="w-full h-[180px] mb-6 overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={selectedSpice.image}
                    alt={selectedSpice.name}
                    className="w-full h-full object-cover filter brightness-90"
                  />
                </div>
                <span className="text-[10px] tracking-wider uppercase text-amber-400 font-mono mb-2 block">
                  {selectedSpice.origin}
                </span>
                <h3 className="text-2xl font-serif text-white tracking-wide mb-1">{selectedSpice.name}</h3>
                <p className="text-xs text-zinc-400 italic mb-6">{selectedSpice.scientificName}</p>
                
                <p className="text-zinc-300 text-sm tracking-wide leading-relaxed font-light mb-8">
                  {selectedSpice.description}
                </p>
                
                <div className="flex justify-between items-center mb-8 bg-neutral-900/60 p-4 border border-white/10">
                  <span className="text-xs uppercase tracking-wider text-zinc-400">Reserve Price</span>
                  <span className="text-amber-400 font-serif text-lg font-bold">{selectedSpice.price}</span>
                </div>
                
                <button
                  onClick={() => {
                    addToCart(selectedSpice);
                    setSelectedSpice(null);
                  }}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer focus:outline-none"
                >
                  Add To Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Render Footer globally except during direct funnel actions */}
        {(view === 'home' || view === 'products' || view === 'about' || view === 'contact' || view === 'cart' || view === 'login') && (
          <Footer setView={setView} />
        )}
      </div>
    </div>
  );
}

export default App;
