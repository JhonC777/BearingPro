import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import {
  ChevronLeft, Star, Plus, Minus, Check, ShoppingCart,
  Phone, Package, ShieldCheck, Truck, BarChart3, Heart
} from "lucide-react";
import { localProducts, getProductBySlug } from "@/data/products";
import { useCartStore } from "@/stores/useCartStore";
import { trpc } from "@/providers/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "applications" | "shipping">("specs");

  const { data: trpcProduct } = trpc.products.bySlug.useQuery({ slug: slug || "" }, { retry: false, enabled: !!slug });
  const product = trpcProduct || getProductBySlug(slug || "") || localProducts[0];

  const addItem = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.addItem);
  const cartItems = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.items);
  const isInCart = cartItems.some((i) => i.productId === product.id);

  const related = localProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id, sku: product.sku, name: product.name,
        price: product.price, imageUrl: product.imageUrl, slug: product.slug, brand: product.brand,
      });
    }
    toast.success(`${qty}x ${product.name} añadido al carrito`);
  };

  const specs = product.specs || {};
  const stockLevel = product.stock > 100 ? "high" : product.stock > 20 ? "medium" : "low";
  const stockColor = stockLevel === "high" ? "#10b981" : stockLevel === "medium" ? "#f59e0b" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6b6b7b] mb-6">
          <Link to="/" className="hover:text-[#a0a0b0]">Inicio</Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <Link to="/catalogo" className="hover:text-[#a0a0b0]">Catálogo</Link>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-[#a0a0b0]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#22222e] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-8">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#6b6b7b] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">{product.sku}</span>
              <span className="text-xs text-[#a0a0b0] bg-[rgba(37,99,235,0.1)] px-2 py-1 rounded text-[#2563eb]">{product.brand}</span>
              <span className="text-xs text-[#a0a0b0] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">{product.category}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#f0f0f5] mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < Math.floor(product.rating) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#22222e]"}`} />
                ))}
              </div>
              <span className="text-sm text-[#a0a0b0]">{product.rating} ({product.reviewCount} reseñas)</span>
            </div>

            <p className="text-sm text-[#a0a0b0] mb-6 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stockColor }} />
              <span className="text-sm font-medium" style={{ color: stockColor }}>
                {stockLevel === "high" ? "En stock (más de 100 unidades)" : stockLevel === "medium" ? "Stock limitado" : "¡Últimas unidades!"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#2563eb]">€{product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-lg text-[#6b6b7b] line-through">€{product.oldPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Qty + Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center bg-[#22222e] rounded-xl border border-[rgba(255,255,255,0.06)]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] rounded-l-xl transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-[#f0f0f5]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-11 h-11 flex items-center justify-center text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] rounded-r-xl transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isInCart}
                className={cn("flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold transition-all", isInCart ? "bg-[#10b981] text-white" : "bg-[#2563eb] text-white hover:bg-[#3b82f6]")}
              >
                {isInCart ? <><Check className="w-4 h-4" /> Añadido</> : <><ShoppingCart className="w-4 h-4" /> Añadir al carrito</>}
              </button>

              <a
                href={`https://wa.me/34600123456?text=Hola%20BearingPro,%20me%20interesa%20el%20rodamiento%20${encodeURIComponent(product.sku)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-11 px-5 border border-[#10b981] text-[#10b981] rounded-xl text-sm font-semibold hover:bg-[rgba(16,185,129,0.1)] transition-all"
              >
                <Phone className="w-4 h-4" /> WhatsApp
              </a>

              <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#22222e] border border-[rgba(255,255,255,0.06)] text-[#a0a0b0] hover:text-[#ef4444] hover:border-[rgba(239,68,68,0.3)] transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <Truck className="w-4 h-4 text-[#2563eb]" />
                <span className="text-xs text-[#a0a0b0]">Envío 24/48h</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span className="text-xs text-[#a0a0b0]">Garantía oficial</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <Package className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-xs text-[#a0a0b0]">Stock real</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-6 border-b border-[rgba(255,255,255,0.06)] mb-6">
            {[
              { id: "specs" as const, label: "Especificaciones Técnicas", icon: BarChart3 },
              { id: "applications" as const, label: "Aplicaciones", icon: Package },
              { id: "shipping" as const, label: "Envío y Devolución", icon: Truck },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2", activeTab === tab.id ? "border-[#2563eb] text-[#2563eb]" : "border-transparent text-[#a0a0b0] hover:text-[#f0f0f5]")}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "specs" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)]">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-[rgba(17,17,24,0.5)]" : "bg-transparent"}>
                        <td className="px-6 py-3.5 text-[#a0a0b0] font-medium w-[40%]">{key}</td>
                        <td className="px-6 py-3.5 text-[#f0f0f5]">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "applications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(product.tags) && (product.tags as string[]).map((tag: string) => (
                  <div key={tag} className="flex items-center gap-3 p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                    <Package className="w-5 h-5 text-[#2563eb]" />
                    <span className="text-sm text-[#f0f0f5] capitalize">{tag.replace(/-/g, " ")}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-[600px]">
              <div className="p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <h4 className="text-sm font-semibold text-[#f0f0f5] mb-2">Envío Estándar</h4>
                <p className="text-xs text-[#a0a0b0]">Entrega en 24-48 horas laborables. Gratis en pedidos superiores a €200.</p>
              </div>
              <div className="p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <h4 className="text-sm font-semibold text-[#f0f0f5] mb-2">Envío Urgente</h4>
                <p className="text-xs text-[#a0a0b0]">Entrega en 24 horas. Disponible para pedidos antes de las 14:00h.</p>
              </div>
              <div className="p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                <h4 className="text-sm font-semibold text-[#f0f0f5] mb-2">Devoluciones</h4>
                <p className="text-xs text-[#a0a0b0]">30 días para devoluciones sin preguntas. Producto sin usar y en embalaje original.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-[rgba(255,255,255,0.06)]">
            <h3 className="text-lg font-semibold text-[#f0f0f5] mb-6">Productos relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link key={p.id} to={`/producto/${p.slug}`} className="group bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden hover:border-[rgba(37,99,235,0.3)] transition-all">
                  <div className="bg-[#22222e] aspect-square overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-[#6b6b7b] font-mono">{p.sku}</span>
                    <h4 className="text-sm font-semibold text-[#f0f0f5] mt-1 line-clamp-1 group-hover:text-[#3b82f6] transition-colors">{p.name}</h4>
                    <span className="text-sm font-bold text-[#2563eb] mt-2 block">€{p.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
