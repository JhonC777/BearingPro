import { Link } from "react-router";
import { Cog, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const productLinks = [
    { label: "Rodamientos de Bolas", to: "/catalogo?categoria=1" },
    { label: "Rodamientos de Rodillos", to: "/catalogo?categoria=2" },
    { label: "Rodamientos Cónicos", to: "/catalogo?categoria=3" },
    { label: "Rodamientos Esféricos", to: "/catalogo?categoria=4" },
    { label: "Rodamientos de Empuje", to: "/catalogo?categoria=5" },
    { label: "Rodamientos de Agujas", to: "/catalogo?categoria=6" },
  ];

  const companyLinks = [
    { label: "Sobre nosotros", to: "#" },
    { label: "Certificaciones", to: "#" },
    { label: "Términos y condiciones", to: "#" },
    { label: "Política de privacidad", to: "#" },
  ];

  return (
    <footer className="bg-[#111118] border-t border-[rgba(255,255,255,0.06)] pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Cog className="w-5 h-5 text-[#2563eb]" />
              <span className="font-['Space_Grotesk'] font-bold text-lg tracking-tight text-[#f0f0f5]">
                Bearing<span className="text-[#2563eb]">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-[#a0a0b0] mb-5">Precisión en movimiento desde 1985</p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] text-[#a0a0b0] hover:text-[#2563eb] hover:bg-[rgba(37,99,235,0.1)] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://wa.me/34600123456" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] text-[#a0a0b0] hover:text-[#10b981] hover:bg-[rgba(16,185,129,0.1)] transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:info@bearingpro.com" className="w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] text-[#a0a0b0] hover:text-[#f0f0f5] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#f0f0f5] mb-4 uppercase tracking-wider">Productos</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#a0a0b0] hover:text-[#2563eb] hover:translate-x-1 transition-all inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#f0f0f5] mb-4 uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[#a0a0b0] hover:text-[#2563eb] hover:translate-x-1 transition-all inline-block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#f0f0f5] mb-4 uppercase tracking-wider">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <span className="text-sm text-[#a0a0b0] font-mono">info@bearingpro.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <span className="text-sm text-[#a0a0b0] font-mono">+34 600 123 456</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2563eb] mt-0.5 shrink-0" />
                <span className="text-sm text-[#a0a0b0]">Pol. Ind. Norte, C/ Metalurgia 18<br />08020 Barcelona, España</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6b7b]">© 2024 BearingPro Industrial. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#6b6b7b] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full">ISO 9001:2015</span>
            <span className="text-xs text-[#6b6b7b]">Made with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
