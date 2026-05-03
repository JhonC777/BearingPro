import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, ShoppingCart, Phone, Cog, ChevronDown, User, LogOut, Package, History
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useLocalAuthStore } from "@/stores/useLocalAuthStore";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { cn } from "@/lib/utils";

function CartPreview({ onClose }: { onClose: () => void }) {
  const { items, updateQty, removeItem, totalPrice, totalItems } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="w-10 h-10 text-[#22222e] mx-auto mb-3" />
        <p className="text-sm text-[#a0a0b0]">Tu carrito está vacío</p>
        <button
          onClick={() => { onClose(); navigate("/catalogo"); }}
          className="mt-3 text-xs text-[#2563eb] hover:underline"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 w-[360px] max-h-[480px] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#f0f0f5]">Carrito ({totalItems()})</span>
        <button onClick={onClose}><X className="w-4 h-4 text-[#6b6b7b]" /></button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 bg-[#111118] rounded-lg p-3">
            <Link to={`/producto/${item.slug}`} onClick={onClose} className="w-14 h-14 shrink-0 bg-[#22222e] rounded-lg overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/producto/${item.slug}`} onClick={onClose}>
                <h4 className="text-xs font-medium text-[#f0f0f5] line-clamp-1 hover:text-[#3b82f6] transition-colors">{item.name}</h4>
              </Link>
              <span className="text-[10px] text-[#6b6b7b]">{item.sku}</span>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-6 h-6 flex items-center justify-center bg-[#22222e] rounded text-[#f0f0f5] hover:bg-[#2563eb] transition-colors text-xs">-</button>
                  <span className="w-6 text-center text-xs font-semibold text-[#f0f0f5]">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-6 h-6 flex items-center justify-center bg-[#22222e] rounded text-[#f0f0f5] hover:bg-[#2563eb] transition-colors text-xs">+</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2563eb]">€{(item.price * item.qty).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.productId)} className="text-[#ef4444] hover:text-[#f87171]">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#a0a0b0]">Total</span>
          <span className="font-bold text-[#2563eb]">€{totalPrice().toFixed(2)}</span>
        </div>
        <button
          onClick={() => { onClose(); navigate("/carrito"); }}
          className="w-full h-10 bg-[#2563eb] text-white font-semibold text-xs rounded-xl hover:bg-[#3b82f6] transition-all"
        >
          Ver carrito completo
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.totalItems());

  const { user: oauthUser, isAuthenticated: oauthAuth, logout: oauthLogout } = useAuth();
  const { user: localUser, isAuthenticated: localAuth, logout: localLogout } = useLocalAuthStore();

  const isAuthenticated = oauthAuth || localAuth;
  const user = oauthUser || localUser;

  const { data: categories } = trpc.products.categories.useQuery(undefined, { retry: false });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsUserOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setIsCartOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserOpen(false);
      if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCategoriesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localLogout();
    oauthLogout();
    setIsUserOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Catálogo" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300",
          isScrolled
            ? "bg-[rgba(10,10,15,0.9)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]"
            : "bg-transparent"
        )}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Cog className="w-5 h-5 text-[#2563eb]" />
            <span className="font-['Space_Grotesk'] font-bold text-xl tracking-tight">
              Bearing<span className="text-[#2563eb]">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  location.pathname === link.to ? "text-[#f0f0f5]" : "text-[#a0a0b0] hover:text-[#f0f0f5]"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-[#2563eb] transition-transform duration-200 origin-left",
                    location.pathname === link.to ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
            {/* Categories Dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-[#a0a0b0] hover:text-[#f0f0f5] transition-colors"
              >
                Categorías
                <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoriesOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-2 w-[280px] bg-[rgba(17,17,24,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden shadow-2xl"
                  >
                    {(categories || []).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/catalogo?categoria=${cat.id}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(37,99,235,0.1)] transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-[#6b6b7b]">({cat.productCount})</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                "hidden md:flex items-center bg-[#22222e] rounded-xl border border-[rgba(255,255,255,0.06)] transition-all duration-300 overflow-hidden",
                isSearchOpen ? "w-[320px]" : "w-[44px]"
              )}
            >
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-[44px] h-[44px] flex items-center justify-center text-[#a0a0b0] hover:text-[#f0f0f5] shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por SKU, modelo..."
                  className="bg-transparent text-sm text-[#f0f0f5] placeholder-[#6b6b7b] outline-none w-full pr-3"
                  autoFocus
                />
              )}
            </form>

            {/* WhatsApp */}
            <a
              href="https://wa.me/34600123456?text=Hola%20BearingPro,%20necesito%20asesoramiento%20técnico"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-[44px] h-[44px] items-center justify-center rounded-xl text-[#a0a0b0] hover:text-[#10b981] hover:bg-[rgba(16,185,129,0.1)] transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Cart */}
            <div ref={cartRef} className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative flex w-[44px] h-[44px] items-center justify-center rounded-xl text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#2563eb] text-white text-[11px] font-bold rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 bg-[rgba(17,17,24,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-2xl z-50"
                  >
                    <CartPreview onClose={() => setIsCartOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className={cn(
                  "flex w-[44px] h-[44px] items-center justify-center rounded-xl transition-colors",
                  isAuthenticated
                    ? "text-[#10b981] bg-[rgba(16,185,129,0.1)]"
                    : "text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <User className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isUserOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-[220px] bg-[rgba(17,17,24,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {isAuthenticated && user ? (
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || ""} className="w-10 h-10 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-sm">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[#f0f0f5]">{user.name || "Usuario"}</p>
                            <p className="text-xs text-[#6b6b7b]">{user.email || ""}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link to="/pedidos" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            <History className="w-4 h-4" /> Mis pedidos
                          </Link>
                          <Link to="/perfil" onClick={() => setIsUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            <Package className="w-4 h-4" /> Perfil
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors">
                            <LogOut className="w-4 h-4" /> Cerrar sesión
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-sm text-[#a0a0b0] mb-3">Inicia sesión para acceder a tu cuenta</p>
                        <Link
                          to="/login"
                          onClick={() => setIsUserOpen(false)}
                          className="flex items-center justify-center gap-2 w-full h-10 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#3b82f6] transition-all"
                        >
                          <User className="w-4 h-4" /> Iniciar sesión
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserOpen(false);
                            useLocalAuthStore.getState().login({ id: 1, name: "Usuario Demo", email: "demo@bearingpro.com", role: "user" });
                          }}
                          className="mt-2 w-full text-xs text-[#6b6b7b] hover:text-[#a0a0b0] transition-colors"
                        >
                          Acceder como invitado
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex w-[44px] h-[44px] items-center justify-center rounded-xl text-[#a0a0b0] hover:text-[#f0f0f5]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-[rgba(10,10,15,0.85)] backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[320px] glass-strong border-l border-[rgba(255,255,255,0.06)] p-6 pt-24"
            >
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="flex items-center bg-[#22222e] rounded-xl border border-[rgba(255,255,255,0.06)] px-3 py-2.5">
                  <Search className="w-5 h-5 text-[#6b6b7b] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por SKU, modelo..."
                    className="bg-transparent text-sm text-[#f0f0f5] placeholder-[#6b6b7b] outline-none w-full"
                  />
                </div>
              </form>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      location.pathname === link.to
                        ? "bg-[rgba(37,99,235,0.15)] text-[#2563eb]"
                        : "text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/catalogo" className="px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  Categorías
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/pedidos" className="px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2">
                      <History className="w-4 h-4" /> Mis pedidos
                    </Link>
                    <Link to="/perfil" className="px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2">
                      <User className="w-4 h-4" /> Perfil
                    </Link>
                  </>
                )}
                <a
                  href="https://wa.me/34600123456?text=Hola%20BearingPro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#10b981] hover:bg-[rgba(16,185,129,0.1)] transition-colors mt-4"
                >
                  <Phone className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors mt-2"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
