import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import CocktailCard from "../Cocktail/CocktailCard";

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
        setCocktails([...data, ...data]);
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
    <section className="bg-brand-beige py-20 md:py-32 overflow-hidden relative border-y border-brand-black/15">
      
      <div className="mb-10 md:mb-16">
        {/* 1. EL TÍTULO (Layout Mobile: Título Izquierda, Logo/Link Derecha - IDÉNTICO A PRODUCTS) */}
        <div className="w-full max-w-360 mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* TÍTULO DINÁMICO APILADO */}
            <div className="flex flex-col items-start justify-start w-full md:w-auto z-10">
              <h2 className="font-brand-serif text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-brand-black leading-none">
                El Recetario
              </h2>
              <h2 className="font-brand-script text-5xl md:text-8xl lg:text-9xl text-brand-clay normal-case leading-[0.8] md:-mb-1 mt-2">
                Mixología
              </h2>
            </div>

            {/* Bloque Logo y Link (Se pasa a la derecha en móvil) */}
            <div className="absolute top-0 right-6 md:relative md:top-auto md:right-auto flex flex-col items-end md:items-start gap-4 md:pb-2 shrink-0 z-20">
              {/* Logo */}
              <div className="w-12 h-12 md:w-16 md:h-16 border border-brand-black/20 rounded-full flex items-center justify-center bg-brand-beige">
                <span className="font-brand-sans text-[8px] uppercase tracking-widest text-brand-black/60">
                  Logo
                </span>
              </div>

              {/* Link con estilo BallPoint idéntico */}
              <Link
                to="/mixologia"
                className="font-brand-sans uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-brand-clay text-right md:text-left leading-tight group"
              >
                <span className="underline decoration-brand-clay/40 underline-offset-4 group-hover:decoration-brand-clay transition-colors">
                  Conoce
                </span>
                <br />
                <span className="font-brand-script text-lg md:text-xl normal-case first-letter:uppercase block mt-1">
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
