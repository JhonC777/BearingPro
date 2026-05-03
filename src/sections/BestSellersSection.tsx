import { Link } from "react-router";
import { motion } from "framer-motion";
import { Star, Plus, Check } from "lucide-react";
import { localProducts } from "@/data/products";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export default function BestSellersSection() {
  const bestsellers = localProducts.filter((p) => p.bestSeller).slice(0, 8);
  const addItem = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.addItem);
  const cartItems = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.items);
  const isInCart = (id: number) => cartItems.some((i) => i.productId === id);

  const handleAdd = (product: (typeof localProducts)[0]) => {
    addItem({
      productId: product.id, sku: product.sku, name: product.name,
      price: product.price, imageUrl: product.imageUrl, slug: product.slug, brand: product.brand,
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block font-mono text-xs tracking-[0.1em] text-[#f59e0b] uppercase mb-2">Más Vendidos</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f0f0f5]">Productos Destacados</h2>
          </div>
          <Link to="/catalogo" className="hidden md:flex items-center gap-1 text-sm text-[#2563eb] hover:underline">Ver catálogo</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestsellers.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden hover:border-[rgba(37,99,235,0.3)] transition-all"
            >
              <Link to={`/producto/${product.slug}`} className="block relative bg-[#22222e] aspect-square overflow-hidden">
                <span className="absolute top-3 left-3 z-10 bg-[#f59e0b] text-[#0a0a0f] text-xs font-bold px-2 py-1 rounded">TOP</span>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </Link>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[11px] text-[#6b6b7b]">{product.sku}</span>
                  <span className="text-[10px] text-[#a0a0b0] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">{product.brand}</span>
                </div>
                <Link to={`/producto/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-[#f0f0f5] mb-2 line-clamp-2 group-hover:text-[#3b82f6] transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#22222e]"}`} />
                  ))}
                  <span className="text-[10px] text-[#6b6b7b] ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#2563eb]">€{product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={isInCart(product.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isInCart(product.id) ? "bg-[#10b981] text-white" : "bg-[#22222e] text-[#f0f0f5] hover:bg-[#2563eb]"}`}
                  >
                    {isInCart(product.id) ? <><Check className="w-3 h-3" /> Añadido</> : <><Plus className="w-3 h-3" /> Añadir</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
