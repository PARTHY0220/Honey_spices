import { motion, AnimatePresence } from 'framer-motion';

const CartView = ({ cart, onUpdateQuantity, onRemoveFromCart, setView }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000, otherwise ₹100
  const tax = subtotal * 0.05; // 5% GST for spices in India
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-transparent text-zinc-100 min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wider font-light mb-12 text-white text-center sm:text-left">
          Your Culinary Cart
        </h1>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 border border-white/5 bg-neutral-900/20 backdrop-blur-md"
          >
            <svg className="w-12 h-12 text-zinc-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-zinc-400 font-light text-sm uppercase tracking-widest mb-8">
              Your spice cart is currently empty.
            </p>
            <button
              onClick={() => setView('products')}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(217,119,6,0.15)] cursor-pointer"
            >
              Continue Savoring
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-between p-5 bg-neutral-900/30 border border-white/5 gap-6 sm:gap-4 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                  >
                    {/* Image & Details */}
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-20 h-20 bg-neutral-900 border border-white/5 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover filter brightness-[0.85]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] tracking-wider uppercase text-amber-400 font-bold font-mono mb-1">{item.origin}</span>
                        <h3 className="text-sm font-serif text-white tracking-wide">{item.name}</h3>
                        <span className="text-xs text-amber-400 mt-1 font-semibold">{item.price} each</span>
                      </div>
                    </div>

                    {/* Quantity Modifiers & Total Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-white/10 bg-neutral-900/60">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3.5 py-1.5 hover:text-amber-400 transition-colors text-zinc-300 focus:outline-none cursor-pointer font-bold"
                        >
                          —
                        </button>
                        <span className="px-4 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3.5 py-1.5 hover:text-amber-400 transition-colors text-zinc-300 focus:outline-none cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Line Price */}
                      <span className="text-sm font-serif font-bold text-white w-24 text-right">
                        ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Delete Action */}
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors cursor-pointer p-1"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary Card */}
            <div className="lg:col-span-4 bg-neutral-900/30 border border-white/10 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
              <h2 className="text-lg font-serif text-white tracking-wide mb-6 pb-4 border-b border-white/5">
                Summary
              </h2>
              
              <div className="space-y-4 text-xs tracking-wider">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-mono font-medium">
                    {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Estimated GST (5%)</span>
                  <span className="text-white font-semibold font-mono">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-amber-400 leading-normal font-bold">
                    Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more to qualify for complimentary shipping.
                  </p>
                )}

                <div className="pt-6 border-t border-white/5 flex justify-between items-center text-sm">
                  <span className="font-serif text-white">Estimated Total</span>
                  <span className="font-mono text-amber-400 font-bold text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setView('checkout')}
                className="w-full mt-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(217,119,6,0.15)] cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => setView('products')}
                className="w-full mt-4 py-3.5 border border-white/10 bg-transparent hover:border-amber-500 text-zinc-300 hover:text-amber-400 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer focus:outline-none"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;
