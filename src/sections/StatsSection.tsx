import { motion } from "framer-motion";
import { Clock, Truck, Shield, HeadphonesIcon } from "lucide-react";

const stats = [
  { number: "15,000+", label: "Referencias en stock", suffix: "+" },
  { number: "10+", label: "Marcas premium", suffix: "+" },
  { number: "24h", label: "Envío urgente disponible", suffix: "" },
  { number: "99.8%", label: "Pedidos a tiempo", suffix: "%" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-[#111118]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
              <div className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-xs text-[#a0a0b0]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {[
            { icon: Clock, title: "Stock Inmediato", desc: "Más de 10,000 rodamientos disponibles para envío inmediato desde Barcelona." },
            { icon: Truck, title: "Envío 24/48h", desc: "Servicio de envío exprés disponible para pedidos urgentes en toda la península." },
            { icon: Shield, title: "Garantía de Calidad", desc: "Todos los productos cuentan con certificación ISO y garantía del fabricante original." },
            { icon: HeadphonesIcon, title: "Soporte Técnico", desc: "Asistencia técnica especializada para selección de rodamientos y mantenimiento." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <item.icon className="w-6 h-6 text-[#2563eb] mb-3" />
              <h4 className="text-sm font-semibold text-[#f0f0f5] mb-2">{item.title}</h4>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
