import React, { useState } from 'react';

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    // Simulate luxury submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 px-6 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Direct Concierge Contacts */}
        <div className="lg:col-span-5">
          <span className="text-[10px] tracking-[0.45em] uppercase text-amber-400 font-bold mb-4 block">
            CONCIERGE DESK
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-wider font-light text-white leading-tight mb-8">
            Begin Your <br />
            <span className="italic font-normal text-amber-400">Aromatic Inquiry</span>
          </h2>
          <div className="w-12 h-[1px] bg-amber-500/40 mb-8"></div>
          
          <p className="text-zinc-300 text-sm tracking-wide leading-relaxed font-light mb-12 max-w-md">
            Whether securing rare single-origin reserves, requesting custom blends for premium culinary operations, or seeking advice from our spice sommeliers, our concierge team is available to assist.
          </p>

          {/* Contact Details List */}
          <div className="space-y-8 text-sm">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white font-mono mb-2">
                Paris Head Office
              </p>
              <p className="text-zinc-300 font-light tracking-wide">
                12 Rue de L'Éspice, 75001 Paris, France
              </p>
            </div>
            
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white font-mono mb-2">
                Direct Inquiries
              </p>
              <p className="text-zinc-300 font-light tracking-wide mb-1">
                Email: <a href="mailto:concierge@lepice.com" className="text-amber-400 hover:text-amber-500 font-semibold transition-colors">concierge@lepice.com</a>
              </p>
              <p className="text-zinc-300 font-light tracking-wide">
                Phone: +33 (0) 1 42 68 55 00
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-widest uppercase text-white font-mono mb-2">
                Sommelier Hours
              </p>
              <p className="text-zinc-300 font-light tracking-wide">
                Monday — Friday: 09:00 - 18:00 CET
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Concierge Form & Sommelier Chat */}
        <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 p-8 sm:p-10 backdrop-blur-md relative shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name Input Field */}
            <div className="relative group">
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
              />
              <label
                htmlFor="name"
                className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500"
              >
                Full Name
              </label>
            </div>

            {/* Email Address Input Field */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500"
              >
                Email Address
              </label>
            </div>

            {/* Message Textarea */}
            <div className="relative group">
              <textarea
                id="message"
                value={formState.message}
                onChange={handleInputChange}
                placeholder=" "
                rows="4"
                required
                className="peer w-full bg-transparent border-b border-white/10 focus:border-amber-500 py-3 text-white text-sm outline-none transition-colors duration-300 resize-none"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-0 top-3 text-zinc-500 text-xs sm:text-sm tracking-wide transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-amber-500"
              >
                Inquiry Details
              </label>
            </div>

            {/* Form Submit Button */}
            <button
              type="submit"
              className="w-full relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-semibold tracking-[0.15em] text-xs uppercase text-amber-400 border border-amber-500/30 hover:border-amber-500 rounded-none transition-all duration-300 group cursor-pointer bg-transparent"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-amber-500 group-hover:translate-x-0 ease"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                {isSubmitted ? 'Sending Inquiry...' : 'Submit Inquiry'}
              </span>
            </button>
          </form>

          {/* Success Message Banner */}
          {isSubmitted && (
            <div className="absolute inset-0 bg-[#161616]/98 flex flex-col justify-center items-center p-8 text-center transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center mb-4">
                <span className="text-amber-500 text-lg">✓</span>
              </div>
              <h4 className="text-lg font-serif text-white tracking-wide mb-2">Inquiry Received</h4>
              <p className="text-zinc-300 text-xs max-w-xs font-light leading-relaxed">
                Thank you. A specialized L'ÉPICE Sommelier has been assigned to your request and will contact you shortly.
              </p>
            </div>
          )}

          {/* Or Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow h-[1px] bg-white/5"></div>
            <span className="px-4 text-[9px] tracking-widest text-zinc-400 font-mono uppercase">
              Or Live Chat
            </span>
            <div className="flex-grow h-[1px] bg-white/5"></div>
          </div>

          {/* Premium WhatsApp Button */}
          <a
            href="https://wa.me/33142685500"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full relative inline-flex items-center justify-center gap-3 px-8 py-3.5 border border-emerald-500/20 bg-neutral-900/60 text-emerald-400 hover:text-white hover:bg-emerald-600 hover:shadow-[0_4px_15px_rgba(16,185,129,0.15)] transition-all duration-500 cursor-pointer"
          >
            {/* Custom vector WhatsApp icon */}
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.004 0C5.372 0 0 5.372 0 12.004c0 2.116.55 4.102 1.513 5.838L0 24l6.34-1.662c1.7.927 3.633 1.417 5.66 1.417 6.63 0 12.003-5.373 12.003-12.005C24.004 5.372 18.631 0 12.004 0zm6.81 17.078c-.28.784-1.378 1.436-2.253 1.526-.6.062-1.385.093-2.18-.162-2.915-.933-5.01-3.79-5.156-3.985-.145-.195-1.185-1.58-1.185-3.023 0-1.443.753-2.15 1.023-2.433.27-.282.592-.352.79-.352.196 0 .393.002.56.01.173.008.406-.065.635.485.23.55.787 1.916.854 2.052.068.136.113.294.023.475-.09.18-.135.293-.27.452-.136.158-.286.353-.408.474-.136.136-.278.283-.12.553.157.27.7 1.152 1.5 1.865.798.712 1.47 1.042 1.772 1.177.302.135.481.113.662-.09.18-.204.782-.91.99-1.22.208-.31.417-.26.702-.153.284.108 1.802.85 2.11 1.003.308.153.514.23.59.356.074.128.074.74-.206 1.524z" />
            </svg>
            <span>Sommelier WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
