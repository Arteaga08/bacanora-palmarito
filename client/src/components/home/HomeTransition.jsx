import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const HomeTransition = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Movimientos Parallax
  const yBg = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yScript = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-brand-black flex items-center justify-center"
    >
      {/* 1. LOGO (Esquina Superior Izquierda) */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 z-20 flex flex-col gap-4">
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
          <img
            src={logoUrl}
            alt="Logo Bacanora"
            /* Eliminamos invert, sepia, grayscale y opacity */
            className="w-10 md:w-12 object-contain"
          />
        </div>
        {/* Espacio extra por si quieres bajar el texto 'CONOCE EL BACANORA' aquí también */}
      </div>

      {/* 2. FONDO (Sube al hacer scroll) */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/transition-cocktails.webp"
          alt="Esencia del Bacanora"
          className="w-full h-[120%] object-cover opacity-50 scale-105"
        />
      </motion.div>

      {/* 3. TEXTO CENTRADO (Efecto Flotante) */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6"
      >
        <span className="font-brand-sans uppercase tracking-[0.6em] text-[10px] md:text-xs text-brand-beige/50 mb-8 block">
          Magia Sonorense
        </span>

        <h2 className="font-brand-serif text-5xl md:text-7xl lg:text-[110px] text-brand-beige uppercase tracking-tighter leading-[0.8] max-w-6xl">
          Donde el fuego se <br />
          <motion.span
            style={{ y: yScript }}
            className="font-brand-script normal-case text-brand-clay text-7xl md:text-9xl lg:text-[160px] block mt-4"
          >
            Vuelve elixir
          </motion.span>
        </h2>
      </motion.div>
    </section>
  );
};

export default HomeTransition;
