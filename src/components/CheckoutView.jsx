import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext.jsx';

const CheckoutView = ({ cart, onCheckoutSuccess, setView, addToast }) => {
  const { user } = useAuth();
  const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'credit', 'debit'
  const [billing, setBilling] = useState({ name: '', email: '', address: '', city: '', zip: '', state: 'Kerala' });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '' });
  const [upiId, setUpiId] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  const handleBillingChange = (e) => {
    const { id, value } = e.target;
    setBilling(prev => ({ ...prev, [id]: value }));
  };

  const handlePaymentChange = (e) => {
    const { id, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (id === 'cardNumber') {
      const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const parts = [];

      for (let i = 0, len = cleaned.length; i < len; i += 4) {
        parts.push(cleaned.substring(i, i + 4));
      }

      setPayment(prev => ({ 
        ...prev, 
        cardNumber: parts.length > 0 ? parts.join(' ').substring(0, 19) : cleaned 
      }));
      return;
    }

    // Format Expiry with slash (MM/YY)
    if (id === 'cardExpiry') {
      const cleaned = value.replace(/\//g, '').replace(/[^0-9]/gi, '');
      if (cleaned.length >= 2) {
        setPayment(prev => ({ ...prev, cardExpiry: `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`.substring(0, 5) }));
      } else {
        setPayment(prev => ({ ...prev, cardExpiry: cleaned }));
      }
      return;
    }

    // Standard field change
    setPayment(prev => ({ ...prev, [id]: value }));
  };

  const saveOrderToSupabase = async () => {
    if (!user) {
      if (addToast) addToast('Error: Please log in to complete checkout', 'error');
      return false;
    }

    try {
      // 1. Create order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          payment_method: paymentMethod.toUpperCase(),
          payment_status: 'Paid',
          order_status: 'Pending',
          shipping_address: `${billing.name}\n${billing.address}\n${billing.city}, ${billing.state} - ${billing.zip}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items record
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.priceNum
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear customer cart on database
      const { error: cartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      return true;
    } catch (err) {
      console.error('Error saving order:', err);
      if (addToast) addToast(err.message || 'Error processing order in database', 'error');
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!billing.name || !billing.email || !billing.address || !billing.city || !billing.zip) return;

    if (paymentMethod === 'upi') {
      if (!upiId) return;
      setIsProcessing(true);
      setProcessStep('Awaiting UPI VPA handshake validation...');
      
      setTimeout(() => {
        setProcessStep('Broadcasting transaction to your UPI App (GPay/PhonePe)...');
        setTimeout(() => {
          setProcessStep('Awaiting user authentication passcode...');
          setTimeout(() => {
            setProcessStep('Settling transaction ledger...');
            setTimeout(async () => {
              const success = await saveOrderToSupabase();
              setIsProcessing(false);
              if (success) {
                if (addToast) addToast('Order settled and confirmed!', 'success');
                onCheckoutSuccess();
              }
            }, 1000);
          }, 1500);
        }, 1500);
      }, 1200);
    } else {
      if (!payment.cardNumber || !payment.cardExpiry || !payment.cardCvv) return;
      setIsProcessing(true);
      setProcessStep('Verifying card credentials with bank API...');
      
      setTimeout(() => {
        setProcessStep('Redirecting to 3D Secure Verification / OTP window...');
        setTimeout(() => {
          setProcessStep('Settling transaction ledger...');
          setTimeout(async () => {
            const success = await saveOrderToSupabase();
            setIsProcessing(false);
            if (success) {
              if (addToast) addToast('Order settled and confirmed!', 'success');
              onCheckoutSuccess();
            }
          }, 1200);
        }, 1500);
      }, 1200);
    }
  };

  return (
    <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.015] rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wider font-light mb-12 text-white text-center sm:text-left">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Billing Details */}
          <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 p-8 sm:p-10 space-y-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <h2 className="text-lg font-serif text-white tracking-wide pb-3 border-b border-white/5">
              Billing & Sourcing Address
            </h2>

            {/* Billing Inputs */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  value={billing.name}
                  onChange={handleBillingChange}
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
                  type="email"
                  id="email"
                  value={billing.email}
                  onChange={handleBillingChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                />
                <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                  Email Address
                </label>
              </div>
            </div>

            <div className="relative group">
              <input
                type="text"
                id="address"
                value={billing.address}
                onChange={handleBillingChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
              />
              <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                Shipping Address
              </label>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="relative group sm:col-span-2">
                <input
                  type="text"
                  id="city"
                  value={billing.city}
                  onChange={handleBillingChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
                />
                <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                  City / Location
                </label>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="zip"
                  value={billing.zip}
                  onChange={handleBillingChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                />
                <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                  Pincode
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Gateway Option Selectors */}
          <div className="lg:col-span-5 bg-neutral-900/30 border border-white/10 p-8 sm:p-10 space-y-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            <h2 className="text-lg font-serif text-white tracking-wide pb-3 border-b border-white/5">
              Secure Ledger Payment
            </h2>

            {/* Payment Method Option Selector Tabs */}
            <div className="flex border-b border-white/5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold text-center border-b-2 cursor-pointer transition-colors focus:outline-none ${
                  paymentMethod === 'upi'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold text-center border-b-2 cursor-pointer transition-colors focus:outline-none ${
                  paymentMethod === 'credit'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('debit')}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-semibold text-center border-b-2 cursor-pointer transition-colors focus:outline-none ${
                  paymentMethod === 'debit'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Debit Card
              </button>
            </div>

            {/* Dynamic Rendering of Payment Methods */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'upi' ? (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* UPI VPA Input field */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder=" "
                      required={paymentMethod === 'upi'}
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      Enter UPI ID / VPA (e.g. name@upi)
                    </label>
                  </div>

                  {/* QR Code Divider */}
                  <div className="flex items-center my-4">
                    <div className="flex-grow h-[1px] bg-white/5"></div>
                    <span className="px-3 text-[8px] tracking-widest text-zinc-400 font-mono uppercase">Or Scan Code</span>
                    <div className="flex-grow h-[1px] bg-white/5"></div>
                  </div>

                  {/* Elegant Custom Vector QR Code Box */}
                  <div className="flex flex-col items-center justify-center p-5 bg-neutral-900/60 border border-white/5">
                    <div className="w-36 h-36 border-2 border-amber-500/20 p-2 bg-white flex items-center justify-center relative shadow-[0_4px_12px_rgba(245,158,11,0.05)]">
                      {/* Premium SVG representation of QR Grid */}
                      <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                        {/* Position Markers */}
                        <path d="M0 0h28v28H0zm8 8h12v12H8zM72 0h28v28H72zm8 8h12v12H80zM0 72h28v28H0zm8 8h12v12H8z" />
                        {/* Center/Random QR Grid paths */}
                        <path d="M40 0h8v8h-8zm16 0h8v8h-8zm0 16h8v8h-8zM32 32h8v8h-8zm24 0h8v8h-8zm8 0h8v8h-8zm8 0h8v8h-8zM48 48h8v8h-8zm8 0h8v8h-8zm16 0h8v8h-8zm16 0h8v8h-8zM32 56h8v8h-8zm16 0h8v8h-8zm8 8h8v8h-8zm8 0h8v8h-8zm24 8h8v8h-8zm-8 16h8v8h-8z" />
                        {/* Custom gold spice seed leaf logo embedded in center */}
                        <rect x="42" y="42" width="16" height="16" fill="white" />
                        <path d="M50 44c4 4 4 10 0 12c-4-2-4-8 0-12z" fill="#f59e0b" />
                      </svg>
                    </div>
                    <span className="text-[9px] tracking-wider uppercase text-zinc-400 font-mono mt-4 text-center">
                      Scan using GPay, PhonePe, BHIM or G-App
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Gold Credit/Debit Card Visual representation */}
                  <div className="relative w-full h-[180px] bg-gradient-to-br from-[#1A0F0A] to-[#2E1A11] border border-amber-500/30 p-5 rounded-none flex flex-col justify-between shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-7 bg-amber-500/25 border border-amber-500/30 rounded-sm relative flex items-center justify-center">
                        <div className="w-5 h-4 border-r border-b border-amber-500/20"></div>
                      </div>
                      <span className="text-[9px] tracking-[0.25em] font-serif text-amber-500 font-bold uppercase">
                        {paymentMethod === 'credit' ? 'Credit Card' : 'Debit Card'}
                      </span>
                    </div>

                    <div className="text-white font-mono text-base tracking-[0.2em] my-4 min-h-[24px]">
                      {payment.cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-center text-zinc-400 font-mono text-[9px] tracking-wider">
                      <div className="flex flex-col">
                        <span>Card Holder</span>
                        <span className="text-white uppercase font-sans mt-0.5 tracking-widest">{billing.name || 'Your Name'}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span>Expires</span>
                        <span className="text-white mt-0.5">{payment.cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Number Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="cardNumber"
                      value={payment.cardNumber}
                      onChange={handlePaymentChange}
                      maxLength="19"
                      placeholder=" "
                      required={paymentMethod !== 'upi'}
                      className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                    />
                    <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                      Card Number
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        type="text"
                        id="cardExpiry"
                        value={payment.cardExpiry}
                        onChange={handlePaymentChange}
                        maxLength="5"
                        placeholder=" "
                        required={paymentMethod !== 'upi'}
                        className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                      />
                      <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                        Expiry Date (MM/YY)
                      </label>
                    </div>

                    <div className="relative group">
                      <input
                        type="password"
                        id="cardCvv"
                        value={payment.cardCvv}
                        onChange={handlePaymentChange}
                        maxLength="3"
                        placeholder=" "
                        required={paymentMethod !== 'upi'}
                        className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 font-mono"
                      />
                      <label className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-400 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-400">
                        Security CVV
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secure Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(217,119,6,0.15)] flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pay ₹{total.toLocaleString('en-IN')} Securely</span>
            </button>

            <button
              type="button"
              onClick={() => setView('cart')}
              className="w-full py-3.5 border border-white/10 bg-transparent text-zinc-300 hover:border-amber-500 hover:text-amber-400 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Back to Cart
            </button>
          </div>
        </form>
      </div>

      {/* Gateway Processing Overlay Animation */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-8 text-center transition-opacity duration-300">
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/10" />
            <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 animate-spin" />
          </div>
          <h4 className="text-xl font-serif text-white tracking-wide mb-2">Securing Spice Transaction</h4>
          <p className="text-zinc-400 text-xs max-w-xs font-mono lowercase tracking-widest transition-all">
            {processStep}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutView;
