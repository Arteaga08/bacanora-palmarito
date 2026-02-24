import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clientAxios from "../services/axiosConfig";
import ProductCard from "../components/products/ProductCard";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

// Usamos una imagen de muestra para la portada de la tienda
const portadaTienda =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const { data } = await clientAxios.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Error cargando los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-beige flex items-center justify-center">
        <span className="font-brand-sans uppercase tracking-[0.3em] text-[10px] text-brand-black animate-pulse">
          Descorchando catálogo...
        </span>
      </div>
    );
  }

  return (
    <main className="bg-brand-beige min-h-screen overflow-hidden relative pb-0">
      {/* =========================================
          0. HERO DE PORTADA (EXACTO AL DE HISTORIA)
      ========================================= */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={portadaTienda}
            alt="Portada Tienda"
            className="w-full h-full object-cover grayscale-20"
          />
          <div className="absolute inset-0 bg-brand-black/50"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative z-10 flex flex-col items-center px-6"
        >
          <img
            src={logoUrl}
            alt="Logo Palmarito"
            className="w-20 md:w-32 mb-8"
          />
          <h1 className="font-brand-sans uppercase tracking-[0.4em] text-xs md:text-sm text-brand-beige drop-shadow-md text-center">
            Nuestros Destilados
          </h1>
        </motion.div>
      </section>

      {/* =========================================
          1. CABECERA DEL CATÁLOGO (INTRODUCCIÓN)
      ========================================= */}
      <section className="pt-24 md:pt-32 pb-16 px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-5xl mx-auto text-center"
        >
          <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] md:text-xs text-brand-clay font-bold mb-6 block">
            Catálogo Oficial
          </span>
          <h2 className="font-brand-serif text-5xl md:text-7xl lg:text-[100px] uppercase tracking-tighter text-brand-black leading-none mb-4">
            La Colección <br className="md:hidden" />
            <span className="font-brand-script text-brand-clay normal-case text-6xl md:text-8xl lg:text-[120px] -ml-2 md:-ml-8 relative top-2 md:-top-4">
              Sonorense
            </span>
          </h2>
          <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 max-w-lg mx-auto mt-16 md:mt-20 leading-relaxed border-l border-r border-brand-clay/30 px-6">
            Doble destilación en alambique de cobre, hecho a mano bajo el sol
            implacable de la sierra.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          2. GRID DE PRODUCTOS (SEAMLESS GRID)
      ========================================= */}
      <section className="w-full border-t border-brand-black/25 relative z-10 bg-brand-beige">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. SECCIÓN DE RESPIRO (ANTES DEL FOOTER)
      ========================================= */}
      <section className="w-full py-24 md:py-32 bg-brand-beige flex flex-col items-center justify-center relative border-t border-brand-black/10 overflow-hidden">
        {/* Fondo sutil para conectar con el footer */}
        <div className="absolute inset-0 opacity-50"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          <img
            src={logoUrl}
            alt="Separador"
            className="w-12 md:w-16 opacity-30 grayscale mb-6"
          />
          <h3 className="font-brand-script text-4xl md:text-5xl text-brand-clay/80 leading-none">
            Espíritu Indomable
          </h3>
          <span className="font-brand-sans uppercase tracking-[0.4em] text-[8px] md:text-[10px] text-brand-black/40 mt-6 block">
            100% Agave Pacífica
          </span>
        </motion.div>
      </section>
    </main>
  );
};

export default ShopPage;
