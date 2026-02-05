import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll } from "../../hooks/useScroll";

const Navbar = () => {
  const isScrolled = useScroll(50);
  const [isOpen, setIsOpen] = useState(false);

  // El arreglo que faltaba
  const navLinks = [
    { name: "Nuestra Historia", path: "/historia" },
    { name: "Cócteles", path: "/mixologia" },
    { name: "Bacanora", path: "/tienda" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 px-6 ${
        isScrolled ? "bg-brand-orange shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Contenedor con borde inferior dinámico */}
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between border-b transition-colors duration-500 ${
          isScrolled ? "border-brand-cream/20" : "border-brand-dark/10"
        }`}
      >
        {/* DESKTOP LINKS: Con separador a la derecha */}
        <div className="hidden md:flex gap-8 grow basis-0 py-6 border-r border-inherit">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`uppercase tracking-[0.2em] text-[10px] font-medium transition-colors hover:opacity-50 ${
                isScrolled ? "text-brand-cream" : "text-brand-dark"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* MOBILE: Hamburger */}
        <div
          className={`md:hidden grow basis-0 py-6 border-r border-inherit transition-colors ${
            isScrolled ? "text-brand-cream" : "text-brand-dark"
          }`}
        >
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        {/* LOGO: Cambia de Naranja a Crema al hacer scroll */}
        <div className="text-center px-6 md:px-10 py-4">
          <Link
            to="/"
            className={`text-2xl md:text-3xl font-serif tracking-tighter transition-colors duration-500 ${
              isScrolled ? "text-brand-cream" : "text-brand-orange"
            }`}
          >
            PALMARITO
          </Link>
        </div>

        {/* CARRITO: Con separador a la izquierda */}
        <div
          className={`flex justify-end grow basis-0 py-6 border-l border-inherit transition-colors ${
            isScrolled ? "text-brand-cream" : "text-brand-dark"
          }`}
        >
          <Link to="/carrito" className="relative group">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span
              className={`absolute -top-1 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                isScrolled
                  ? "bg-brand-cream text-brand-orange"
                  : "bg-brand-orange text-brand-cream"
              }`}
            >
              0
            </span>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU (Mantenemos la lógica de Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 bg-brand-cream text-brand-dark z-60 flex flex-col p-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <X size={30} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl uppercase tracking-tighter font-serif text-brand-orange"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
