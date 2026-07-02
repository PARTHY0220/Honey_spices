import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext.jsx';

const UserProfile = ({ setView, addToast }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'edit', 'security'

  // State for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // State for editing profile
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State for changing password
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price,
              products ( name, image_url, category )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err.message);
        addToast('Failed to load order history', 'error');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab, addToast]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.id]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Error updating profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.id]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addToast('Password should be at least 6 characters', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      addToast('Password updated successfully', 'success');
      setActiveTab('orders');
    } catch (err) {
      addToast(err.message || 'Error updating password', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-6">Please log in to view your profile.</p>
          <button onClick={() => setView('login')} className="px-6 py-2 bg-amber-500 text-black font-semibold text-xs tracking-widest uppercase cursor-pointer">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.015] rounded-full filter blur-[45px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-neutral-900/30 border border-white/10 p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center text-2xl font-bold uppercase mb-4">
              {profile?.full_name ? profile.full_name.substring(0, 1) : 'U'}
            </div>
            <h2 className="text-lg font-serif text-white tracking-wide">{profile?.full_name || 'User'}</h2>
            <p className="text-xs text-zinc-400 mb-4">{profile?.email}</p>
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-amber-400 rounded-full">
              {profile?.role || 'Customer'}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-all duration-300 border-l-2 cursor-pointer focus:outline-none ${
                activeTab === 'orders' ? 'border-amber-500 text-amber-400 bg-white/5' : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-all duration-300 border-l-2 cursor-pointer focus:outline-none ${
                activeTab === 'edit' ? 'border-amber-500 text-amber-400 bg-white/5' : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-all duration-300 border-l-2 cursor-pointer focus:outline-none ${
                activeTab === 'security' ? 'border-amber-500 text-amber-400 bg-white/5' : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-serif text-white tracking-wide mb-6 pb-2 border-b border-white/10">Your Order History</h3>
                
                {loadingOrders ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-neutral-900/30 border border-white/5 p-12 text-center">
                    <p className="text-zinc-400 mb-6 font-mono text-sm">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => setView('products')}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-neutral-900/40 border border-white/10 overflow-hidden">
                        {/* Order Header */}
                        <div className="bg-black/40 p-4 sm:px-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Order Placed</span>
                            <span className="text-sm text-zinc-300">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Total Amount</span>
                            <span className="text-sm text-amber-400 font-bold">₹{new Intl.NumberFormat('en-IN').format(order.total_amount)}</span>
                          </div>
                          <div className="flex flex-col gap-1 items-end sm:items-start">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Order #</span>
                            <span className="text-xs text-zinc-400 font-mono">{order.id.split('-')[0]}</span>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-sm border ${
                              order.order_status === 'Pending' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
                              order.order_status === 'Confirmed' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                              order.order_status === 'Shipped' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                              order.order_status === 'Delivered' ? 'text-green-500 border-green-500/30 bg-green-500/10' :
                              order.order_status === 'Cancelled' ? 'text-red-500 border-red-500/30 bg-red-500/10' :
                              'text-zinc-400 border-white/20 bg-white/5'
                            }`}>
                              {order.order_status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-6 space-y-4">
                          {order.order_items?.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-neutral-950 border border-white/5 shrink-0 overflow-hidden">
                                {item.products?.image_url && (
                                  <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1 flex justify-between items-center">
                                <div>
                                  <h4 className="text-sm text-white font-serif">{item.products?.name}</h4>
                                  <p className="text-xs text-zinc-500 font-mono mt-1">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-sm text-zinc-300">₹{new Intl.NumberFormat('en-IN').format(item.price)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'edit' && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl"
              >
                <h3 className="text-xl font-serif text-white tracking-wide mb-6 pb-2 border-b border-white/10">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      id="full_name"
                      value={editForm.full_name}
                      onChange={handleEditChange}
                      placeholder=" "
                      required
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      Full Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      Phone Number
                    </label>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-widest uppercase transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl"
              >
                <h3 className="text-xl font-serif text-white tracking-wide mb-6 pb-2 border-b border-white/10">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder=" "
                      required
                      minLength={6}
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      New Password
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder=" "
                      required
                      minLength={6}
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      Confirm New Password
                    </label>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-white font-semibold text-xs tracking-widest uppercase transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
