import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import clientAxios from "../../services/axiosConfig";

const HomeProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await clientAxios.get("/products");
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error cargando selección:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="bg-brand-beige pb-0">
      {/* 0. DIVISIÓN EDITORIAL */}
      <div className="w-full border-t border-brand-black/10"></div>

      <div className="pt-20 md:pt-32">
        {/* 1. EL TÍTULO (Layout Mobile: Título Izquierda, Logo/Link Derecha) */}
        <div className="w-full max-w-360 mx-auto px-6 mb-8 md:mb-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            {/* Título Dinámico (Lo primero que se ve en la izquierda) */}
            <div className="flex flex-col items-start justify-start w-full md:w-auto z-10">
              <h2 className="font-brand-serif text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-brand-black leading-none">
                Nuestra
              </h2>
              <h2 className="font-brand-script text-5xl md:text-8xl lg:text-9xl text-brand-clay normal-case leading-[0.8] md:-mb-1 mt-2">
                Selección
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

              {/* Link con "Bacanora" en BallPoint */}
              <Link
                to="/tienda"
                className="font-brand-sans uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-brand-clay text-right md:text-left leading-tight group"
              >
                <span className="underline decoration-brand-clay/40 underline-offset-4 group-hover:decoration-brand-clay transition-colors">
                  CONOCE EL
                </span>
                <br />
                <span className="font-brand-script text-lg md:text-xl normal-case first-letter:uppercase block mt-1">
                  Bacanora
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. IMAGEN DE ESTILO DE VIDA */}
        <div className="w-full max-w-360 mx-auto px-6">
          <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
            <img
              src="https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp"
              alt="Colección Palmarito"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3. BARRA DE TEXTO (Caja única en mobile estilo Fulgencio) */}
        <div className="w-full border-t border-b border-brand-black/20 mt-10 md:mt-16 bg-brand-beige">
          <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-3 md:divide-x divide-brand-black/20">
            <div className="py-6 md:py-8 px-6 flex items-center justify-center md:justify-start text-center md:text-left">
              <span className="font-brand-sans uppercase tracking-[0.2em] text-xs md:text-sm lg:text-base text-brand-clay font-medium italic">
                Destilado Artesanal
              </span>
            </div>

            <div className="py-2 md:py-8 px-6 flex items-center justify-center text-center">
              <span className="font-brand-sans uppercase tracking-[0.2em] text-xs md:text-sm lg:text-base text-brand-clay font-bold italic">
                100% Agave
              </span>
            </div>

            <div className="py-6 md:py-8 px-6 flex items-center justify-center md:justify-end text-center">
              <span className="font-brand-sans uppercase tracking-[0.2em] text-xs md:text-sm lg:text-base text-brand-clay font-bold italic">
                Desde La Sierra de Sonora
              </span>
            </div>
          </div>
        </div>

        {/* 4. CONTENEDOR DEL GRID DE PRODUCTOS */}
        <div className="w-full border-b border-brand-black/20">
          <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;
