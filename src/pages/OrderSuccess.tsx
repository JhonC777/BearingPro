import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderNumber = params.get("order") || "BP-" + Date.now();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-[480px]">
        <div className="w-20 h-20 bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#10b981]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f0f0f5] mb-3">¡Pedido Confirmado!</h1>
        <p className="text-sm text-[#a0a0b0] mb-6">Tu pedido ha sido procesado correctamente. Recibirás un email con los detalles de envío.</p>

        <div className="bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#6b6b7b]">Número de pedido</span>
            <span className="text-sm font-mono font-bold text-[#2563eb]">{orderNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#a0a0b0]">
            <Package className="w-4 h-4 text-[#f59e0b]" />
            <span>Envío estimado: 24-48h laborables</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/pedidos" className="flex items-center justify-center gap-2 h-12 bg-[#2563eb] text-white font-semibold text-sm rounded-xl hover:bg-[#3b82f6] transition-all">
            <ShoppingBag className="w-4 h-4" /> Ver mis pedidos
          </Link>
          <Link to="/catalogo" className="flex items-center justify-center gap-2 h-12 bg-[#22222e] text-[#f0f0f5] font-semibold text-sm rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all">
            Seguir comprando <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
