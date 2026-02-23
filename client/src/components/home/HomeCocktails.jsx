import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import CocktailCard from "../Cocktail/CocktailCard";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const HomeCocktails = () => {
  const [cocktails, setCocktails] = useState([]);

  // Referencias para la magia del Drag Infinito
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const { data } = await clientAxios.get("/mixology");
        setCocktails([...data, ...data, ...data, ...data]);
      } catch (error) {
        console.error("Error cargando mixología:", error);
      }
    };
    fetchCocktails();
  }, []);

  // MOTOR DE MOVIMIENTO Y LOOP (Intacto)
  useAnimationFrame((time, delta) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth;
      const halfWidth = containerWidth / 2;
      let currentX = x.get();

      if (currentX <= -halfWidth) {
        x.set(currentX + halfWidth);
      } else if (currentX > 0) {
        x.set(currentX - halfWidth);
      }

      if (!isHovered && !isDragging) {
        x.set(currentX - delta * 0.03);
      }
    }
  });

  return (
    <section className="bg-brand-beige py-10 md:py-32 overflow-hidden relative border-y border-brand-black/15">
      <div className="w-full relative z-30 flex items-center">
        <div className="w-full border-t border-brand-black/20"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-brand-beige ">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-8 object-contain opacity-40 grayscale"
          />
        </div>
      </div>

      {/* 1. SEPARACIÓN DEL CONTENEDOR (Igualamos a pt-27) */}
      <div className="pt-27 md:pt-32 mb-10 md:mb-16">
        {/* TITULO Y BLOQUE DERECHO */}
        <div className="w-full max-w-360 mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* TÍTULO: Agregamos -mt-8 para subirlo independientemente en móvil */}
            <div className="flex flex-col items-start justify-start w-full md:w-auto z-10 -mt-8 md:mt-0">
              <h2 className="font-brand-serif text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-brand-black leading-none">
                El Recetario
              </h2>
              <h2 className="font-brand-script text-5xl md:text-8xl lg:text-9xl text-brand-clay normal-case leading-[0.8] md:-mb-1 mt-2">
                Mixología
              </h2>
            </div>

            {/* BLOQUE DERECHO: Cambiamos gap-4 por gap-0 para pegar el logo al texto */}
            <div className="absolute top-0 right-6 md:relative md:top-auto md:right-auto flex flex-col items-end md:items-start gap-0 md:pb-2 shrink-0 z-20">
              {/* Logo (Sin filtros para mantener el color Clay) */}
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-brand-beige overflow-hidden">
                <img
                  src={logoUrl}
                  alt="Bacanora Logo"
                  className="w-8 md:w-10 object-contain"
                />
              </div>

              {/* Link: Eliminamos el mt-1 para que el texto suba y se pegue al círculo */}
              <Link
                to="/mixologia"
                className="font-brand-sans uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-brand-clay text-right md:text-left leading-tight group"
              >
                {/* Texto superior sin subrayado */}
                <span>Conoce</span>
                <br />
                {/* El subrayado ahora vive aquí abajo */}
                <span className="font-brand-script text-lg md:text-xl normal-case first-letter:uppercase block underline decoration-brand-clay/40 underline-offset-4 group-hover:decoration-brand-clay transition-colors">
                  El Recetario
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CARRUSEL ARRASTRABLE (Draggable - Intacto) */}
      <div className="flex relative border-t border-b border-brand-black/15 overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -10000, right: 10000 }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex w-max cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {cocktails.map((cocktail, index) => (
            <div
              key={`${cocktail._id}-${index}`}
              className="shrink-0 border-r border-brand-black/15"
            >
              <CocktailCard cocktail={cocktail} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeCocktails;
