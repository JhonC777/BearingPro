import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "Carlos Martínez", role: "Director de Producción", company: "InduMetal S.L.", text: "Excelente servicio. Los rodamientos SKF que pedimos llegaron en 24 horas y el asesoramiento técnico fue impecable." },
  { name: "Ana López", role: "Jefa de Compras", company: "Mecánica Navarra", text: "Llevamos 5 años comprando en BearingPro. Nunca nos han fallado en stock ni en calidad." },
  { name: "Miguel Sánchez", role: "Gerente", company: "MaqHerramientas", text: "La plataforma es muy intuitiva y el soporte técnico resolvió todas nuestras dudas sobre selección de rodamientos." },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="text-center mb-10">
          <span className="inline-block font-mono text-xs tracking-[0.1em] text-[#06b6d4] uppercase mb-2">Testimonios</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">Lo que dicen nuestros clientes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <Quote className="w-6 h-6 text-[#2563eb] mb-4" />
              <p className="text-sm text-[#a0a0b0] mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                <p className="text-sm font-semibold text-[#f0f0f5]">{t.name}</p>
                <p className="text-xs text-[#6b6b7b]">{t.role}, {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
