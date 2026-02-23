import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";
// Datos de prueba
const initialInstagramFeed = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/djtetdac1/image/upload/v1771533021/Captura_de_pantalla_2026-02-19_a_la_s_2.29.50_p.m._gbnmmf.png",
    link: "#",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/djtetdac1/image/upload/v1771533021/Captura_de_pantalla_2026-02-19_a_la_s_2.29.29_p.m._mxpnay.png",

    link: "#",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/djtetdac1/image/upload/v1771533020/Captura_de_pantalla_2026-02-19_a_la_s_2.29.58_p.m._oeah3e.png",
    link: "#",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/djtetdac1/image/upload/v1771533020/Captura_de_pantalla_2026-02-19_a_la_s_2.29.41_p.m._lnj9va.png",
    link: "#",
  },
];

const HomeInstagram = () => {
  const marqueeText = Array(15).fill("@BACANORAPALMARITO");

  const [feed, setFeed] = useState([]);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    // Duplicamos el arreglo para que el "truco" de infinito funcione al arrastrar
    setFeed([
      ...initialInstagramFeed,
      ...initialInstagramFeed,
      ...initialInstagramFeed,
      ...initialInstagramFeed,
    ]);
  }, []);

  // MOTOR DE LOOP (Vigila cuando arrastras para teletransportar la tira sin que lo notes)
  useAnimationFrame(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth;
      const halfWidth = containerWidth / 2;
      let currentX = x.get();

      // Si arrastras muy a la izquierda o muy a la derecha, reinicia la posición invisiblemente
      if (currentX <= -halfWidth) {
        x.set(currentX + halfWidth);
      } else if (currentX > 0) {
        x.set(currentX - halfWidth);
      }
    }
  });

  return (
    <section className="bg-brand-sand pb-0 overflow-hidden relative">
      {/* 0. CINTA INFINITA DE TEXTO (Esta sí se mueve sola) */}
      <div className="w-full border-t border-b border-brand-black py-2 md:py-3 overflow-hidden flex bg-brand-black">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          <div className="flex gap-8 px-4">
            {marqueeText.map((text, i) => (
              <span
                key={`first-${i}`}
                className="font-brand-sans text-[10px] md:text-xs uppercase tracking-widest text-brand-sand font-medium"
              >
                {text}
              </span>
            ))}
          </div>
          <div className="flex gap-8 px-4">
            {marqueeText.map((text, i) => (
              <span
                key={`second-${i}`}
                className="font-brand-sans text-[10px] md:text-xs uppercase tracking-widest text-brand-sand font-medium"
              >
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ESPACIO COMPACTO */}
      {/* CABECERA (Con espacios ajustados para respirar en móvil) */}
      <div className="pt-12 md:pt-32 mb-12 md:mb-16">
        <div className="w-full max-w-360 mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* 1. TÍTULO: Quitamos el -mt-8 para que baje y respire del borde superior */}
            <div className="flex flex-col items-start justify-start w-full md:w-auto z-10">
              <h2 className="font-brand-serif text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-brand-black leading-none">
                Sobre
              </h2>
              <h2 className="font-brand-script text-5xl md:text-7xl lg:text-8xl text-brand-black normal-case leading-[0.8] md:-mb-1 mt-1">
                Nosotros
              </h2>
            </div>

            {/* 2. BLOQUE DERECHO: Bajamos un poco con top-2 y le damos gap-2 para separar logo de texto */}
            <div className="absolute top-2 right-6 md:relative md:top-auto md:right-auto flex flex-col items-end md:items-start gap-1 md:gap-0 md:pb-2 shrink-0 z-20">
              {/* 3. LOGO: Limpio, sin círculo de fondo ni bordes (como en tu captura) */}
              <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-end md:justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt="Bacanora Logo"
                  className="w-8 md:w-10 object-contain grayscale opacity-60"
                />
              </div>

              {/* 4. LINK */}
              <a
                href="https://www.instagram.com/bacanorapalmarito/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-brand-sans uppercase tracking-[0.2em] text-[8px] md:text-[9px] text-brand-black text-right md:text-left leading-tight group"
              >
                <span>SÍGUENOS EN</span>
                <br />
                <span className="font-brand-script text-base md:text-lg normal-case first-letter:uppercase block underline decoration-brand-clay/40 underline-offset-4 group-hover:decoration-brand-clay transition-colors mt-1">
                  @palmarito
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 5. PÁRRAFO DESCRIPTIVO: Cambiamos mt-6 por mt-12 para separarlo de "Nosotros" */}
        <div className="w-full max-w-360 mx-auto px-6 mt-12 md:mt-10">
          <p className="font-brand-sans text-[10px] md:text-xs text-brand-black/70 uppercase tracking-widest leading-relaxed max-w-lg border-l border-brand-clay pl-4">
            Compartimos el día a día de nuestra destilería, la tierra de Sonora
            y el arte detrás de cada gota de nuestro Bacanora. Únete a nuestra
            comunidad.
          </p>
        </div>
      </div>

      {/* 3. CARRUSEL INFINITO MANUAL */}
      <div className="w-full border-y border-brand-black/15 overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -10000, right: 10000 }} // Límites gigantes para que no haya rebote
          dragElastic={0} // Movimiento 1:1 con el cursor/dedo
          className="flex w-max cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {feed.map((post, index) => (
            <a
              key={`${post.id}-${index}`}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square shrink-0 w-[70vw] md:w-[33vw] lg:w-[25vw] overflow-hidden block border-r border-brand-black/15"
            >
              <img
                src={post.image}
                alt="Instagram Post Palmarito"
                className="w-full h-full object-cover grayscale-30 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <span className="font-brand-sans text-[9px] md:text-[10px] text-brand-beige uppercase tracking-[0.3em] border border-brand-beige/30 px-4 py-2 text-center">
                  Ver en IG
                </span>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeInstagram;
