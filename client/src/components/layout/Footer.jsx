import { Link } from "react-router-dom";
// Cambiamos Lucide por Phosphor Icons para mantener consistencia con el menú
import { InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

// Arreglo con los nombres y las rutas reales de tu App.jsx
const navLinks = [
  { name: "Nuestra Historia", path: "/historia" },
  { name: "Bacanora", path: "/tienda" },
  { name: "Cócteles", path: "/mixologia" },
  { name: "Contacto", path: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-brand-clay text-brand-beige pt-24 pb-0 relative overflow-hidden">
      {/* 1. EL SELLO FLOTANTE (Top Right) */}
      <div className="absolute top-0 right-6 md:right-20 -translate-y-1/3 z-10">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-clay flex items-center justify-center border-4 border-brand-black shadow-xl overflow-hidden">
          <img
            src={logoUrl}
            alt="Sello Bacanora"
            className="w-14 md:w-16 object-contain brightness-0"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-0">
        {/* 2. LINKS DE NAVEGACIÓN (Conectados al Router) */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="font-brand-sans uppercase tracking-[0.2em] text-xs md:text-sm hover:text-brand-black transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. LEGALES (Pendientes por ahora) */}
        <div className="flex gap-6 mb-16 opacity-40">
          <Link
            to="#"
            className="font-brand-sans uppercase text-[10px] tracking-widest hover:opacity-100 transition-opacity"
          >
            Aviso de Privacidad
          </Link>
          <Link
            to="#"
            className="font-brand-sans uppercase text-[10px] tracking-widest hover:opacity-100 transition-opacity"
          >
            Términos de Uso
          </Link>
        </div>

        {/* 4. REDES SOCIALES (Usando Phosphor Icons) */}
        <div className="flex flex-col items-center gap-4 mb-20">
          <span className="font-brand-sans uppercase tracking-[0.2em] text-sm">
            Contacta Con Nosotros
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-brand-black transition-colors hover:scale-110 duration-300"
            >
              <InstagramLogo size={28} weight="thin" />
            </a>
            <a
              href="#"
              className="hover:text-brand-black transition-colors hover:scale-110 duration-300"
            >
              <EnvelopeSimple size={28} weight="thin" />
            </a>
          </div>
        </div>
      </div>

      {/* 5. TEXTO MASIVO (PALMARITO) */}
      <div className="w-full flex justify-center overflow-hidden leading-none select-none pointer-events-none">
        <h1 className="font-brand-serif text-[18vw] text-brand-black opacity-100 tracking-tighter transform translate-y-[10%]">
          PALMARITO
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
