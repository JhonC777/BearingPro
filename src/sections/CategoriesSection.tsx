import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, CircleDot, Grip, Cone, Circle, ArrowDownToDot, AlignJustify } from "lucide-react";
import { categories } from "@/data/products";

const iconMap: Record<string, React.ElementType> = {
  CircleDot, Grip, Cone, Circle, ArrowDownToDot, AlignJustify,
};

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5] mb-2">Categorías Industriales</h2>
            <p className="text-sm text-[#a0a0b0]">Especialistas en todo tipo de rodamientos de precisión</p>
          </div>
          <Link to="/catalogo" className="hidden md:flex items-center gap-1 text-sm text-[#2563eb] hover:underline">
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || CircleDot;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/catalogo?categoria=${cat.id}`}
                  className="group flex items-start gap-4 p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl hover:border-[rgba(37,99,235,0.3)] transition-all duration-300"
                >
                  <div className="w-12 h-12 shrink-0 bg-[rgba(37,99,235,0.1)] rounded-xl flex items-center justify-center group-hover:bg-[rgba(37,99,235,0.2)] transition-colors">
                    <Icon className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#f0f0f5] mb-1 group-hover:text-[#3b82f6] transition-colors">{cat.name}</h3>
                    <p className="text-xs text-[#a0a0b0] mb-2 line-clamp-2">{cat.description}</p>
                    <span className="text-xs text-[#6b6b7b]">{cat.productCount} productos</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
