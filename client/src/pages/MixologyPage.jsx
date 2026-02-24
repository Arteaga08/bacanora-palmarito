import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clientAxios from "../services/axiosConfig";
import CocktailCard from "../components/Cocktail/CocktailCard";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const MixologyPage = () => {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const { data } = await clientAxios.get("/mixology");
        setCocktails(data);
      } catch (error) {
        console.error("Error cargando los cócteles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCocktails();
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-beige flex items-center justify-center">
        <span className="font-brand-sans uppercase tracking-[0.3em] text-[10px] text-brand-black animate-pulse">
          Preparando la barra...
        </span>
      </div>
    );
  }

  return (
    // Agregamos la textura de papel al fondo para darle un look más orgánico
    <main className="bg-brand-beige min-h-screen pt-32 pb-24 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
      {/* DETALLE EDITORIAL FLOTANTE  */}
      <div className="hidden lg:block absolute left-8 top-1/3 -rotate-90 origin-left opacity-30 pointer-events-none z-0">
        <span className="font-brand-script normal-case text-4xl md:text-5xl text-brand-clay/50">
          Espíritu Sonorense
        </span>
      </div>

      {/* HEADER */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="max-w-5xl mx-auto text-center mb-16 md:mb-24 relative z-10"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-px bg-brand-clay/50"></div>
          <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] md:text-xs text-brand-clay font-bold">
            Rituales de Consumo
          </span>
          <div className="w-8 h-px bg-brand-clay/50"></div>
        </div>

        <h1 className="font-brand-serif text-6xl md:text-8xl lg:text-[110px] uppercase tracking-tighter text-brand-black leading-none mb-4 relative inline-block">
          El Recetario <br className="md:hidden" />
          <span className="font-brand-script text-brand-clay normal-case text-7xl md:text-9xl lg:text-[130px] absolute -bottom-8 md:-bottom-12 -right-4 md:-right-12">
            Palmarito
          </span>
        </h1>

        <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 max-w-lg mx-auto mt-16 md:mt-20 leading-relaxed border-l border-r border-brand-clay/30 px-6">
          Descubre nuevas formas de disfrutar nuestro destilado. Recetas
          diseñadas para exaltar las notas de agave, humo y tierra.
        </p>

        {/* Sello Decorativo (Ajustado para que se vea más integrado) */}
        <div className="absolute -top-10 md:top-0 right-0 md:-right-10 w-24 h-24 md:w-32 md:h-32 opacity-15 pointer-events-none rotate-15">
          <img
            src={logoUrl}
            alt="Sello"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
      </motion.div>

      {/* DIVISOR ELEGANTE ANTES DEL GRID */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 mb-16 opacity-30">
        <div className="h-px bg-brand-black grow"></div>
        <img src={logoUrl} alt="Separador" className="w-6 md:w-8 grayscale" />
        <div className="h-px bg-brand-black grow"></div>
      </div>

      {/* GRID CON TUS TARJETAS */}
      {/* 1. Aquí agregué justify-items-center para centrar las columnas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16 relative z-10 justify-items-center">
        {cocktails.map((drink, index) => (
          <motion.div
            key={drink._id || drink.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            // 2. Aquí aseguramos que el wrapper de la tarjeta se centre en su espacio
            className="w-full flex justify-center"
          >
            {/* AQUÍ RENDERIZAMOS TU COMPONENTE INTACTO */}
            <CocktailCard cocktail={drink} />
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default MixologyPage;
