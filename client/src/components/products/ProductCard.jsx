import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/producto/${product._id}`}
      /* 1. Quitamos el padding de aquí para que la imagen toque los bordes */
      /* Mantenemos los bordes sutiles para la separación en móvil */
      className="group block w-full border-b border-brand-black/25 md:border-b-0 md:border-r md:last:border-r-0 last:border-b-0 bg-brand-beige"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CONTENEDOR DE IMAGEN (Full Bleed) */}
      {/* Usamos aspect-[3/4] o aspect-[4/5] dependiendo de qué tan altas quieras las cajas */}
      <div className="relative aspect-3/4 w-full overflow-hidden">
        {/* 2. Regresamos a object-cover para llenar el espacio */}
        <img
          src={product.images.cardPrimary}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isHovered ? "hidden" : "block"
          }`}
        />
        {product.images.cardHover && (
          <img
            src={product.images.cardHover}
            alt={`${product.name} lifestyle`}
            className={`absolute inset-0 w-full h-full object-cover ${
              isHovered ? "block" : "hidden"
            }`}
          />
        )}
      </div>

      {/* 3. TEXTO CON PADDING PROPIO */}
      {/* Agregamos p-6 md:p-8 aquí para que el texto respire dentro de la caja */}
      <div className="p-6 md:px-8 md:py-6 flex flex-col">
        {/* Categoría: Sutil arriba */}
        <p className="font-brand-script text-xl md:text-3xl text-brand-clay mb-2 opacity-90 leading-none">
          Palmarito
        </p>

        {/* Bloque inferior: Nombre y Precio alineados */}
        <div className="flex justify-between items-end gap-4">
          <h3 className="font-brand-serif text-2xl md:text-2xl text-brand-black uppercase tracking-tighter leading-none">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-0.5 shrink-0">
            <span className="font-brand-sans text-lg md:text-base text-brand-clay font-bold tracking-tight leading-none">
              ${product.price?.toLocaleString("es-MX")}
            </span>
            <span className="font-brand-sans text-[10px] md:text-[8px] text-brand-clay/60 font-bold uppercase tracking-widest leading-none">
              .00
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
