import { useState } from 'react';
import { motion } from 'framer-motion';

const generateOrderId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '#HS-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const SuccessView = ({ setView }) => {
  // Generate a randomized receipt ID
  const [orderId] = useState(generateOrderId);

  return (
    <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background soft glowing spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.01] rounded-full filter blur-[100px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-neutral-900/30 border border-white/5 p-8 sm:p-10 backdrop-blur-md text-center relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
      >
        {/* Animated Gold Checkmark */}
        <div className="w-16 h-16 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-8 bg-neutral-900 shadow-[0_4px_12px_rgba(245,158,11,0.15)]">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif text-white tracking-wide mb-3">Aromas Secured</h1>
        <p className="text-amber-400 text-xs tracking-wider uppercase font-bold mb-8">Order Confirmed</p>

        <p className="text-zinc-300 text-sm tracking-wide leading-relaxed font-light mb-8">
          Thank you for savoring with Honey Spices. Your order is registered in our secure ledger. Our spice master has been notified to hand-pack your reserve.
        </p>

        {/* Receipt Details Card */}
        <div className="bg-neutral-900/60 border border-white/5 p-5 text-left space-y-4 mb-10 text-xs tracking-wider font-light">
          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase font-mono text-[9px]">Receipt ID</span>
            <span className="text-white font-mono font-bold">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase font-mono text-[9px]">Preservation</span>
            <span className="text-amber-400 font-bold">Violet-Glass Locked</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400 uppercase font-mono text-[9px]">Est. Sourcing Delivery</span>
            <span className="text-white font-semibold">3 — 5 Business Days</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(217,119,6,0.15)] focus:outline-none cursor-pointer"
        >
          Continue Shopping
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessView;
