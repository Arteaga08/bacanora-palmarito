import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clientAxios from "../services/axiosConfig";
import Footer from "../components/layout/Footer";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const processSteps = [
  {
    id: "01",
    title: "Cocimiento",
    subtitle: "Horno cónico de piedra",
    text: "Una vez cosechados los corazones del agave, también llamados piñas, se cuecen por 3 a 4 días en un horno de piedra cavado en el suelo y calentado con leña, cubiertos con más piedras y pencas de maguey.",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Agave_tequilana_1.jpg?width=1200",
    imgOverlay:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Agave_tequila.jpg?width=800",
    verticalText: "No. lote 005",
    // MODIFICA ESTA LÍNEA PARA CONTROLAR LA FIRMA 01
    signaturePosition: "top-1/2 -translate-y-1/2 -left-20 md:-left-45",
    stamp: true,
  },
  {
    id: "02",
    title: "Molienda",
    subtitle: "Tahona",
    text: "En un molino, también de piedra, se trituran los corazones o piñas para liberar los azúcares y obtener la pulpa, este paso es necesario para poder llevar a cabo la fermentación.",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Agave_tequilana_(5434978642).jpg?width=1200",
    imgOverlay:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mezcal_on_the_rocks.jpg?width=800",
    verticalText: "Tradición Viva",
    // MODIFICA ESTA LÍNEA PARA CONTROLAR LA FIRMA 02
    signaturePosition: "top-1/2 -translate-y-1/2 -right-20 md:-right-45",
    stamp: true,
  },
  {
    id: "03",
    title: "Fermentación",
    subtitle: "Barriles de madera",
    text: "La pulpa obtenida de la molienda se deja reposar en tinas grandes de pino o encino para que fermente. Esta parte del proceso puede durar de 3 a 5 días, es aquí donde los sabores y aromas se multiplican e intensifican.",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Tequila_barrels.jpg?width=1200",
    imgOverlay:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mezcal.jpg?width=800",
    verticalText: "Artesanal",
    // MODIFICA ESTA LÍNEA PARA CONTROLAR LA FIRMA 03
    signaturePosition: "top-1/2 -translate-y-1/2 -left-14 md:-left-33",
    stamp: true,
  },
  {
    id: "04",
    title: "Destilación",
    subtitle: "Alambique de cobre",
    text: "La masa que deriva de la fermentación se vierte en alambiques de cobre, donde se calienta, hierve, y posteriormente los vapores se condensan para dar origen al destilado como lo conocemos.",
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Tequila_Silver,_Reposado,_and_Anejo.jpg?width=1200",
    imgOverlay:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mezcal_de_la_Sierra_Norte_de_Puebla_servido_con_melón_y_chapulines.jpg?width=800",
    verticalText: "Suave al paladar",
    // MODIFICA ESTA LÍNEA PARA CONTROLAR LA FIRMA 04
    signaturePosition: "top-1/2 -translate-y-1/2 -right-22 md:-right-50",
    stamp: true,
  },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await clientAxios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error cargando el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-black flex items-center justify-center">
        <span className="font-brand-sans uppercase tracking-[0.3em] text-[10px] text-brand-beige animate-pulse">
          Cargando Experiencia...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-brand-beige flex items-center justify-center flex-col gap-6">
        <h2 className="font-brand-serif text-4xl text-brand-black">
          Destilado no encontrado
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="font-brand-sans text-[10px] uppercase border-b border-brand-black pb-1 hover:text-brand-clay transition-colors"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const vistaText =
    product.description ||
    "Destellos Plateados, acompañados de una caída lenta que se adhiere a las paredes del vaso";
  const olorText = product.ingredients?.[0] || "Notas pecanas, toronja y piña.";
  const saborText =
    product.ingredients?.[1] ||
    "Con una permanencia larga, con tintes de agave cocido, ahumado y sabores cítricos que culminan con una leve sensación astringente.";

  return (
    <main className="relative w-full bg-brand-black overflow-x-hidden flex flex-col">
      {/* 1. HERO (BOTELLA Y CATA) */}
      <div className="relative w-full min-h-svh flex flex-col shrink-0">
        <div className="absolute top-0 left-0 w-full h-svh md:h-full z-0 overflow-hidden">
          <img
            src={product.images?.displayDetail || product.images?.cardPrimary}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-brand-black/40 via-transparent to-transparent"></div>
        </div>

        <div className="relative w-full min-h-svh md:min-h-0 flex flex-col shrink-0">
          <header className="relative z-10 w-full pt-6 md:pt-8 px-6 md:px-12 pb-6 flex justify-between items-start shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 md:w-16 md:h-16 border border-brand-beige/30 rounded-full flex items-center justify-center bg-brand-black/20 backdrop-blur-md hover:bg-brand-beige transition-all group cursor-pointer z-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-brand-beige group-hover:text-brand-black transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div className="flex flex-col items-center absolute top-20 md:top-6 left-1/2 -translate-x-1/2 text-center w-full max-w-[80%]">
              <h1 className="font-brand-script text-6xl md:text-8xl lg:text-9xl text-brand-beige leading-none drop-shadow-lg">
                {product.name}
              </h1>
              <p className="font-brand-sans text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-brand-beige/80 mt-2 drop-shadow-md">
                {product.category}
              </p>
            </div>
          </header>

          <div className="absolute bottom-6 right-6 w-[85%] max-w-70 md:hidden z-20">
            <div className="bg-brand-beige p-2 shadow-2xl border border-brand-black/10">
              <div className="border border-brand-black/20 p-5 flex justify-between items-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <div className="flex flex-col relative z-10">
                  <span className="font-brand-sans text-[7px] uppercase tracking-[0.3em] text-brand-clay mb-1">
                    Adquirir / 750 ML
                  </span>
                  <span className="font-brand-serif text-3xl text-brand-black leading-none tracking-tighter">
                    ${product.price?.toLocaleString()}
                  </span>
                </div>
                <button className="relative z-10 bg-brand-black text-brand-beige px-5 py-3 flex items-center justify-center font-brand-sans text-[8px] uppercase tracking-[0.3em] hover:bg-brand-clay transition-colors border border-brand-black">
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="relative z-10 w-full max-w-400 mx-auto px-6 py-12 md:px-12 md:py-0 md:pb-12 flex flex-col md:flex-row justify-between flex-1 gap-12 md:gap-0 mt-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-75 lg:w-85 bg-brand-beige p-3 shadow-2xl md:self-center relative border border-brand-black/10"
          >
            <div className="absolute -top-10 -right-8 md:-top-12 md:-right-12 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center z-20 rotate-12">
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center relative">
                <img
                  src={logoUrl}
                  alt="Bacanora Logo"
                  className="w-12 md:w-16 object-contain -mt-1 opacity-80 invert-[.25] sepia-[.8] saturate-[5] hue-rotate-[-15deg]"
                />
                <span className="absolute bottom-3 font-brand-sans text-[5px] md:text-[6px] uppercase tracking-widest text-red-800/80">
                  Sonora, Mex.
                </span>
              </div>
            </div>
            <div className="border border-brand-black/20 p-8 md:p-10 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
              <div className="pl-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-brand-sans text-[8px] uppercase tracking-[0.3em] text-brand-clay">
                    Nº 01
                  </span>
                  <span className="h-px w-12 bg-brand-clay/50"></span>
                </div>
                <h3 className="font-brand-script text-6xl md:text-7xl text-brand-black leading-none mb-8 relative">
                  Sabor
                  <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-clay"></span>
                </h3>
                <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-widest leading-loose text-brand-black/80">
                  <span className="font-brand-serif text-6xl text-brand-clay float-left mr-4 leading-[0.7] mt-1 drop-shadow-sm">
                    {saborText.charAt(0)}
                  </span>
                  {saborText.slice(1)}
                </p>
                <div className="mt-8 pt-4 border-t border-brand-black/10 flex justify-end">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-4 md:h-6 object-contain opacity-20 -rotate-6"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-75 lg:w-85 flex flex-col gap-4 md:gap-6 md:self-center"
          >
            <div className="bg-brand-beige p-3 shadow-2xl border border-brand-black/10 relative">
              <div className="border border-brand-black/20 p-8 md:p-10 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <div className="relative z-10 pr-6 md:pr-10">
                  <h3 className="font-brand-script text-4xl text-brand-black mb-3">
                    Olor
                  </h3>
                  <p className="font-brand-sans text-[10px] uppercase tracking-widest leading-relaxed text-brand-black/70 pl-3 border-l border-brand-clay/30">
                    {olorText}
                  </p>
                </div>
                <div className="w-full relative my-8 z-10 flex items-center justify-center gap-4">
                  {/* Línea Izquierda (Crece para llenar espacio) */}
                  <div className="grow border-t border-brand-black/15"></div>

                  {/* Logo Central (Sin fondo cuadrado, solo la imagen) */}
                  <div className="shrink-0">
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-5 object-contain opacity-40 grayscale"
                    />
                  </div>

                  {/* Línea Derecha (Crece para llenar espacio) */}
                  <div className="grow border-t border-brand-black/15"></div>

                  {/* Texto lateral "Hecho en Sonora" (Mantenemos tu posición original absoluta) */}
                  <div className="absolute -right-22 md:-right-27 top-1/2 -translate-y-1/2 origin-center rotate-90 translate-x-3 md:translate-x-4">
                    <span className="font-brand-script text-2xl md:text-3xl text-brand-clay/60 whitespace-nowrap drop-shadow-sm">
                      Hecho en Sonora, Mx
                    </span>
                  </div>
                </div>
                <div className="relative z-10 pr-6 md:pr-10">
                  <h3 className="font-brand-script text-4xl text-brand-black mb-3">
                    Vista
                  </h3>
                  <p className="font-brand-sans text-[10px] uppercase tracking-widest leading-relaxed text-brand-black/70 pl-3 border-l border-brand-clay/30">
                    {vistaText}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-brand-beige p-3 shadow-2xl border border-brand-black/10">
              <div className="border border-brand-black/20 p-6 flex justify-between items-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <div className="flex flex-col relative z-10">
                  <span className="font-brand-sans text-[8px] uppercase tracking-[0.3em] text-brand-clay mb-1">
                    Adquirir / 750 ML
                  </span>
                  <span className="font-brand-serif text-3xl text-brand-black leading-none tracking-tighter">
                    ${product.price?.toLocaleString()}
                  </span>
                </div>
                <button className="relative z-10 bg-brand-black text-brand-beige px-6 py-4 flex items-center justify-center font-brand-sans text-[9px] uppercase tracking-[0.3em] hover:bg-brand-clay transition-colors border border-brand-black hover:border-brand-clay">
                  Añadir →
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* 2. PROCESO */}
      <section className="relative z-20 w-full bg-brand-beige border-t border-brand-black/20 pt-10 md:pt-16 pb-32">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full mb-4 md:mb-24 flex flex-col items-center justify-center relative py-12 overflow-hidden"
        >
          <h2 className="font-brand-serif italic text-5xl md:text-7xl lg:text-8xl text-brand-black leading-none text-center relative z-10">
            El Proceso
          </h2>
          <span className="font-brand-script text-7xl md:text-[120px] lg:text-[160px] text-brand-clay/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-3 whitespace-nowrap z-0 pointer-events-none select-none">
            Artesanal
          </span>
        </motion.div>

        <div className="max-w-350 mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-15">
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="w-full md:w-1/2 relative flex justify-center mb-10 md:mb-0">
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2 }}
                  src={step.img}
                  className="w-4/5 md:w-[95%] lg:w-full h-[40vh] md:h-[60vh] lg:h-[70vh] object-cover grayscale-30 z-10 shadow-lg"
                />
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  src={step.imgOverlay}
                  className={`absolute -bottom-8 md:-bottom-16 w-3/5 md:w-[60%] h-[25vh] md:h-[40vh] lg:h-[45vh] object-cover border-8 md:border-12 border-brand-beige shadow-2xl z-20 ${index % 2 === 0 ? "-right-2 md:-right-10" : "-left-2 md:-left-10"}`}
                />

                {/* FIRMAS: Ahora usan el valor personalizado signaturePosition definido en el arreglo */}
                {step.verticalText && (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className={`absolute font-brand-script text-4xl md:text-6xl text-brand-clay/50 -rotate-90 z-30 pointer-events-none whitespace-nowrap ${step.signaturePosition}`}
                  >
                    {step.verticalText}
                  </motion.span>
                )}

                {/* MATASELLOS */}
                {step.stamp && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1 }}
                    className={`absolute -top-6 md:-top-16 w-24 h-24 md:w-36 md:h-36 flex items-center justify-center z-40 ${index % 2 === 0 ? "-left-6 md:-left-16" : "-right-6 md:-right-16"}`}
                  >
                    <div className="w-full h-full rounded-full border border-brand-clay flex items-center justify-center bg-brand-beige shadow-xl">
                      <div className="w-[90%] h-[90%] rounded-full border border-dashed border-brand-clay/60 flex items-center justify-center relative">
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-14 md:w-20 object-contain opacity-70 invert-[.25] sepia-[.8] saturate-[5] hue-rotate-[-15deg]"
                        />
                        <span className="absolute bottom-3 md:bottom-5 font-brand-sans text-[5px] md:text-[7px] uppercase tracking-widest text-red-800/80">
                          Sonora, Mex.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="w-full md:w-1/2 flex flex-col px-4 md:px-12 lg:px-20 z-30"
              >
                <div className="flex items-end gap-3 mb-2 w-full">
                  <span className="font-brand-script text-5xl md:text-7xl text-brand-black underline decoration-brand-black/20 underline-offset-8">
                    {step.id}
                  </span>
                </div>
                <h3 className="font-brand-serif italic text-3xl md:text-6xl uppercase tracking-widest text-brand-black mb-2 mt-4">
                  {step.title}
                </h3>
                <span className="font-brand-script text-2xl md:text-4xl text-brand-clay mb-6 md:mb-10">
                  {step.subtitle}
                </span>
                <p className="font-brand-sans text-sm md:text-base lg:text-[17px] leading-[2.2] text-brand-black/80 max-w-lg border-l border-brand-clay/30 pl-4 md:pl-6">
                  {step.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ProductDetailPage;
