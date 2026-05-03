import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Package, Clock, Award } from "lucide-react";

function ParticleDust() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1.5, duration: Math.random() * 20 + 20, delay: Math.random() * 10,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const heroStats = [
    { icon: Package, value: "10,000+", label: "SKUs" },
    { icon: Clock, value: "48h", label: "Envío" },
    { icon: Award, value: "ISO 9001", label: "Certificación" },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url(/assets/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(17,17,24,0.7) 50%, rgba(37,99,235,0.15) 100%)" }} />
      <div className="absolute inset-0 z-[1] mesh-grid opacity-40" />
      <ParticleDust />
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30 hidden md:block" style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37,99,235,0.15), transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-[720px] mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block font-mono text-xs tracking-[0.1em] text-[#06b6d4] uppercase mb-6">Rodamientos Industriales de Alto Rendimiento</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-['Space_Grotesk'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] mb-6 text-gradient">
          La Fuerza que Mueve tu Industria
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-base sm:text-lg text-[#a0a0b0] max-w-[560px] mx-auto mb-8 leading-relaxed">
          Más de 10,000 referencias de rodamientos de precisión. Envío inmediato desde stock. Asistencia técnica especializada.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/catalogo" className="flex items-center gap-2 px-7 h-12 bg-[#2563eb] text-white font-semibold text-sm rounded-xl hover:bg-[#3b82f6] transition-all duration-200 hover:scale-[1.02] glow-blue">
            Explorar Catálogo <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="https://wa.me/34600123456?text=Hola%20BearingPro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-7 h-12 border border-[rgba(255,255,255,0.15)] text-[#f0f0f5] font-semibold text-sm rounded-xl hover:bg-[rgba(37,99,235,0.1)] hover:border-[#2563eb] transition-all duration-200">
            <Phone className="w-4 h-4" /> Contactar Asesor
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex items-center justify-center gap-6 sm:gap-10">
          {heroStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-[#2563eb]" />
              <div className="text-left">
                <div className="font-mono text-sm sm:text-base font-bold text-[#f0f0f5]">{stat.value}</div>
                <div className="text-xs text-[#6b6b7b] uppercase tracking-wider">{stat.label}</div>
              </div>
              {i < heroStats.length - 1 && <div className="hidden sm:block w-px h-8 bg-[rgba(255,255,255,0.1)] ml-4" />}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-[2]" />
    </section>
  );
}
