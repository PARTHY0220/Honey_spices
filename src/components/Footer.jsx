const Footer = ({ setView }) => {
  const handleLinkClick = (e, targetView) => {
    e.preventDefault();
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black/45 text-zinc-300 text-xs tracking-widest font-light border-t border-white/5 py-8 px-6 backdrop-blur-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 pb-8 border-b border-white/5">

        {/* Col 1: Brand Info & Newsletter */}
        <div className="space-y-6">
          <span className="text-white font-serif tracking-[0.2em] text-base font-bold">
            HONEY SPICES
          </span>
          <p className="text-zinc-400 text-xs tracking-wide leading-relaxed font-light">
            Harvesting from micro-estates, slow-curing under solar beds, and preserving in ultraviolet glass. True taste, captured in time.
          </p>
          <div className="pt-2">
            <p className="text-[9px] uppercase text-white font-mono mb-3">Newsletter Sign-up</p>
            <div className="flex border border-white/10 bg-neutral-900/60 focus-within:border-amber-500 transition-colors">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-transparent py-2 px-4 text-xs text-white outline-none w-full font-light"
              />
              <button className="px-4 text-amber-500 font-semibold uppercase tracking-wider text-[10px] hover:text-amber-400 transition-colors cursor-pointer focus:outline-none">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase text-white font-mono tracking-widest font-bold">
            Store Directory
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-300 font-light">
            <li>
              <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-amber-400 transition-colors">
                Home View
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleLinkClick(e, 'products')} className="hover:text-amber-400 transition-colors">
                All Products
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-amber-400 transition-colors">
                About Our Terroir
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-amber-400 transition-colors">
                Concierge Desk
              </a>
            </li>
            <li className="pt-1 border-t border-white/5 mt-1">
              <a href="#admin" onClick={(e) => handleLinkClick(e, 'admin')} className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
                Admin Panel
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Sourcing coordinates */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase text-white font-mono tracking-widest font-bold">
            Origin Locations
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-300 font-light font-mono">
            <li>Kerala Hills, India</li>
            <li>Kashmir Valley, India</li>
            <li>Matara, Sri Lanka</li>
            <li>Sava Region, Madagascar</li>
            <li>Western Ghats, India</li>
          </ul>
        </div>

        {/* Col 4: Contact details */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase text-white font-mono tracking-widest font-bold">
            Concierge Desk
          </p>
          <div className="space-y-2.5 text-xs leading-relaxed text-zinc-300 font-light">
            <p>12 Rue de L'Éspice, 75001 Paris, France</p>
            <p>Phone: +33 (0) 1 42 68 55 00</p>
            <p>Email: concierge@lepice.com</p>
            <p className="text-[10px] text-amber-500 font-mono uppercase font-bold">Mon — Fri: 09:00 - 18:00 CET</p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="pt-6 text-center text-[10px] text-zinc-400 flex flex-col sm:flex-row justify-between items-center">
        <span>© 2026 HONEY SPICES. All Rights Reserved.</span>
        <span>Preserved in ultraviolet glass. Sourced with absolute integrity.</span>
      </div>
    </footer>
  );
};

export default Footer;
