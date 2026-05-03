import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Shield, Package, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocalAuthStore } from "@/stores/useLocalAuthStore";

export default function Profile() {
  const { user: oauthUser } = useAuth();
  const { user: localUser } = useLocalAuthStore();
  const user = oauthUser || localUser;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-[72px] flex items-center justify-center px-6">
        <div className="text-center">
          <User className="w-12 h-12 text-[#22222e] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#f0f0f5] mb-2">Inicia sesión para ver tu perfil</h2>
          <Link to="/login" className="inline-flex items-center gap-2 mt-4 px-6 h-11 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#3b82f6] transition-all">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[720px] mx-auto px-6 lg:px-16 py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#f0f0f5] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || ""} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-xl">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-[#f0f0f5]">{user.name || "Usuario"}</h1>
              <p className="text-sm text-[#a0a0b0]">{user.email || ""}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[rgba(37,99,235,0.1)] text-[#2563eb] text-[10px] font-semibold rounded uppercase tracking-wider">
                {user.role || "user"}
              </span>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[rgba(37,99,235,0.1)] rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#2563eb]" />
                </div>
                <span className="text-sm font-semibold text-[#f0f0f5]">Email</span>
              </div>
              <p className="text-sm text-[#a0a0b0]">{user.email || "No disponible"}</p>
            </div>
            <div className="p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[rgba(16,185,129,0.1)] rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="text-sm font-semibold text-[#f0f0f5]">Seguridad</span>
              </div>
              <p className="text-sm text-[#a0a0b0]">Cuenta verificada</p>
            </div>
            <div className="p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[rgba(245,158,11,0.1)] rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <span className="text-sm font-semibold text-[#f0f0f5]">Pedidos</span>
              </div>
              <Link to="/pedidos" className="text-sm text-[#2563eb] hover:underline flex items-center gap-1">
                Ver historial <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
            <div className="p-5 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[rgba(139,92,246,0.1)] rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <span className="text-sm font-semibold text-[#f0f0f5]">Direcciones</span>
              </div>
              <p className="text-sm text-[#a0a0b0]">Gestiona tus direcciones de envío</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
