import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQty, removeItem, totalPrice, totalItems, clearCart } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-[#22222e] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#f0f0f5] mb-2">Tu carrito está vacío</h2>
          <p className="text-sm text-[#a0a0b0] mb-6">Explora nuestro catálogo y encuentra los mejores rodamientos industriales.</p>
          <Link to="/catalogo" className="inline-flex items-center gap-2 px-6 h-11 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#3b82f6] transition-all">
            <Package className="w-4 h-4" /> Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#f0f0f5]">Tu Carrito ({totalItems()})</h1>
          <button onClick={() => { clearCart(); toast.success("Carrito vaciado"); }} className="flex items-center gap-2 text-sm text-[#ef4444] hover:text-[#f87171] transition-colors">
            <Trash2 className="w-4 h-4" /> Vaciar carrito
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item: import("@/stores/useCartStore").CartItem, i: number) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl"
            >
              <Link to={`/producto/${item.slug}`} className="w-20 h-20 shrink-0 bg-[#22222e] rounded-xl overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/producto/${item.slug}`}>
                  <h3 className="text-sm font-semibold text-[#f0f0f5] hover:text-[#3b82f6] transition-colors line-clamp-1">{item.name}</h3>
                </Link>
                <span className="text-xs text-[#6b6b7b] font-mono">{item.sku}</span>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-8 h-8 flex items-center justify-center bg-[#22222e] rounded-lg text-[#f0f0f5] hover:bg-[#2563eb] transition-colors text-xs">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[#f0f0f5]">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-8 h-8 flex items-center justify-center bg-[#22222e] rounded-lg text-[#f0f0f5] hover:bg-[#2563eb] transition-colors text-xs">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#2563eb]">€{(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => { removeItem(item.productId); toast.success("Producto eliminado"); }} className="text-[#ef4444] hover:text-[#f87171] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
          <div className="flex justify-between text-sm text-[#a0a0b0] mb-2">
            <span>Subtotal</span>
            <span>€{totalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#a0a0b0] mb-4">
            <span>Envío (gratis &gt;€200)</span>
            <span>{totalPrice() >= 200 ? "Gratis" : "€8.50"}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#f0f0f5] pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <span>Total</span>
            <span className="text-[#2563eb]">€{(totalPrice() >= 200 ? totalPrice() : totalPrice() + 8.5).toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 h-12 bg-[#2563eb] text-white font-semibold text-sm rounded-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-2"
          >
            Proceder al pago <ArrowRight className="w-4 h-4" />
          </button>
          <Link to="/catalogo" className="block text-center mt-3 text-xs text-[#6b6b7b] hover:text-[#a0a0b0] transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
