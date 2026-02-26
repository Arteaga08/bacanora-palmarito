import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);

    setIsCartOpen(true);
  };

  return (
    <Link
      to={`/producto/${product._id}`}
      className="group block w-full border-b border-brand-black/25 md:border-b-0 md:border-r md:last:border-r-0 last:border-b-0 bg-brand-beige"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CONTENEDOR DE IMAGEN (Sin botones encima) */}
      <div className="relative aspect-3/4 w-full overflow-hidden">
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
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isHovered ? "block" : "hidden"
            }`}
          />
        )}
      </div>

      {/* SECCIÓN DE TEXTO Y BOTÓN */}
      <div className="p-6 md:px-8 md:py-6 flex flex-col">
        <p className="font-brand-script text-xl md:text-3xl text-brand-clay mb-2 opacity-90 leading-none">
          Palmarito
        </p>

        <div className="flex justify-between items-center gap-4">
          <h3 className="font-brand-serif text-2xl md:text-2xl text-brand-black uppercase tracking-tighter leading-none">
            {product.name}
          </h3>

          {/* BOTÓN QUE CONTIENE ACCIÓN + PRECIO */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-brand-black text-brand-beige px-4 py-3 rounded-sm hover:bg-brand-clay transition-colors duration-300 group/btn"
          >
            <span className="font-brand-sans text-[9px] uppercase tracking-widest border-r border-brand-beige/20 pr-2">
              Añadir
            </span>
            <div className="flex items-baseline gap-0.5 shrink-0">
              <span className="font-brand-sans text-xs md:text-sm font-bold tracking-tight leading-none">
                ${product.price?.toLocaleString("es-MX")}
              </span>
              <span className="font-brand-sans text-[8px] font-bold uppercase tracking-widest leading-none opacity-60">
                .00
              </span>
            </div>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
