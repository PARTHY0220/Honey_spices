import { useState, useMemo } from 'react';


const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'single-origin', name: 'Single-Origin' },
  { id: 'blends', name: 'Spice Blends' },
  { id: 'honey-elixirs', name: 'Honey & Elixirs' }
];

const Products = ({ products, productsLoading = false, onProductClick, onAddToCart, showFilters = false, setView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filters logic
  const filteredProducts = useMemo(() => {
    let result = products || [];
    
    // If showFilters is false (homepage view), return only featured products (or first 3 fallback)
    if (!showFilters) {
      const featured = result.filter(p => p.featured);
      return featured.length > 0 ? featured : result.slice(0, 3);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.origin.toLowerCase().includes(query) ||
             p.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, showFilters, selectedCategory, searchQuery]);

  if (productsLoading) {
    return (
      <div className="py-24 sm:py-32 flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border border-amber-500/10 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <section id="products" className="py-24 sm:py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-[10px] tracking-[0.45em] uppercase text-amber-400 font-bold bg-[#161616]/70 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
            {showFilters ? 'FULL CATALOGUE' : 'OUR CURATED SELECTION'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-wider font-light text-white leading-tight mt-2">
            {showFilters ? 'Explore the Spice Vault' : 'Signature Single-Origin Reserves'}
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Search & Category Filter Pills */}
        {showFilters && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 pb-8 border-b border-white/5">
            {/* Search Input */}
            <div className="w-full md:max-w-md relative">
              <input
                type="text"
                placeholder="Search spices catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-900/50 border border-white/10 focus:border-amber-500 py-3 px-6 pr-12 rounded-none outline-none text-sm text-white w-full transition-all focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
              <svg className="w-5 h-5 text-zinc-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold border rounded-none transition-all duration-300 cursor-pointer focus:outline-none ${
                    selectedCategory === cat.id
                      ? 'border-amber-500 bg-amber-500 text-black shadow-[0_4px_12px_rgba(245,158,11,0.2)]'
                      : 'border-white/10 bg-neutral-900/40 text-zinc-300 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 p-6 rounded-none transition-all duration-500 flex flex-col justify-between hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:-translate-y-1 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div onClick={() => onProductClick && onProductClick(product)} className="cursor-pointer">
                  {/* Product Image Container */}
                  <div className="relative w-full h-[220px] mb-6 overflow-hidden border border-white/5 bg-neutral-900/60">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-95"
                    />
                    <span className="absolute top-3 left-3 bg-neutral-900/80 border border-amber-500/25 px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase font-bold text-amber-400">
                      {product.tag}
                    </span>
                  </div>

                  {/* Rating Block */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'
                          }`}
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-300 font-medium tracking-wide">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif tracking-wide text-white group-hover:text-amber-400 transition-colors duration-300 mb-1">
                    {product.name}
                  </h3>
                  
                  {/* Origin */}
                  <div className="flex justify-between items-center mb-4 text-[10px] text-amber-400 font-mono">
                    <span className="italic">{product.origin}</span>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-300 text-xs tracking-wide leading-relaxed font-light mb-6 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Price and Add to Cart Section */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] tracking-widest text-zinc-500 uppercase">Price</span>
                    <span className="text-amber-400 font-serif text-lg font-bold">{product.price}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart && onAddToCart(product)}
                    className="relative flex-grow inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-semibold tracking-[0.15em] text-[10px] uppercase text-amber-400 border border-amber-500/30 hover:border-amber-500 rounded-none transition-all duration-300 group/btn cursor-pointer focus:outline-none bg-transparent"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-full bg-amber-500 group-hover/btn:translate-x-0 ease"></span>
                    <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-black">
                      Add to Cart
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 bg-neutral-900/10 backdrop-blur-sm">
            <p className="text-white font-light text-sm uppercase tracking-widest">No spices match your criteria.</p>
          </div>
        )}

        {/* View Full Catalogue Button (curated home page grid helper) */}
        {!showFilters && setView && (
          <div className="text-center mt-16 sm:mt-20">
            <button
              onClick={() => { setView('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-10 py-4 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              View Full Catalogue
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
