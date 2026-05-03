import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck, ChevronRight } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useLocalAuthStore } from "@/stores/useLocalAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user: oauthUser } = useAuth();
  const { user: localUser } = useLocalAuthStore();
  const user = oauthUser || localUser;

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    email: user?.email || "", name: "", surname: "", company: "",
    address: "", postalCode: "", city: "", phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data: { orderNumber: string }) => {
      clearCart();
      toast.success("Pedido realizado con éxito");
      navigate(`/pedido-exito?order=${data.orderNumber}`);
    },
    onError: () => {
      // Fallback: simulate order locally
      clearCart();
      const orderNumber = `BP-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
      toast.success("Pedido realizado (modo local)");
      navigate(`/pedido-exito?order=${orderNumber}`);
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#f0f0f5] mb-2">Tu carrito está vacío</h2>
          <Link to="/catalogo" className="text-sm text-[#2563eb] hover:underline">Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice() >= 200 ? 0 : 8.5;
  const total = totalPrice() + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsProcessing(true);
    createOrder.mutate({
      items: items.map((i) => ({
        productId: i.productId, sku: i.sku, name: i.name,
        price: i.price, qty: i.qty, brand: i.brand,
      })),
      total,
      shipping,
      tax: 0,
      email: formData.email,
      name: formData.name,
      surname: formData.surname,
      company: formData.company || undefined,
      address: formData.address,
      postalCode: formData.postalCode,
      city: formData.city,
      phone: formData.phone || undefined,
    });
  };

  const inputClass = "w-full h-11 px-4 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm text-[#f0f0f5] placeholder-[#6b6b7b] outline-none focus:border-[#2563eb] transition-colors";

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[720px] mx-auto px-6 lg:px-16 py-8">
        <Link to="/carrito" className="flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#f0f0f5] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al carrito
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", step >= 1 ? "bg-[#2563eb] text-white" : "bg-[#22222e] text-[#6b6b7b]")}>1</div>
            <span className={cn("text-sm", step >= 1 ? "text-[#f0f0f5]" : "text-[#6b6b7b]")}>Envío</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6b6b7b]" />
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", step >= 2 ? "bg-[#2563eb] text-white" : "bg-[#22222e] text-[#6b6b7b]")}>2</div>
            <span className={cn("text-sm", step >= 2 ? "text-[#f0f0f5]" : "text-[#6b6b7b]")}>Pago</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-semibold text-[#f0f0f5] mb-6">Datos de envío</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Nombre *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Nombre" />
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Apellidos *</label>
                  <input type="text" required value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} className={inputClass} placeholder="Apellidos" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Empresa</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} placeholder="Nombre de empresa (opcional)" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Dirección *</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Calle, número, piso..." />
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Código Postal *</label>
                  <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className={inputClass} placeholder="08001" />
                </div>
                <div>
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Ciudad *</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass} placeholder="Barcelona" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#a0a0b0] mb-1.5">Teléfono</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+34 600 123 456" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-semibold text-[#f0f0f5] mb-6">Resumen del pedido</h2>

              <div className="bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 mb-6">
                {items.map((item: import("@/stores/useCartStore").CartItem) => (
                  <div key={item.productId} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.06)] last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-contain bg-[#22222e] rounded-lg" />
                      <div>
                        <p className="text-sm font-medium text-[#f0f0f5] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#6b6b7b]">{item.qty} x €{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#f0f0f5]">€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6">
                <div className="flex justify-between text-sm text-[#a0a0b0] mb-2">
                  <span>Subtotal</span>
                  <span>€{totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#a0a0b0] mb-2">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `€${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#f0f0f5] pt-3 border-t border-[rgba(255,255,255,0.06)]">
                  <span>Total</span>
                  <span className="text-[#2563eb]">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-[#f0f0f5] mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563eb]" /> Método de pago
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-[#22222e] rounded-xl cursor-pointer border border-[rgba(37,99,235,0.3)]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#2563eb] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                    </div>
                    <span className="text-sm text-[#f0f0f5]">Transferencia bancaria (simulado)</span>
                  </label>
                  <div className="p-3 bg-[#22222e] rounded-xl border border-[rgba(255,255,255,0.06)] opacity-50">
                    <span className="text-sm text-[#6b6b7b]">Tarjeta de crédito (próximamente)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] rounded-xl mb-6">
                <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <p className="text-xs text-[#a0a0b0]">Este es un entorno de demostración. No se procesará ningún pago real. Recibirás una confirmación de pedido simulada.</p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="flex-1 h-12 bg-[#22222e] text-[#f0f0f5] font-semibold text-sm rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all">
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className={cn("h-12 bg-[#2563eb] text-white font-semibold text-sm rounded-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-2", step === 2 ? "flex-1" : "w-full", isProcessing && "opacity-70")}
            >
              {isProcessing ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando...</>
              ) : step === 1 ? (
                <>Continuar <ChevronRight className="w-4 h-4" /></>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Confirmar pedido</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
