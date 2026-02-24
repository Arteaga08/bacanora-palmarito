import { Link } from "react-router-dom";
// Cambiamos Lucide por Phosphor Icons
import {
  X,
  InstagramLogo,
  FacebookLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

// =========================================
// ASSETS
// =========================================
const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const MobileMenu = ({ isOpen, onClose, navLinks }) => {
  // DIRECCIÓN: DE IZQUIERDA A DERECHA
  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 bg-brand-beige text-brand-black z-60 flex flex-col h-screen overflow-hidden"
        >
          {/* HEADER: Botón X (Izq) y Logo (Der) */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-brand-black/5">
            {/* IZQUIERDA: Botón Cerrar */}
            <button
              onClick={onClose}
              className="text-brand-black hover:text-brand-clay transition-colors"
            >
              <motion.div
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X size={28} weight="thin" />
              </motion.div>
            </button>

            {/* DERECHA: Logo Real Palmarito */}
            <div className="flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Palmarito Logo"
                className="w-10 object-contain opacity-80"
              />
            </div>
          </div>

          {/* CUERPO: LINKS */}
          <motion.div
            variants={contentVariants}
            className="flex flex-col justify-center items-center grow gap-12 relative z-10"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={itemVariants}>
                <Link
                  to={link.path}
                  onClick={onClose}
                  className="flex flex-col items-center group text-center"
                >
                  <span className="font-brand-script text-2xl text-brand-clay mb-1 opacity-90 tracking-[0.2em]">
                    Palmarito
                  </span>
                  <span className="text-4xl md:text-5xl uppercase tracking-widest font-brand-serif text-brand-black group-hover:text-brand-clay transition-colors leading-none">
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* FOOTER: Redes y el Bloque Palmarito */}
          <motion.div
            variants={itemVariants}
            className="mt-auto relative w-full pb-12 px-6"
          >
            {/* Redes Sociales con Phosphor Icons */}
            <div className="flex justify-center gap-8 mb-10">
              <a
                href="#"
                className="text-brand-black hover:text-brand-clay transition-colors hover:scale-110 duration-300"
              >
                <InstagramLogo size={40} weight="thin" />
              </a>
              <a
                href="#"
                className="text-brand-black hover:text-brand-clay transition-colors hover:scale-110 duration-300"
              >
                <FacebookLogo size={40} weight="thin" />
              </a>
              <a
                href="#"
                className="text-brand-black hover:text-brand-clay transition-colors hover:scale-110 duration-300"
              >
                <EnvelopeSimple size={40} weight="thin" />
              </a>
            </div>

            {/* BLOQUE DE IDENTIDAD */}
            <div className="flex flex-col items-center opacity-40">
              {/* Mini logo sobre el nombre */}
              <img src={logoUrl} alt="Sello" className="w-6 mb-2 opacity-60" />
              <span className="font-brand-script text-3xl leading-none text-brand-clay">
                Palmarito
              </span>
              <span className="font-brand-serif text-[10px] tracking-[0.4em] uppercase mt-2 text-brand-black">
                Sonora, MX
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
