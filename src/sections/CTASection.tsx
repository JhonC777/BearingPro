import { Link } from "react-router";
import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(10,10,15,0.95) 60%)", backdropFilter: "blur(30px)" }} />
      <div className="absolute inset-0 mesh-grid opacity-20" />
      <div className="relative z-10 max-w-[720px] mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5] mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-sm text-[#a0a0b0] mb-6">Nuestro equipo de ingenieros te ayudará a identificar el rodamiento exacto que necesitas. Envío en 24/48h.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/catalogo" className="flex items-center gap-2 px-6 h-11 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#3b82f6] transition-all">
              Explorar Catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/34600123456?text=Hola%20BearingPro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 h-11 border border-[rgba(255,255,255,0.15)] text-[#f0f0f5] text-sm font-semibold rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all">
              <Phone className="w-4 h-4" /> Contactar Asesor
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
