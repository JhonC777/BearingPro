import { Link } from "react-router";
import { motion } from "framer-motion";
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useLocalAuthStore } from "@/stores/useLocalAuthStore";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Pendiente", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  confirmed: { label: "Confirmado", color: "#2563eb", bg: "rgba(37,99,235,0.1)", icon: CheckCircle },
  shipped: { label: "Enviado", color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: Truck },
  delivered: { label: "Entregado", color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
};

export default function Orders() {
  const { isAuthenticated: oauthAuth } = useAuth();
  const { isAuthenticated: localAuth } = useLocalAuthStore();
  const isAuthenticated = oauthAuth || localAuth;

  const { data: orders, isLoading } = trpc.orders.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-[72px] flex items-center justify-center px-6">
        <div className="text-center">
          <Package className="w-12 h-12 text-[#22222e] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#f0f0f5] mb-2">Inicia sesión para ver tus pedidos</h2>
          <Link to="/login" className="inline-flex items-center gap-2 mt-4 px-6 h-11 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#3b82f6] transition-all">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const mockOrders = orders || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-16 py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#f0f0f5] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <h1 className="text-2xl font-bold text-[#f0f0f5] mb-8">Mis Pedidos</h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[#22222e] mx-auto mb-4" />
            <p className="text-sm text-[#a0a0b0]">Aún no has realizado ningún pedido.</p>
            <Link to="/catalogo" className="inline-block mt-4 text-sm text-[#2563eb] hover:underline">Hacer mi primer pedido</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm font-bold text-[#2563eb]">{order.orderNumber}</span>
                        <span className="text-xs text-[#6b6b7b]">{new Date(order.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: status.bg }}>
                          <StatusIcon className="w-3 h-3" style={{ color: status.color }} />
                          <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#f0f0f5]">€{order.total.toFixed(2)}</span>
                      <span className="block text-xs text-[#6b6b7b]">{order.items?.length || 0} productos</span>
                    </div>
                  </div>
                  <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                    <div className="space-y-2">
                      {(order.items || []).slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-[#a0a0b0]">{item.qty}x {item.name}</span>
                          <span className="text-[#f0f0f5] font-medium">€{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
