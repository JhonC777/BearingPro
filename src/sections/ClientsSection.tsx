import { motion } from "framer-motion";
import { Factory, Wind, Car, Apple, Wrench } from "lucide-react";

const clients = [
  { name: "InduMetal S.L.", sector: "Metalurgia", icon: Factory },
  { name: "Mecánica Navarra", sector: "Automoción", icon: Car },
  { name: "MaqHerramientas", sector: "Maquinaria", icon: Wrench },
  { name: "Alimentación del Norte", sector: "Alimentación", icon: Apple },
  { name: "Eólica Catalana", sector: "Energía", icon: Wind },
];

export default function ClientsSection() {
  return (
    <section className="py-12 bg-[#111118]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="text-center mb-8">
          <p className="text-xs text-[#6b6b7b] uppercase tracking-wider">Empresas que confían en nosotros</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {clients.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[rgba(255,255,255,0.05)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(37,99,235,0.1)] transition-colors">
                <c.icon className="w-5 h-5 text-[#6b6b7b] group-hover:text-[#2563eb] transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#a0a0b0] group-hover:text-[#f0f0f5] transition-colors">{c.name}</p>
                <p className="text-[10px] text-[#6b6b7b]">{c.sector}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
