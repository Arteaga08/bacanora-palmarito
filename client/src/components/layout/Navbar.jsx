import { useState } from "react";
import { Link } from "react-router-dom";
import { ListIcon, ShoppingCartSimpleIcon } from "@phosphor-icons/react";
import { useScroll } from "../../hooks/useScroll";
import MobileMenu from "./MobileMenu";

// 🌟 1. IMPORTAMOS EL MODAL Y EL CONTEXTO
import CartModal from "../home/CartModal";
import { useCart } from "../../context/CartContext"; // Verifica que la ruta a tu context sea correcta

const Navbar = () => {
  const isScrolled = useScroll(50);
  const [isOpen, setIsOpen] = useState(false);

  // 🌟 2. ESTADO DEL MODAL Y DATOS DEL CARRITO
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart(); // Extraemos la cantidad de productos

  const navLinks = [
    { name: "Nuestra Historia", path: "/historia" },
    { name: "Bacanora", path: "/tienda" },
    { name: "Cócteles", path: "/mixologia" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 px-6 ${
          isScrolled ? "bg-brand-clay shadow-lg" : "bg-transparent"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between border-b transition-colors duration-500 ${
            isScrolled ? "border-brand-beige/20" : "border-brand-black/10"
          }`}
        >
          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-8 grow basis-0 py-6 border-r border-inherit">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-brand-sans uppercase tracking-[0.3em] text-[11px] font-medium transition-colors hover:opacity-50 ${
                  isScrolled ? "text-brand-beige" : "text-brand-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* MOBILE: Hamburger */}
          <div
            className={`md:hidden grow basis-0 py-6 border-r border-inherit transition-colors ${
              isScrolled ? "text-brand-beige" : "text-brand-black"
            }`}
          >
            <button onClick={() => setIsOpen(true)}>
              <ListIcon size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* LOGO */}
          <div className="text-center px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-center">
            <Link
              to="/"
              className={`flex flex-col md:flex-row items-center gap-0 md:gap-3 transition-colors duration-500 ${
                isScrolled ? "text-brand-beige" : "text-brand-clay"
              }`}
            >
              <span className="font-brand-serif text-2xl md:text-3xl tracking-tighter leading-none uppercase">
                P a l m a r i t o
              </span>
              <span className="font-brand-script text-2xl md:text-3xl capitalize leading-none">
                Bacanora
              </span>
            </Link>
          </div>

          {/* 🌟 3. CARRITO MODIFICADO */}
          <div
            className={`flex justify-end grow basis-0 py-6 border-l border-inherit transition-colors ${
              isScrolled ? "text-brand-beige" : "text-brand-black"
            }`}
          >
            {/* Cambiamos el Link por un button para abrir el Modal */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative group focus:outline-none"
            >
              <ShoppingCartSimpleIcon size={20} strokeWidth={1} />

              {/* Solo mostramos la burbuja si hay algo en el carrito */}
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-2 text-[8px] font-brand-sans w-4 h-4 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                    isScrolled
                      ? "bg-brand-beige text-brand-clay"
                      : "bg-brand-clay text-brand-beige"
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* COMPONENTE MÓVIL SEPARADO */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={navLinks}
      />

      {/* 🌟 4. RENDERIZAMOS EL MODAL AQUÍ */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
