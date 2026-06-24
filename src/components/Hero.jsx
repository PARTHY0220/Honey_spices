import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Hero = ({ setView }) => {
  // 1. Floating Turmeric Powder (bottom-left to top-right)
  const turmericParticles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const startX = Math.random() * 40 - 20; // -20vw to 20vw (bottom-left area)
      const startY = Math.random() * 20 + 85; // 85vh to 105vh (below viewport bottom)
      const targetX = Math.random() * 45 + 65; // 65vw to 110vw (top-right area)
      const targetY = Math.random() * 40 - 15; // -15vh to 25vh (above viewport top)
      
      const size = Math.random() * 4 + 2; // 2px to 6px
      const duration = Math.random() * 9 + 12; // 12s to 21s
      const delay = Math.random() * 12;
      
      return { id: i, startX, startY, targetX, targetY, size, duration, delay };
    });
  }, []);

  // 2. Red Chili Powder Dust (top-right to center swirling)
  const chiliParticles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const startX = Math.random() * 30 + 80; // 80vw to 110vw (top-right area)
      const startY = Math.random() * 40 - 15; // -15vh to 25vh (above/right boundary)
      const targetX = Math.random() * 30 + 30; // 30vw to 60vw (center area)
      const targetY = Math.random() * 30 + 35; // 35vh to 65vh (center area)
      
      // Calculate intermediate swirling curve path offsets
      const midX1 = startX - (startX - targetX) * 0.35 - (Math.random() * 12 + 6);
      const midY1 = startY + (targetY - startY) * 0.45 + (Math.random() * 15 - 5);
      
      const midX2 = startX - (startX - targetX) * 0.72 + (Math.random() * 14 - 7);
      const midY2 = startY + (targetY - startY) * 0.8 + (Math.random() * 12 + 6);

      const size = Math.random() * 4.5 + 2; // 2px to 6.5px
      const duration = Math.random() * 10 + 13; // 13s to 23s
      const delay = Math.random() * 10;

      return { id: i, startX, startY, midX1, midY1, midX2, midY2, targetX, targetY, size, duration, delay };
    });
  }, []);

  // 3. Cinnamon Powder Particles (center expansion with downward drift)
  const cinnamonParticles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const startX = Math.random() * 20 + 40; // 40vw to 60vw (center area)
      const startY = Math.random() * 20 + 30; // 30vh to 50vh (center area)
      
      // Angular explosion outwards and downwards
      const angle = (Math.random() * Math.PI) + 0.15; // biased downwards (0.15 to PI)
      const dist = Math.random() * 45 + 30;
      
      const targetX = startX + Math.cos(angle) * dist;
      const targetY = startY + Math.sin(angle) * dist + 20; // downward drift offset

      const size = Math.random() * 3 + 1.5; // 1.5px to 4.5px
      const blur = Math.random() > 0.45; // Depth of field simulation
      const duration = Math.random() * 8 + 9; // 9s to 17s
      const delay = Math.random() * 8;

      return { id: i, startX, startY, targetX, targetY, size, blur, duration, delay };
    });
  }, []);

  // 4. Slow-moving Mist / Smoke (bottom to top waves)
  const smokeClouds = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const startX = Math.random() * 70 + 15; // 15vw to 85vw
      const scale = Math.random() * 0.7 + 0.9; // 0.9 to 1.6
      const duration = Math.random() * 12 + 22; // 22s to 34s
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.08 + 0.12; // 12% to 20% opacity as requested
      
      return { id: i, startX, scale, duration, delay, opacity };
    });
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0B0B0B] flex flex-col justify-between select-none">
      
      {/* Visual Spice Emitters & Smoke Mist Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Soft Ambient Glows (Dust Clouds) */}
        {/* Turmeric Cloud (Bottom-Left) */}
        <motion.div
          animate={{
            x: [0, 30, -15, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] left-[-15%] w-[65vw] h-[65vw] rounded-full filter blur-3xl opacity-[0.24]"
          style={{
            background: 'radial-gradient(circle, #F5C518 0%, rgba(245, 197, 24, 0) 70%)',
          }}
        />

        {/* Chili Cloud (Top-Right) */}
        <motion.div
          animate={{
            x: [0, -45, 15, 0],
            y: [0, 30, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-15%] right-[-15%] w-[60vw] h-[60vw] rounded-full filter blur-3xl opacity-[0.16]"
          style={{
            background: 'radial-gradient(circle, #FF3B30 0%, rgba(255, 59, 48, 0) 70%)',
          }}
        />

        {/* Cinnamon Cloud (Center Background) */}
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.08, 0.13, 0.08],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full filter blur-3xl"
          style={{
            background: 'radial-gradient(circle, #C68B59 0%, rgba(198, 139, 89, 0) 70%)',
          }}
        />

        {/* 1. Floating Turmeric Particles */}
        {turmericParticles.map((p) => (
          <motion.div
            key={`turmeric-${p.id}`}
            initial={{
              x: `${p.startX}vw`,
              y: `${p.startY}vh`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: `${p.targetX}vw`,
              y: `${p.targetY}vh`,
              opacity: [0, 0.85, 0.85, 0],
              scale: [0.5, 1.25, 0.8, 0.5],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#F5C518',
              boxShadow: '0 0 6px rgba(245, 197, 24, 0.6)',
            }}
          />
        ))}

        {/* 2. Swirling Chili Particles */}
        {chiliParticles.map((p) => (
          <motion.div
            key={`chili-${p.id}`}
            initial={{
              x: `${p.startX}vw`,
              y: `${p.startY}vh`,
              opacity: 0,
            }}
            animate={{
              x: [`${p.startX}vw`, `${p.midX1}vw`, `${p.midX2}vw`, `${p.targetX}vw`],
              y: [`${p.startY}vh`, `${p.midY1}vh`, `${p.midY2}vh`, `${p.targetY}vh`],
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.6, 1.2, 0.85, 0.5],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#FF3B30',
              boxShadow: '0 0 5px rgba(255, 59, 48, 0.5)',
            }}
          />
        ))}

        {/* 3. Outward Cinnamon Particles (Depth of Field blur simulated) */}
        {cinnamonParticles.map((p) => (
          <motion.div
            key={`cinnamon-${p.id}`}
            initial={{
              x: `${p.startX}vw`,
              y: `${p.startY}vh`,
              opacity: 0,
            }}
            animate={{
              x: `${p.targetX}vw`,
              y: `${p.targetY}vh`,
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1.1, 0.7, 0.4],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute rounded-full ${p.blur ? 'filter blur-[1px]' : ''}`}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#C68B59',
              boxShadow: '0 0 4px rgba(198, 139, 89, 0.4)',
            }}
          />
        ))}

        {/* 4. Slow-Moving Smoke Clouds (Radial Mist) */}
        {smokeClouds.map((s) => (
          <motion.div
            key={`smoke-${s.id}`}
            initial={{
              x: `${s.startX}vw`,
              y: '105vh',
              opacity: 0,
              scale: s.scale,
            }}
            animate={{
              x: [`${s.startX}vw`, `${s.startX + (s.id % 2 === 0 ? 6 : -6)}vw`, `${s.startX}vw`],
              y: '-25vh',
              opacity: [0, s.opacity, s.opacity * 1.2, 0],
              scale: [s.scale, s.scale * 1.3, s.scale * 0.9],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full filter blur-3xl"
            style={{
              width: '35vw',
              height: '35vw',
              background: 'radial-gradient(circle, rgba(213, 160, 112, 0.2) 0%, rgba(213, 160, 112, 0.05) 50%, rgba(253, 251, 247, 0) 70%)',
            }}
          />
        ))}

      </div>

      {/* 5. Center Hero Content Area */}
      <div 
        className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: 'calc(8rem - 45px)', paddingBottom: '8rem' }}
      >
        {/* Top Badge */}
        <span className="text-[10px] sm:text-xs tracking-[0.55em] uppercase text-amber-500 font-bold mb-6 bg-[#0B0B0B] border border-amber-500/20 px-5 py-2 rounded-full">
          EST. 2026 • PREMIUM RESERVE
        </span>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-light font-serif leading-[1.05] tracking-wide text-white">
          Pure Spices, <br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
            Pure Happiness
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base max-w-2xl mt-8 leading-relaxed text-zinc-300 font-sans">
          Experience our single-origin, slow-cured reserves. Hand-harvested and sealed in protective violet-glass jars to guarantee absolute terpene lock and aroma.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto font-semibold mt-12">
          {/* SHOP NOW Button - orange gradient */}
          <button
            onClick={() => {
              setView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(217,119,6,0.15)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.3)] hover:-translate-y-0.5 cursor-pointer focus:outline-none"
          >
            SHOP NOW
          </button>
          
          {/* OUR STORY Button - outline */}
          <button
            onClick={() => {
              setView('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-10 py-4 border border-white/20 bg-transparent hover:border-white text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 cursor-pointer focus:outline-none"
          >
            OUR STORY
          </button>
        </div>
      </div>

      {/* Spacing alignment block */}
      <div className="h-10 w-full bg-transparent z-10 relative pointer-events-none" />
    </section>
  );
};

export default Hero;
