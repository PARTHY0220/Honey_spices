import React, { useState, useRef } from 'react';

const ProductCard = ({ product, onClick }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    
    // Mouse coordinates relative to card center
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Normalized tilt angles (max 10 degrees tilt)
    const tiltX = -(y / (box.height / 2)) * 10;
    const tiltY = (x / (box.width / 2)) * 10;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(product)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className="cursor-pointer group relative bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 p-6 rounded-none flex flex-col justify-between hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] duration-500 overflow-hidden backdrop-blur-sm"
    >
      {/* Glossy overlay effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${-tilt.x * 10 + 50}%, rgba(245, 158, 11, 0.05) 0%, transparent 60%)`
        }}
      />

      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-[220px] mb-6 overflow-hidden border border-white/5 bg-neutral-900/60">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-95"
          />
          {/* Rarity Tag */}
          <span className="absolute top-3 left-3 bg-neutral-900/80 border border-amber-500/20 px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase font-bold text-amber-400">
            {product.rarity}
          </span>
        </div>

        {/* Origin / Price */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-amber-400 font-bold font-mono">
            {product.origin}
          </span>
          <span className="text-amber-400 font-serif text-sm italic font-bold">
            {product.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif tracking-wide text-white group-hover:text-amber-400 transition-colors duration-300 mb-0.5">
          {product.name}
        </h3>
        
        {/* Scientific / Botanical Name */}
        <p className="text-[10px] text-zinc-400 italic mb-4">
          {product.scientificName}
        </p>

        {/* Description */}
        <p className="text-zinc-300 text-xs tracking-wide leading-relaxed font-light mb-6 line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Footer / Interactive Indicator */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors duration-300">
          Reserve Jar
        </span>
        <div className="w-6 h-6 border border-white/10 group-hover:border-amber-500/50 rounded-full flex items-center justify-center transition-colors duration-300">
          <span className="text-xs text-amber-400 transform group-hover:translate-x-0.5 transition-transform duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
