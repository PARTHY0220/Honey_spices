import { useState, useEffect, useRef } from 'react';
import heroImg from '../assets/hero.webp';
import turmericImg from '../assets/turmeric_jar.webp';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate how far the section is scrolled through the viewport (0 to 1)
      const scrollRange = viewHeight + rect.height;
      const scrollProgress = (viewHeight - rect.top) / scrollRange;
      
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        // Map to translation offsets (-120px to 120px)
        setParallaxY((scrollProgress - 0.5) * 240);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-6 bg-transparent overflow-hidden"
    >
      {/* Dynamic Parallax Spice Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Decorative Golden Star Anise SVG */}
        <div
          style={{
            transform: `translateY(${parallaxY * 0.4}px) rotate(${parallaxY * 0.08}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="absolute top-12 left-[8%] w-32 h-32 text-amber-500/10 opacity-70"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M50 15 L55 35 L75 30 L60 45 L80 60 L58 58 L50 85 L42 58 L20 60 L40 45 L25 30 L45 35 Z" />
            <path d="M50 35 L50 65 M35 50 L65 50" strokeWidth="0.5" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
          </svg>
        </div>

        {/* Decorative Floating Cinnamon Bark SVG */}
        <div
          style={{
            transform: `translateY(${parallaxY * -0.3}px) rotate(${parallaxY * -0.05}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="absolute bottom-16 right-[10%] w-40 h-40 text-amber-500/10 opacity-60"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M30 20 C45 10, 65 10, 70 25 C75 40, 55 50, 60 70 C65 85, 45 90, 30 80 C15 70, 20 40, 30 20" />
            <path d="M25 25 C38 17, 58 17, 62 30 C66 42, 48 50, 52 68 C56 80, 38 85, 25 75" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Decorative Aromatic Wave SVG */}
        <div
          style={{
            transform: `translateY(${parallaxY * 0.15}px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="absolute top-1/2 right-[5%] w-64 h-32 text-amber-500/[0.05]"
        >
          <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M10 80 Q 50 20, 100 80 T 190 20" />
            <path d="M10 60 Q 50 10, 100 60 T 190 10" opacity="0.5" />
            <path d="M10 40 Q 50 0, 100 40 T 190 0" opacity="0.2" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Premium Editorial Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className="text-[10px] tracking-[0.45em] uppercase text-amber-400 font-bold mb-4 block">
            ABOUT L'ÉPICE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-wider font-light text-white leading-tight mb-8">
            A Century-Old Devotion to <br />
            <span className="italic font-normal text-amber-400">Pure Terroir</span> & Aromatic Alchemy
          </h2>
          <div className="w-12 h-[1px] bg-amber-500/40 mb-8"></div>

          <div className="space-y-6 text-zinc-300 text-sm tracking-wide leading-relaxed font-light mb-12">
            <p>
              Founded in 1926 as a small trading house on the volcanic slopes of Malabar, L'ÉPICE has spent the last century redefining the boundary of culinary seasonings. We believe that a spice is not just an ingredient, but a snapshot of geological time, rainfall, and traditional farm craftsmanship.
            </p>
            <p>
              Our agronomists partner exclusively with single-family micro-farms using biodynamic methods. By preserving ancient cultivation rituals, slow-curing under monitored solar beds, and sealing each batch in protective violet glass at the harvest origin, we prevent delicate essential oils from fading.
            </p>
          </div>

          {/* Metric Stats Section */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
            <div>
              <span className="text-2xl sm:text-3xl font-serif text-amber-400 font-bold">48+</span>
              <p className="text-[9px] tracking-wider uppercase text-zinc-400 mt-1 font-mono">
                Micro-Estates
              </p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif text-amber-400 font-bold">100%</span>
              <p className="text-[9px] tracking-wider uppercase text-zinc-400 mt-1 font-mono">
                Single-Origin
              </p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-serif text-amber-400 font-bold">96%</span>
              <p className="text-[9px] tracking-wider uppercase text-zinc-400 mt-1 font-mono">
                Terpene Lock
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Overlapping Parallax Image Layout */}
        <div className="lg:col-span-5 relative flex justify-center items-center mt-12 lg:mt-0">
          {/* Main Portrait Card (Moves slightly upwards on scroll) */}
          <div
            style={{
              transform: `translateY(${parallaxY * 0.1}px)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="w-[280px] sm:w-[320px] h-[400px] sm:h-[450px] border border-white/10 p-2 bg-neutral-900/40 backdrop-blur-sm relative z-10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="w-full h-full overflow-hidden border border-white/5 bg-neutral-950 relative">
              <img
                src={heroImg}
                alt="Spice heritage sourcing"
                className="w-full h-full object-cover filter brightness-[0.8] hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/50 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Overlapping Landscape Card */}
          <div
            style={{
              transform: `translateY(${parallaxY * -0.15}px)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="absolute bottom-[-40px] left-[0px] sm:left-[-20px] w-[200px] sm:w-[240px] h-[160px] sm:h-[190px] border border-amber-500/20 p-1.5 bg-neutral-900/80 backdrop-blur-md z-20 shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="w-full h-full overflow-hidden border border-white/5 bg-neutral-950">
              <img
                src={turmericImg}
                alt="Turmeric spice cure"
                className="w-full h-full object-cover filter brightness-[0.8] hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
