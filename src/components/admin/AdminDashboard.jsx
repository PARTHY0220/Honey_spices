import { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  X,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

import { 
  initialSettings
} from './mockData';

// Import sub-views using dynamic lazy imports
const DashboardView = lazy(() => import('./DashboardView'));
const OrdersView = lazy(() => import('./OrdersView'));
const ProductsView = lazy(() => import('./ProductsView'));
const CustomersView = lazy(() => import('./CustomersView'));
const PaymentsView = lazy(() => import('./PaymentsView'));
const MessagesView = lazy(() => import('./MessagesView'));
const AnalyticsView = lazy(() => import('./AnalyticsView'));
const SettingsView = lazy(() => import('./SettingsView'));

const generateToastId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 5);
};

const generateUniqueFileName = (fileExt) => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
};

const AdminDashboard = ({ setView }) => {
  // Theme and UI layout state
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Popovers state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Core reactive data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(initialSettings);

  // Animated Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = generateToastId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        setProducts([]);
      } else {
        setProducts((data || []).map(p => ({
          id: p.id,
          name: p.name,
          scientificName: p.scientific_name || 'Artisanal Selection',
          price: `₹${new Intl.NumberFormat('en-IN').format(p.price)}`,
          priceNum: parseFloat(p.price),
          rating: 5.0,
          reviews: 0,
          origin: p.tag || 'Curator Vault',
          image: p.image_url || null,
          category: p.category,
          description: p.description,
          tag: p.tag || 'Reserve Selection',
          stock: p.stock,
          status: p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock'
        })));
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setProducts([]);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (*),
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      let mappedOrders = [];
      if (data && data.length > 0) {
        mappedOrders = (data || []).map(o => {
          const profile = o.profiles || {};
          const items = (o.order_items || []).map(item => {
            const p = item.products || {};
            return {
              id: item.product_id,
              name: p.name || 'Unknown product',
              quantity: item.quantity,
              price: parseFloat(item.price)
            };
          });
          
          return {
            id: o.id,
            customerName: profile.full_name || 'Guest User',
            email: profile.email || '',
            phone: profile.phone || '',
            address: o.shipping_address || '',
            products: items,
            amount: parseFloat(o.total_amount),
            paymentStatus: o.payment_status,
            orderStatus: o.order_status,
            paymentMethod: o.payment_method,
            date: o.created_at
          };
        });
      }

      // Read local orders from localStorage and prepend them
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      setOrders([...localOrders, ...mappedOrders]);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      setOrders(localOrders);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');
      if (profileError) throw profileError;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, total_amount, order_status');
      if (ordersError) throw ordersError;

      const mappedCustomers = (profiles || []).map(p => {
        const userOrders = (ordersData || []).filter(o => o.user_id === p.id && o.order_status !== 'Cancelled');
        const totalSpending = userOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
        return {
          id: p.id,
          name: p.full_name,
          email: p.email,
          phone: p.phone || 'N/A',
          totalOrders: userOrders.length,
          totalSpending: totalSpending,
          joinDate: p.created_at
        };
      });
      setCustomers(mappedCustomers);
    } catch (err) {
      console.error('Error fetching admin customers:', err);
      setCustomers([]);
    }
  };

  const fetchAllMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setMessages([]);
      } else {
        setMessages((data || []).map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || 'N/A',
          message: m.message,
          date: m.created_at,
          replied: m.replied,
          replyText: m.reply_text || ''
        })));
      }
    } catch (err) {
      console.error('Error fetching admin messages:', err);
      setMessages([]);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchAllProducts(),
      fetchAllOrders(),
      fetchAllCustomers(),
      fetchAllMessages()
    ]);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payments = useMemo(() => {
    return orders.map(o => ({
      id: `PAY-${o.id.substring(0, 6).toUpperCase()}`,
      orderId: o.id,
      customerName: o.customerName,
      amount: o.amount,
      status: o.paymentStatus === 'Paid' ? 'Success' : o.paymentStatus === 'Pending' ? 'Pending' : 'Failed',
      method: o.paymentMethod || 'UPI',
      date: o.date
    }));
  }, [orders]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K to focus search or toggle sidebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Notifications list dynamically
  const alertsList = useMemo(() => {
    const alerts = [];
    
    // Low stock warnings
    products.forEach(p => {
      if (p.stock === 0) {
        alerts.push({
          id: `stock-empty-${p.id}`,
          type: 'danger',
          title: 'Stock Depleted!',
          message: `${p.name} is currently out of stock.`,
          icon: AlertTriangle
        });
      } else if (p.stock <= 10) {
        alerts.push({
          id: `stock-low-${p.id}`,
          type: 'warning',
          title: 'Low Stock Warning',
          message: `${p.name} has only ${p.stock} units left.`,
          icon: AlertTriangle
        });
      }
    });

    // Unread messages
    messages.filter(m => !m.replied).forEach(m => {
      alerts.push({
        id: `msg-${m.id}`,
        type: 'info',
        title: 'New Concierge Inquiry',
        message: `From ${m.name}: "${m.message.slice(0, 30)}..."`,
        icon: MessageCircle
      });
    });

    // Pending orders
    orders.filter(o => o.orderStatus === 'Pending').forEach(o => {
      alerts.push({
        id: `order-${o.id}`,
        type: 'success',
        title: 'Pending Spice Confirmation',
        message: `Order ${o.id.substring(0, 8)} requires validation (Amount: ₹${o.amount})`,
        icon: ShoppingBag
      });
    });

    return alerts;
  }, [products, messages, orders]);

  // Reactive Handlers
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      let pStatus = 'Pending';
      if (newStatus === 'Delivered') pStatus = 'Paid';
      if (newStatus === 'Cancelled') pStatus = 'Failed';

      if (typeof orderId === 'string' && orderId.startsWith('ORD-')) {
        // Handle local mock order update
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        const updatedLocal = localOrders.map(o => {
          if (o.id === orderId) {
            return { ...o, orderStatus: newStatus, paymentStatus: pStatus };
          }
          return o;
        });
        localStorage.setItem('local_orders', JSON.stringify(updatedLocal));
        addToast(`Local order status updated to ${newStatus}`, 'success');
        await fetchAllOrders();
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          order_status: newStatus,
          payment_status: pStatus
        })
        .eq('id', orderId);

      if (error) throw error;
      
      addToast(`Order status updated to ${newStatus}`, 'success');
      await fetchAllOrders();
      await fetchAllCustomers();
    } catch (err) {
      addToast(err.message || 'Error updating order status', 'error');
    }
  };

  const addProduct = async (newProdFields, imageFile) => {
    try {
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = generateUniqueFileName(fileExt);
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }
      
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProdFields.name,
          scientific_name: newProdFields.scientificName,
          price: parseFloat(newProdFields.priceNum),
          category: newProdFields.category,
          description: newProdFields.description,
          tag: newProdFields.tag,
          stock: parseInt(newProdFields.stock),
          image_url: imageUrl
        });
        
      if (error) throw error;
      
      addToast(`${newProdFields.name} successfully added to inventory`, 'success');
      await fetchAllProducts();
    } catch (err) {
      addToast(err.message || 'Error adding product', 'error');
    }
  };

  const editProduct = async (prodId, updatedFields, imageFile) => {
    try {
      let imageUrl = updatedFields.image; // default to old image
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = generateUniqueFileName(fileExt);
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }
      
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedFields.name,
          scientific_name: updatedFields.scientificName,
          price: parseFloat(updatedFields.priceNum),
          category: updatedFields.category,
          description: updatedFields.description,
          tag: updatedFields.tag,
          stock: parseInt(updatedFields.stock),
          image_url: imageUrl
        })
        .eq('id', prodId);
        
      if (error) throw error;
      
      addToast(`${updatedFields.name} updated successfully`, 'success');
      await fetchAllProducts();
    } catch (err) {
      addToast(err.message || 'Error updating product', 'error');
    }
  };

  const deleteProduct = async (prodId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', prodId);
      if (error) throw error;
      
      addToast('Spice reserve removed from catalog', 'success');
      await fetchAllProducts();
    } catch (err) {
      addToast(err.message || 'Error deleting product', 'error');
    }
  };

  const replyToMessage = async (msgId, text) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ replied: true, reply_text: text })
        .eq('id', msgId);
      if (error) throw error;
      
      addToast('Reply sent to concierge logs', 'success');
      await fetchAllMessages();
    } catch (err) {
      addToast(err.message || 'Error saving reply', 'error');
    }
  };

  // Sidebar Links
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.orderStatus === 'Pending').length },
    { id: 'products', label: 'Products', icon: Package, badge: products.filter(p => p.stock <= 10).length },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare, badge: messages.filter(m => !m.replied).length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];


  // Render Sub-Views
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            orders={orders} 
            products={products} 
            customers={customers} 
            setViewTab={setActiveTab}
            updateOrderStatus={updateOrderStatus}
          />
        );
      case 'orders':
        return (
          <OrdersView 
            orders={orders} 
            updateOrderStatus={updateOrderStatus} 
            addToast={addToast} 
          />
        );
      case 'products':
        return (
          <ProductsView 
            products={products} 
            addProduct={addProduct} 
            editProduct={editProduct} 
            deleteProduct={deleteProduct} 
            addToast={addToast}
          />
        );
      case 'customers':
        return <CustomersView customers={customers} />;
      case 'payments':
        return <PaymentsView payments={payments} />;
      case 'messages':
        return (
          <MessagesView 
            messages={messages} 
            replyToMessage={replyToMessage} 
            addToast={addToast} 
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            orders={orders} 
            products={products} 
            customers={customers} 
          />
        );
      case 'settings':
        return (
          <SettingsView 
            settings={settings} 
            saveSettings={setSettings} 
            addToast={addToast} 
          />
        );
      default:
        return <DashboardView orders={orders} products={products} customers={customers} setViewTab={setActiveTab} />;
    }
  };

  return (
    <div className={darkMode ? 'dark text-zinc-150' : 'text-stone-800'}>
      {/* Container holding layout */}
      <div className="min-h-screen transition-colors duration-500 bg-[#FAF8F5] dark:bg-[#0C0C0B] flex relative overflow-hidden font-sans">
        
        {/* LIGHT/DARK COLOR GRADIENTS */}
        {darkMode ? (
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            {/* Amber glowing shadow on dark */}
            <div 
              className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full filter blur-[150px] opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #F5C518 0%, rgba(245, 197, 24, 0) 70%)' }}
            />
            <div 
              className="absolute bottom-[-10%] right-[10%] w-[45vw] h-[45vw] rounded-full filter blur-[150px] opacity-[0.04]"
              style={{ background: 'radial-gradient(circle, #D97706 0%, rgba(217, 119, 6, 0) 70%)' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            {/* Warm soft cream highlight */}
            <div 
              className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full filter blur-[120px] opacity-[0.4]"
              style={{ background: 'radial-gradient(circle, #F5EFEB 0%, rgba(245, 239, 235, 0) 80%)' }}
            />
          </div>
        )}

        {/* 1. SIDEBAR (DESKTOP COLLAPSIBLE) */}
        <aside 
          className={`hidden lg:flex flex-col z-20 transition-all duration-300 relative border-r bg-white/70 dark:bg-[#11100E]/70 backdrop-blur-xl border-stone-200/60 dark:border-white/5 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Title Header */}
          <div className="p-6 flex items-center justify-between border-b border-stone-200/50 dark:border-white/5">
            <button
              onClick={() => { setView('home'); }}
              className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/30 flex-shrink-0 bg-neutral-900 shadow-md">
                <img src={settings.profile.avatar} alt="logo" className="w-full h-full object-cover" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-[11px] font-serif font-bold text-stone-900 dark:text-white tracking-[0.15em] group-hover:text-amber-500 transition-colors">
                    L'ÉPICE ADMIN
                  </span>
                  <span className="text-[7px] tracking-widest text-amber-600 dark:text-amber-500 font-bold -mt-0.5">CURATOR COMMAND</span>
                </div>
              )}
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="flex-grow py-6 px-3 space-y-1.5 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-3 px-3.5 py-3 text-xs tracking-wider uppercase font-mono transition-all rounded-lg w-full text-left relative group cursor-pointer focus:outline-none ${
                    active 
                      ? 'bg-amber-500 text-black font-semibold shadow-[0_4px_12px_rgba(245,158,11,0.15)]'
                      : 'text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-neutral-900/40 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-grow truncate">{link.label}</span>
                  )}
                  {!sidebarCollapsed && link.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                      active ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                  {sidebarCollapsed && link.badge > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapsible toggle & Logout */}
          <div className="p-4 border-t border-stone-200/50 dark:border-white/5 space-y-2">
            {/* Toggle collapse */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg bg-stone-100/50 dark:bg-neutral-900/40 border border-stone-200/30 dark:border-white/5 hover:bg-stone-100 dark:hover:bg-neutral-900 text-stone-500 dark:text-zinc-400 w-full cursor-pointer focus:outline-none"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Logout */}
            <button
              onClick={() => { setView('home'); }}
              className="flex items-center gap-3 px-3.5 py-3 text-xs tracking-wider uppercase font-mono text-red-500 hover:bg-red-500/10 rounded-lg w-full text-left cursor-pointer focus:outline-none"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>Storefront Exit</span>}
            </button>
          </div>
        </aside>

        {/* 2. MOBILE DRAWER SIDEBAR */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Overlay background */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              {/* Drawer panel */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-40 w-64 bg-stone-50 dark:bg-[#11100E] border-r border-stone-200 dark:border-white/5 flex flex-col lg:hidden"
              >
                <div className="p-6 flex items-center justify-between border-b border-stone-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/30 bg-neutral-900">
                      <img src={settings.profile.avatar} alt="logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-serif font-bold text-stone-900 dark:text-white tracking-[0.15em]">
                        L'ÉPICE ADMIN
                      </span>
                      <span className="text-[7px] tracking-widest text-amber-500 font-bold -mt-0.5">CURATOR CONTROL</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="text-stone-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-grow py-6 px-3 space-y-1.5 overflow-y-auto">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const active = activeTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => { setActiveTab(link.id); setMobileSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-3.5 py-3 text-xs tracking-wider uppercase font-mono transition-all rounded-lg w-full text-left cursor-pointer focus:outline-none ${
                          active 
                            ? 'bg-amber-500 text-black font-semibold'
                            : 'text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-neutral-900/40 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-grow truncate">{link.label}</span>
                        {link.badge > 0 && (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                            active ? 'bg-black text-amber-500' : 'bg-amber-500 text-black'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-stone-200 dark:border-white/5">
                  <button
                    onClick={() => { setView('home'); }}
                    className="flex items-center gap-3 px-3.5 py-3 text-xs tracking-wider uppercase font-mono text-red-500 hover:bg-red-500/10 rounded-lg w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Storefront Exit</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN DISPLAY WORKSPACE */}
        <div className="flex-grow flex flex-col min-w-0 z-10">
          
          {/* TOP TOOLBAR NAVBAR */}
          <header className="h-16 border-b bg-white/60 dark:bg-[#0E0E0D]/60 backdrop-blur-xl border-stone-200/60 dark:border-white/5 px-6 flex justify-between items-center relative z-25">
            {/* Left toolbar: Hamburger, Search */}
            <div className="flex items-center gap-4 flex-grow max-w-md">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-stone-500 dark:text-zinc-400 hover:text-amber-500 cursor-pointer focus:outline-none p-1"
              >
                <Menu className="w-5.5 h-5.5" />
              </button>
              
              {/* Search triggers products view search */}
              <div className="relative w-full hidden sm:block">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 dark:text-zinc-550" />
                <input
                  type="text"
                  placeholder="Universal catalog search... (Ctrl+B sidebar)"
                  onClick={() => { if (activeTab !== 'products') setActiveTab('products'); }}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[11px] text-stone-900 dark:text-white rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Right toolbar: Theme, Alerts, Profile */}
            <div className="flex items-center gap-4 text-stone-500 dark:text-zinc-400">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Toggle Light Cream Mode" : "Toggle Charcoal Dark Mode"}
                className="p-2 rounded-lg bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer focus:outline-none"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Alert Center Trigger */}
              <div className="relative">
                <button
                  onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                  title="Alert notifications center"
                  className={`p-2 rounded-lg bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer focus:outline-none ${
                    alertsList.length > 0 ? 'text-amber-500' : ''
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {alertsList.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[8px] font-bold font-mono rounded-full flex items-center justify-center border border-white dark:border-[#0C0C0B]">
                      {alertsList.length}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown menu */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-80 bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 shadow-2xl z-40 rounded-xl overflow-hidden text-xs"
                      >
                        <div className="p-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center">
                          <span className="font-serif font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[10px]">Alert Center</span>
                          <span className="text-[9px] font-mono text-zinc-500">Live Diagnostics</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto divide-y divide-stone-200/50 dark:divide-white/5">
                          {alertsList.length > 0 ? (
                            alertsList.map((a) => {
                              const AlertIcon = a.icon;
                              return (
                                <div 
                                  key={a.id} 
                                  onClick={() => {
                                    if (a.id.includes('stock')) setActiveTab('products');
                                    if (a.id.includes('msg')) setActiveTab('messages');
                                    if (a.id.includes('order')) setActiveTab('orders');
                                    setNotificationsOpen(false);
                                  }}
                                  className="p-3.5 hover:bg-stone-100/55 dark:hover:bg-neutral-850/30 flex items-start gap-2.5 transition-colors cursor-pointer"
                                >
                                  <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                                    a.type === 'danger' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                    a.type === 'warning' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20' : 
                                    a.type === 'info' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  }`}>
                                    <AlertIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-stone-950 dark:text-white text-[11px] leading-tight">{a.title}</h4>
                                    <p className="text-[10px] text-stone-500 dark:text-zinc-450 mt-1 leading-normal font-light">{a.message}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-8 text-center text-zinc-550 font-mono text-[10px]">
                              System diagnostics optimal. No flags.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Avatar & dropdown menu */}
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                  className="flex items-center gap-2.5 pl-2 border-l border-stone-200 dark:border-white/10 text-left cursor-pointer focus:outline-none"
                >
                  <div className="w-7.5 h-7.5 rounded-full overflow-hidden border border-stone-300 dark:border-white/10 bg-neutral-900 shadow-inner">
                    <img src={settings.profile.avatar} alt="Admin" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-[11px] font-semibold text-stone-900 dark:text-white leading-tight font-serif">
                      {settings.profile.name}
                    </span>
                    <span className="text-[8px] text-stone-400 dark:text-zinc-550 uppercase tracking-widest font-mono">
                      Curator
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 shadow-2xl z-40 rounded-xl overflow-hidden text-xs text-stone-700 dark:text-stone-300"
                      >
                        <div className="p-4 border-b border-stone-200 dark:border-white/5 bg-stone-100/30 dark:bg-neutral-950/20">
                          <p className="font-semibold text-stone-950 dark:text-white">{settings.profile.name}</p>
                          <p className="text-[10px] text-stone-400 dark:text-zinc-550 font-mono mt-0.5">{settings.profile.email}</p>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                          <button
                            onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-stone-100 dark:hover:bg-neutral-900/60 rounded text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer focus:outline-none"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            Curator Settings
                          </button>
                          <button
                            onClick={() => { setView('home'); }}
                            className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer focus:outline-none"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Storefront Exit
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* MAIN PAGE VIEWPORT SCROLL */}
          <main className="flex-grow p-6 sm:p-8 overflow-y-auto z-10 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Suspense fallback={
                  <div className="min-h-[400px] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" />
                  </div>
                }>
                  {renderContent()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* TOAST NOTIFICATION CONTAINER PORTAL */}
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
                    ? 'bg-red-950/90 border-red-500/30 text-red-200'
                    : 'bg-[#161616]/95 border-amber-500/30 text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-zinc-500 hover:text-white cursor-pointer focus:outline-none p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
