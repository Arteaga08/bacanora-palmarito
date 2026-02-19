import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CocktailCard = ({ cocktail }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cocktail) return null;

  return (
    <div
      className="relative w-100 y h-140 cursor-pointer perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d will-change-transform"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        /* RESPETAMOS TUS VELOCIDADES */
        transition={{ type: "spring", stiffness: 150, damping: 25, mass: 1.2 }}
      >
        {/* --- CARA FRONTAL (Estilo Product Card) --- */}
        <div className="absolute inset-0 backface-hidden bg-brand-beige border border-brand-black/15 flex flex-col">
          <div className="relative grow overflow-hidden">
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Bloque de texto igual a los productos */}
          <div className="p-6 flex flex-col bg-brand-beige border-t border-brand-black/15">
            <p className="font-brand-script text-xl text-brand-clay mb-1 opacity-90 leading-none">
              Signature
            </p>
            <h3 className="font-brand-serif text-2xl text-brand-black uppercase tracking-tighter leading-none">
              {cocktail.name}
            </h3>
          </div>
        </div>

        {/* --- CARA TRASERA (Receta en Caja Dark) --- */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-brand-black p-8 flex flex-col border border-brand-black/15">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-brand-serif text-2xl text-brand-beige uppercase leading-tight tracking-tighter">
              {cocktail.name}
            </h3>
            <span className="font-brand-script text-2xl text-brand-clay">
              B.
            </span>
          </div>

          <div className="grow">
            <p className="font-brand-sans text-[9px] uppercase tracking-[0.3em] text-brand-clay mb-6 font-bold">
              Ingredientes
            </p>
            <ul className="space-y-4">
              {cocktail.ingredients?.slice(0, 4).map((ing, i) => (
                <li
                  key={i}
                  className="flex flex-col border-b border-brand-beige/10 pb-2"
                >
                  <span className="font-brand-sans text-[10px] text-brand-beige/90 uppercase tracking-widest">
                    {ing.item}
                  </span>
                  <span className="font-brand-script text-lg text-brand-clay mt-1">
                    {ing.measure}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to={`/mixologia/${cocktail.slug}`}
            className="mt-6 font-brand-sans text-[9px] uppercase tracking-[0.4em] text-brand-beige/50 border-t border-brand-beige/10 pt-6 hover:text-brand-clay transition-colors text-center"
          >
            Ver Preparación Completa
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CocktailCard;
