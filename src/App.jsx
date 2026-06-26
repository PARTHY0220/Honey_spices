import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext.jsx';
import turmericImg from './assets/turmeric_jar.webp';
import garamMasalaImg from './assets/garam_masala_jar.webp';
import { initialProducts } from './components/admin/mockData';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';

const Products = React.lazy(() => import('./components/Products.jsx'));
const AboutSection = React.lazy(() => import('./components/AboutSection.jsx'));
const Testimonials = React.lazy(() => import('./components/Testimonials.jsx'));
const ContactSection = React.lazy(() => import('./components/ContactSection.jsx'));
const CartView = React.lazy(() => import('./components/CartView.jsx'));
const CheckoutView = React.lazy(() => import('./components/CheckoutView.jsx'));
const SuccessView = React.lazy(() => import('./components/SuccessView.jsx'));
const LoginView = React.lazy(() => import('./components/LoginView.jsx'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard.jsx'));

// Global Smoke Clouds generated once
const GLOBAL_SMOKE_CLOUDS = Array.from({ length: 4 }).map((_, i) => {
  const startX = Math.random() * 80 + 10;
  const scale = Math.random() * 0.8 + 1.0;
  const duration = Math.random() * 15 + 25;
  const delay = Math.random() * 15;
  const opacity = Math.random() * 0.05 + 0.05; // very subtle 5% to 10%
  return { id: i, startX, scale, duration, delay, opacity };
});

const getProductImage = (url, category) => {
  if (url) return url;
  if (category === 'blends') return garamMasalaImg;
  if (category === 'honey-elixirs') return turmericImg;
  return turmericImg;
};

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('home'); // 'home', 'products', 'cart', 'checkout', 'success'
  const [cart, setCart] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const guestCartRef = useRef([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setProducts(initialProducts);
        } else {
          const mapped = data.map((p) => ({
            id: p.id,
            name: p.name,
            scientificName: p.scientific_name || 'Artisanal Selection',
            price: `₹${new Intl.NumberFormat('en-IN').format(p.price)}`,
            priceNum: parseFloat(p.price),
            rating: 5.0,
            reviews: 0,
            origin: p.tag || 'Curator Vault',
            image: getProductImage(p.image_url, p.category),
            category: p.category,
            description: p.description || 'Rare organic batch, slow-cured and certified.',
            tag: p.tag || 'Reserve Selection',
            stock: p.stock,
            featured: p.featured,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        if (err.message === 'Supabase is not configured') {
          console.log('Supabase client is not configured; using offline mock products catalog.');
        } else {
          console.error('Error fetching products:', err.message);
        }
        setProducts(initialProducts);
      } finally {
        setProductsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const loadCart = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', userId);
      if (error) throw error;
      
      const loadedCart = (data || []).map(item => {
        const p = item.products;
        return {
          id: p.id,
          name: p.name,
          scientificName: p.scientific_name || 'Artisanal Selection',
          price: `₹${new Intl.NumberFormat('en-IN').format(p.price)}`,
          priceNum: parseFloat(p.price),
          image: getProductImage(p.image_url, p.category),
          category: p.category,
          origin: p.tag || 'Curator Vault',
          quantity: item.quantity
        };
      });
      setCart(loadedCart);
    } catch (err) {
      console.error('Error loading cart:', err.message);
    }
  };

  // Keep track of guest cart items in Ref
  useEffect(() => {
    if (!user) {
      guestCartRef.current = cart;
    }
  }, [cart, user]);

  // Sync / merge cart when user session starts
  useEffect(() => {
    if (user) {
      const mergeCart = async () => {
        const guestCart = guestCartRef.current;
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            try {
              const { data: existing } = await supabase
                .from('cart')
                .select('id, quantity')
                .eq('user_id', user.id)
                .eq('product_id', item.id)
                .maybeSingle();

              if (existing) {
                await supabase
                  .from('cart')
                  .update({ quantity: existing.quantity + item.quantity })
                  .eq('id', existing.id);
              } else {
                await supabase
                  .from('cart')
                  .insert({ user_id: user.id, product_id: item.id, quantity: item.quantity });
              }
            } catch (err) {
              console.error('Error merging cart item:', err);
            }
          }
          guestCartRef.current = [];
        }
        await loadCart(user.id);
      };
      mergeCart();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart([]);
    }
  }, [user]);

  // Cart operations
  const addToCart = async (product) => {
    if (user) {
      try {
        const { data: existing } = await supabase
          .from('cart')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('cart')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart')
            .insert({ user_id: user.id, product_id: product.id, quantity: 1 });
          if (error) throw error;
        }
        await loadCart(user.id);
        addToast(`${product.name} added to order`, 'success');
      } catch (err) {
        addToast(err.message || 'Error updating cart in database', 'error');
      }
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
      addToast(`${product.name} added to order`, 'success');
    }
    setView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    if (user) {
      try {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        await loadCart(user.id);
      } catch (err) {
        addToast(err.message || 'Error updating quantity in database', 'error');
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        await loadCart(user.id);
        addToast('Item removed from cart', 'success');
      } catch (err) {
        addToast(err.message || 'Error removing item from database', 'error');
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      addToast('Item removed from cart', 'success');
    }
  };

  const onCheckoutSuccess = () => {
    // If logged in, the cart table will be cleared during order creation in CheckoutView.jsx
    setCart([]); 
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Force login before allowing any interaction
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#0B0B0B] text-zinc-100 min-h-screen font-sans selection:bg-amber-500/30 selection:text-white overflow-x-hidden flex flex-col justify-center items-center relative">
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
            className="absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full filter blur-[45px] opacity-[0.16]"
            style={{
              background: 'radial-gradient(circle, #F5C518 0%, rgba(245, 197, 24, 0) 70%)',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
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
            className="absolute top-[-15%] right-[-15%] w-[65vw] h-[65vw] rounded-full filter blur-[45px] opacity-[0.11]"
            style={{
              background: 'radial-gradient(circle, #FF3B30 0%, rgba(255, 59, 48, 0) 70%)',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
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
            className="absolute top-[25%] left-[25%] w-[65vw] h-[65vw] rounded-full filter blur-[45px]"
            style={{
              background: 'radial-gradient(circle, #C68B59 0%, rgba(198, 139, 89, 0) 70%)',
              willChange: 'transform, opacity',
              transform: 'translate3d(0,0,0)',
            }}
          />

          {/* Rising Smoke Mist waves */}
          {GLOBAL_SMOKE_CLOUDS.map((s) => (
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
              className="absolute rounded-full filter blur-[30px]"
              style={{
                width: '35vw',
                height: '35vw',
                background: 'radial-gradient(circle, rgba(213, 160, 112, 0.18) 0%, rgba(213, 160, 112, 0.03) 50%, rgba(253, 251, 247, 0) 70%)',
                willChange: 'transform, opacity',
                transform: 'translate3d(0,0,0)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full flex items-center justify-center">
          <Suspense fallback={<div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" />}>
            <LoginView setView={setView} addToast={addToast} />
          </Suspense>
        </div>

        {/* Global Toast notifications container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                className={`p-4 border shadow-2xl flex items-center justify-between gap-3 text-xs font-mono pointer-events-auto backdrop-blur-lg ${
                  t.type === 'error'
                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                    : t.type === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    t.type === 'error' ? 'bg-red-500 animate-pulse' : t.type === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-amber-500 animate-pulse'
                  }`} />
                  <span>{t.message}</span>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Bypass storefront and render Admin Dashboard
  if (view === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center"><div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" /></div>}>
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
      </Suspense>
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
          className="absolute bottom-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full filter blur-[45px] opacity-[0.16]"
          style={{
            background: 'radial-gradient(circle, #F5C518 0%, rgba(245, 197, 24, 0) 70%)',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
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
          className="absolute top-[-15%] right-[-15%] w-[65vw] h-[65vw] rounded-full filter blur-[45px] opacity-[0.11]"
          style={{
            background: 'radial-gradient(circle, #FF3B30 0%, rgba(255, 59, 48, 0) 70%)',
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
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
          className="absolute top-[25%] left-[25%] w-[65vw] h-[65vw] rounded-full filter blur-[45px]"
          style={{
            background: 'radial-gradient(circle, #C68B59 0%, rgba(198, 139, 89, 0) 70%)',
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
          }}
        />

        {/* Rising Smoke Mist waves */}
        {GLOBAL_SMOKE_CLOUDS.map((s) => (
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
            className="absolute rounded-full filter blur-[30px]"
            style={{
              width: '35vw',
              height: '35vw',
              background: 'radial-gradient(circle, rgba(213, 160, 112, 0.18) 0%, rgba(213, 160, 112, 0.03) 50%, rgba(253, 251, 247, 0) 70%)',
              willChange: 'transform, opacity',
              transform: 'translate3d(0,0,0)',
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
          <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" />
            </div>
          }>
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
                  <Products products={products} productsLoading={productsLoading} onProductClick={setSelectedSpice} onAddToCart={addToCart} showFilters={false} setView={setView} />
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
                  <Products products={products} productsLoading={productsLoading} onProductClick={setSelectedSpice} onAddToCart={addToCart} showFilters={true} setView={setView} />
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
                  <ContactSection addToast={addToast} />
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
                  <CheckoutView cart={cart} onCheckoutSuccess={onCheckoutSuccess} setView={setView} addToast={addToast} />
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
                  <LoginView setView={setView} addToast={addToast} />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>

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
                    decoding="async"
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

      {/* Global Toast notifications container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 18, stiffness: 200 }}
              className={`p-4 border shadow-2xl flex items-center justify-between gap-3 text-xs font-mono pointer-events-auto backdrop-blur-lg ${
                t.type === 'error'
                  ? 'bg-red-500/10 border-red-500/25 text-red-400'
                  : t.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                  : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  t.type === 'error' ? 'bg-red-500 animate-pulse' : t.type === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-amber-500 animate-pulse'
                }`} />
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
