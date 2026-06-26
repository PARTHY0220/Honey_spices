import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase';

const LoginView = ({ setView, addToast }) => {
  const { user, profile, login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        setView('admin');
      } else {
        setView('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, profile, setView]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        setSubmitMessage('Authenticating spice credential logs...');
        await login(formData.email, formData.password);
        if (addToast) addToast('Welcome back to Honey Spices!', 'success');
      } else if (mode === 'signup') {
        setSubmitMessage('Creating secure user profile...');
        await register(formData.email, formData.password, formData.name, '');
        if (addToast) addToast('Registration successful! Welcome!', 'success');
      } else if (mode === 'forgot') {
        setSubmitMessage('Broadcasting recovery key link...');
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        if (addToast) addToast('Password reset link sent to your email!', 'success');
        setIsSubmitting(false);
        setMode('signin');
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setIsSubmitting(false);
      if (addToast) addToast(err.message || 'An error occurred during authentication', 'error');
    }
  };

  const handleBypass = async () => {
    setIsSubmitting(true);
    setSubmitMessage('Loading curator workspace dashboard panel...');
    try {
      // Try login first
      await login('admin@honeyspices.com', 'admin');
      if (addToast) addToast('Curator workspace authenticated', 'success');
    } catch (err) {
      console.log('Bypass account not found, attempting auto-registration:', err.message);
      // If login fails (user does not exist), register them and login
      try {
        await register('admin@honeyspices.com', 'admin', 'Devaiah Thimmaiah', '+91 99999 99999');
        await login('admin@honeyspices.com', 'admin');
        if (addToast) addToast('Curator account generated and workspace authenticated', 'success');
      } catch (signupErr) {
        setIsSubmitting(false);
        if (addToast) addToast('Bypass failed: ' + signupErr.message, 'error');
      }
    }
  };

  return (
    <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-md w-full bg-neutral-900/30 border border-white/5 p-8 sm:p-10 backdrop-blur-md relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
        
        <AnimatePresence mode="wait">
          {mode === 'signin' && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-serif text-white tracking-wide mb-2 text-center">Welcome Back</h2>
              <p className="text-zinc-400 text-xs tracking-wider uppercase font-bold text-center mb-10">Access Your Reserve</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="email" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Email Address
                  </label>
                </div>

                {/* Password */}
                <div className="relative group">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="password" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Secret Password
                  </label>
                </div>

                {/* Forgot Link & Action */}
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-zinc-400 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors focus:outline-none cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-semibold tracking-[0.15em] text-xs uppercase text-amber-400 border border-amber-500/30 hover:border-amber-500 rounded-none transition-all duration-300 group cursor-pointer bg-transparent"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-amber-500 group-hover:translate-x-0 ease"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    Sign In
                  </span>
                </button>

                {/* Demo Admin bypass */}
                <button
                  type="button"
                  onClick={handleBypass}
                  className="w-full text-center text-[10px] text-amber-500/60 hover:text-amber-400 transition-colors tracking-widest font-mono uppercase cursor-pointer py-1.5 border border-dashed border-amber-500/25 block mt-2"
                >
                  Bypass: Demo Admin Login
                </button>
              </form>
            </motion.div>
          )}

          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-serif text-white tracking-wide mb-2 text-center">Join L'Épice</h2>
              <p className="text-zinc-400 text-xs tracking-wider uppercase font-bold text-center mb-10">Register Your Terroir Profile</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="name" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Full Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="email" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Email Address
                  </label>
                </div>

                {/* Password */}
                <div className="relative group">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="password" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Secret Password
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-zinc-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    Already have an account? <span className="text-amber-400 font-semibold hover:text-amber-300 ml-1">Sign In</span>
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-semibold tracking-[0.15em] text-xs uppercase text-amber-400 border border-amber-500/30 hover:border-amber-500 rounded-none transition-all duration-300 group cursor-pointer bg-transparent"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-amber-500 group-hover:translate-x-0 ease"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    Register Account
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-serif text-white tracking-wide mb-2 text-center">Forgot Password</h2>
              <p className="text-zinc-400 text-xs tracking-wider uppercase font-bold text-center mb-10">Recover Your Access Key</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                  />
                  <label htmlFor="email" className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500">
                    Email Address
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-zinc-400 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-semibold tracking-[0.15em] text-xs uppercase text-amber-400 border border-amber-500/30 hover:border-amber-500 rounded-none transition-all duration-300 group cursor-pointer bg-transparent"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-amber-500 group-hover:translate-x-0 ease"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    Send Recovery Key
                  </span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Spinner Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 bg-[#161616]/98 flex flex-col justify-center items-center p-8 text-center transition-opacity duration-300">
            <div className="relative w-12 h-12 mb-6">
              <div className="absolute inset-0 rounded-full border border-amber-500/10" />
              <div className="absolute inset-0 rounded-full border-t border-amber-500 animate-spin" />
            </div>
            <p className="text-zinc-400 text-xs font-mono lowercase tracking-widest">
              {submitMessage}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginView;
