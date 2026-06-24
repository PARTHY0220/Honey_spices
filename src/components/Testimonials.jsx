import React from 'react';

const Testimonials = () => {
  const critiques = [
    {
      id: 1,
      name: 'Chef Antoine Valois',
      title: 'Three Michelin Stars, Paris',
      quote: "The Kashmir Saffron has an unparalleled terpene lock. Under L'ÉPICE's violet-glass preservation, it retains its deep honeyed essence months longer than any commercial crop.",
      rating: 5
    },
    {
      id: 2,
      name: 'Elena Rostova',
      title: 'Gastronomy Publisher, Rome',
      quote: "The Alleppey Gold Turmeric's earthy citrus warmth has completely elevated our test kitchens. Its high essential oil content offers a brilliant glowing color and depth.",
      rating: 5
    },
    {
      id: 3,
      name: 'Marcus Chen',
      title: 'Executive Developer, Tokyo',
      quote: "L'ÉPICE blends are true culinary alchemy. The Royal Garam Masala delivers a roasted cardamom and mace profile that is unmatched in flavor complexity.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-24">
          <span className="text-[10px] tracking-[0.45em] uppercase text-amber-400 font-bold bg-[#161616]/70 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
            CRITICAL ACCLAIM
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-wider font-light text-white leading-tight mt-2">
            Connoisseur Critiques
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Critiques Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {critiques.map((critique) => (
            <div
              key={critique.id}
              className="bg-neutral-900/30 border border-white/5 p-8 rounded-none flex flex-col justify-between hover:border-amber-500/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500 backdrop-blur-sm"
            >
              {/* Quote Mark Icon */}
              <div className="text-amber-500/20 mb-6">
                <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.944 2c-3.077 1.139-4.944 3.309-4.944 5.309h4v8.416h-10v-4zm-13 0c0-5.141 3.892-10.519 10-11.725l.944 2c-3.077 1.139-4.944 3.309-4.944 5.309h4v8.416h-10v-4z"/>
                </svg>
              </div>

              {/* Quote text */}
              <p className="text-zinc-300 text-sm italic tracking-wide leading-relaxed font-light mb-8">
                "{critique.quote}"
              </p>

              {/* Client Profile */}
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(critique.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="text-sm font-serif text-white tracking-wide font-semibold">{critique.name}</h4>
                <p className="text-[10px] tracking-wider uppercase text-zinc-400 font-mono mt-0.5">{critique.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
