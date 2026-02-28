import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clientAxios from "../services/axiosConfig";
import VidixImage from "../components/VidixImage";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const RecipePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchRecipe = async () => {
      try {
        // Como tienes slug en tu modelo, buscamos por slug
        const { data } = await clientAxios.get(`/mixology/${slug}`);
        setRecipe(data);
      } catch (error) {
        console.error("Error cargando la receta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-beige flex items-center justify-center">
        <span className="font-brand-sans uppercase tracking-[0.3em] text-[10px] text-brand-black animate-pulse">
          Mezclando ingredientes...
        </span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="w-full min-h-screen bg-brand-beige flex items-center justify-center flex-col gap-6">
        <h2 className="font-brand-serif text-4xl text-brand-black">
          Receta no encontrada
        </h2>
        <button
          onClick={() => navigate("/mixologia")}
          className="font-brand-sans text-[10px] uppercase border-b border-brand-black pb-1 hover:text-brand-clay transition-colors"
        >
          Volver a la barra
        </button>
      </div>
    );
  }

  // Desestructuramos exactamente los campos de tu Schema de Mongoose
  const { name, image, ingredients = [], preparation = "" } = recipe;

  return (
    <main className="bg-brand-beige min-h-screen relative overflow-hidden">
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="absolute top-24 md:top-32 left-6 md:left-12 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 border border-brand-black/20 rounded-full flex items-center justify-center bg-brand-beige hover:bg-brand-clay hover:border-brand-clay hover:text-brand-beige transition-all group shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-brand-black group-hover:text-brand-beige transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* COLUMNA IZQUIERDA: IMAGEN (Sin marco blanco) */}
        <div className="lg:col-span-5 relative pt-40 md:pt-48 pb-12 lg:pb-0 h-[60vh] lg:h-screen lg:sticky lg:top-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full relative shadow-2xl"
          >
            <div className="w-full h-full overflow-hidden bg-brand-black relative">
              <VidixImage
                src={image}
                alt={name}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            {/* Sello sobre la foto */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rotate-12 z-20 mix-blend-multiply">
              <img
                src={logoUrl}
                alt="Sello"
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA: RECETA Y DETALLES */}
        <div className="lg:col-span-7 flex flex-col justify-center pt-12 lg:pt-40 pb-32 lg:pl-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Título de la Receta */}
            <div className="mb-12">
              <span className="font-brand-script text-4xl md:text-5xl text-brand-clay block mb-2">
                Receta
              </span>
              <h1 className="font-brand-serif text-5xl md:text-7xl uppercase tracking-tighter text-brand-black leading-none mb-6">
                {name}
              </h1>

              {/* SUBTÍTULO: Combinando Sans y Script */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-brand-clay/50"></div>
                <span className="font-brand-script text-2xl md:text-2xl text-brand-clay block mb-2">
                  Bacanora
                </span>
              </div>
            </div>

            {/* Separador */}
            <div className="w-full border-t border-brand-black/10 my-12 relative flex items-center justify-center">
              <div className="bg-brand-beige px-4 absolute">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-6 opacity-30 grayscale"
                />
              </div>
            </div>

            {/* INGREDIENTES */}
            <div className="mb-16">
              <h3 className="font-brand-serif text-3xl md:text-4xl text-brand-black uppercase tracking-tighter mb-8">
                Ingredientes
              </h3>
              <ul className="flex flex-col gap-4">
                {ingredients.length > 0 ? (
                  ingredients.map((ing, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 font-brand-sans text-sm md:text-base text-brand-black/80 pb-3 border-b border-brand-black/5 last:border-0"
                    >
                      <span className="font-brand-script text-brand-clay text-2xl -mt-1">
                        •
                      </span>
                      <span>
                        <span className="font-bold mr-2">{ing.measure}</span>
                        {ing.item}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="font-brand-sans text-xs uppercase tracking-widest text-brand-black/50">
                    Receta secreta.
                  </p>
                )}
              </ul>
            </div>

            {/* PREPARACIÓN (Lee tu campo String del Schema) */}
            <div>
              <h3 className="font-brand-serif text-3xl md:text-4xl text-brand-black uppercase tracking-tighter mb-8">
                Preparación
              </h3>
              <div className="font-brand-sans text-sm md:text-base text-brand-black/80 leading-loose">
                {preparation ? (
                  // Usamos split('\n') por si el texto viene con saltos de línea desde tu admin
                  preparation.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="font-brand-sans text-xs uppercase tracking-widest text-brand-black/50">
                    Sigue tu instinto de mixólogo.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default RecipePage;
