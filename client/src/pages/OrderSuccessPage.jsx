import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const OrderSuccessPage = () => {
  // Asegurarnos de que la página inicie hasta arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-brand-black flex flex-col justify-between">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Fondo decorativo (Logo gigante con opacidad muy baja) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[80%] opacity-5 pointer-events-none flex justify-center">
          <img
            src={logoUrl}
            alt="Fondo Palmarito"
            className="w-full object-contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          {/* Icono de Éxito (SVG Nativo, ya no depende de librerías externas) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-brand-clay/30 bg-brand-clay/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(180,83,9,0.2)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-brand-clay"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </motion.div>

          <h1 className="font-brand-serif text-5xl md:text-7xl text-brand-beige tracking-tighter mb-4">
            Reserva Confirmada
          </h1>

          <p className="font-brand-sans text-[11px] md:text-xs uppercase tracking-[0.3em] text-brand-beige/60 mb-8 leading-relaxed">
            Tu pago ha sido procesado con éxito.{" "}
            <br className="hidden md:block" />
            Hemos enviado los detalles de tu orden al correo registrado.
          </p>

          <div className="w-full h-px bg-linear-to-r from-transparent via-brand-clay/50 to-transparent my-8"></div>

          <h2 className="font-brand-script text-4xl md:text-5xl text-brand-clay mb-10 drop-shadow-sm">
            Tu Bacanora está en camino
          </h2>

          <Link
            to="/tienda"
            className="group relative inline-flex items-center justify-center px-10 py-5 font-brand-sans text-[10px] uppercase tracking-[0.3em] text-brand-black bg-brand-beige hover:bg-white transition-colors overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Volver a la Colección
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};

export default OrderSuccessPage;
