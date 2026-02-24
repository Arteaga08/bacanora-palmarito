import React from "react";
import { motion } from "framer-motion";

// =========================================
// ASSETS & VARIABLES (Links seguros de prueba)
// =========================================
const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const images = {
  portada:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  hero: "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  agave1:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  clandestino:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  horno:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  sierraFull:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  botella:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
  procesoPalmarito:
    "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp",
};

// =========================================
// 🎯 CONTROL DE FIRMAS Y SELLOS
// =========================================
const stamps = {
  selloAgave: logoUrl,
  selloRevista: logoUrl,
  selloClandestino: logoUrl,
  selloBotella: logoUrl,
  selloProceso: logoUrl,
  firmaProceso: logoUrl,
  logoCierre: logoUrl,
};

// 🎯 CONTROL DE TEXTOS VERTICALES (Firmas laterales en las fotos)
const sideSignatures = {
  cap1: "Crecimiento Lento",
  cap2: "Resistencia",
  cap3: "Orgullo Sonorense",
  cap4: "Tradición Viva",
};

const HistoryPage = () => {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <main className="bg-brand-beige min-h-screen overflow-hidden relative pb-0">
      {/* =========================================
          0. HERO DE PORTADA (FULL SCREEN)
      ========================================= */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={images.portada}
            alt="Portada Historia"
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
          <h1 className="font-brand-sans uppercase tracking-[0.4em] text-xs md:text-sm text-brand-beige drop-shadow-md">
            Nuestra Historia
          </h1>
        </motion.div>
      </section>

      {/* =========================================
          1. CABECERA PRINCIPAL (EL TÍTULO DEL ARTÍCULO)
      ========================================= */}
      <section className="pt-24 md:pt-40 pb-12 md:pb-24 px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-5xl mx-auto text-center"
        >
          <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] md:text-xs text-brand-clay font-bold mb-6 block">
            El Legado Sonorense
          </span>
          <h1 className="font-brand-serif text-6xl md:text-8xl lg:text-[120px] uppercase tracking-tighter text-brand-black leading-none mb-4">
            Sangre <br className="md:hidden" />
            <span className="font-brand-script text-brand-clay normal-case text-7xl md:text-9xl lg:text-[140px] -ml-2 md:-ml-8 relative top-2 md:-top-4">
              del desierto
            </span>
          </h1>
          <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 max-w-lg mx-auto mt-16 md:mt-20 leading-relaxed border-l border-r border-brand-clay/30 px-6">
            Una historia de resistencia, clandestinidad y el carácter indomable
            del agave pacífica.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          2. CAPÍTULO 01: INTRO Y FOTO ÚNICA
      ========================================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative mb-16 md:mb-32 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-5 flex flex-col justify-center lg:pr-8"
        >
          {/* NÚMERO SUBRAYADO */}
          <div className="flex items-end mb-4 md:mb-6 w-full">
            <span className="font-brand-script text-5xl md:text-6xl text-brand-black underline decoration-brand-black/20 underline-offset-8">
              01
            </span>
          </div>
          <h2 className="font-brand-script text-5xl md:text-6xl text-brand-black -mb-2 relative z-10 mt-2">
            Raíces
          </h2>
          <h2 className="font-brand-serif text-4xl md:text-5xl text-brand-clay leading-none uppercase tracking-tighter mb-6 relative z-0">
            De Piedra
          </h2>
          <p className="font-brand-sans text-[11px] md:text-xs tracking-[0.15em] uppercase text-brand-black/80 leading-loose mb-6 border-l border-brand-clay/30 pl-4">
            Todo comienza con el Agave Angustifolia Haw, conocido en Sonora como
            agave Pacífica. Una planta que desafía las sequías y el calor
            extremo, acumulando los azúcares y minerales de la tierra roja
            durante años antes de estar lista para la jima. (TEXTO MUESTRA).
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-7 relative"
        >
          <div className="relative overflow-hidden w-full h-[50vh] md:h-[65vh]">
            <img
              src={images.agave1}
              alt="Agave Pacífica"
              className="w-full h-full object-cover grayscale-30 transition-transform duration-[3s] hover:scale-105"
            />
          </div>
          {/* FIRMA LATERAL */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -left-28 md:left-150 font-brand-script text-4xl md:text-5xl text-brand-clay/50 -rotate-90 z-30 pointer-events-none whitespace-nowrap"
          >
            {sideSignatures.cap1}
          </motion.span>
          <motion.div
            variants={fadeUpVariant}
            className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-8 w-24 h-24 md:w-36 md:h-36 z-20 pointer-events-none -rotate-12"
          >
            <img
              src={stamps.selloAgave}
              alt="Sello"
              className="w-full h-full object-contain mix-blend-multiply opacity-70"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          3. SECCIÓN SUPERPUESTA
      ========================================= */}
      <section className="max-w-7xl mx-auto px-6 relative mb-16 md:mb-32 z-10">
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-end md:block">
          <div
            className="absolute top-4 left-0 md:top-1/4 md:-left-12 md:-rotate-180 z-30"
            style={{ writingMode: "horizontal-tb" }}
          >
            <span className="font-brand-script text-3xl md:text-4xl text-brand-beige md:text-brand-black/40 tracking-widest drop-shadow-md md:drop-shadow-none md:[writing-mode:vertical-rl]">
              El arte de la paciencia
            </span>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="absolute right-0 top-0 w-full md:w-3/4 h-full md:h-[70vh] overflow-hidden"
          >
            <img
              src={images.horno}
              alt="Proceso"
              className="w-full h-full object-cover grayscale-10"
            />
            <div className="absolute inset-0 bg-brand-black/20 md:bg-transparent"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute left-4 md:left-10 bottom-4 md:bottom-0 w-[55%] md:w-[45%] h-[40vh] md:h-[55vh] border-4 md:border-8 border-brand-beige overflow-hidden shadow-2xl"
          >
            <img
              src={images.hero}
              alt="Tierra"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute left-[50%] bottom-[20%] md:left-[40%] md:bottom-[10%] w-24 h-24 md:w-32 md:h-32 rotate-12 z-20 mix-blend-multiply"
          >
            <img
              src={stamps.selloRevista}
              alt="Sello"
              className="w-full h-full object-contain grayscale"
            />
          </motion.div>
        </div>
      </section>

      {/* =========================================
          4. CAPÍTULO 02: LA CLANDESTINIDAD
      ========================================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative mb-16 md:mb-32 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-7 relative order-2 lg:order-1"
        >
          <div className="relative overflow-hidden w-full h-[60vh] md:h-[75vh]">
            <img
              src={images.clandestino}
              alt="Destilación Clandestina"
              className="w-full h-full object-cover grayscale transition-transform duration-[3s] hover:scale-105"
            />
          </div>
          {/* FIRMA LATERAL */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -right-14 md:right-172 font-brand-script text-4xl md:text-5xl text-brand-clay/50 -rotate-90 z-30 pointer-events-none whitespace-nowrap"
          >
            {sideSignatures.cap2}
          </motion.span>
          <motion.div
            variants={fadeUpVariant}
            className="absolute -top-6 -left-4 md:-top-10 md:-left-8 w-24 h-24 md:w-36 md:h-36 z-20 pointer-events-none rotate-15"
          >
            <img
              src={stamps.selloClandestino}
              alt="Sello"
              className="w-full h-full object-contain opacity-50"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-5 flex flex-col justify-center lg:pl-4 order-1 lg:order-2"
        >
          {/* NÚMERO SUBRAYADO */}
          <div className="flex items-end justify-start lg:justify-end mb-4 md:mb-6 w-full">
            <span className="font-brand-script text-5xl md:text-6xl text-brand-black underline decoration-brand-black/20 underline-offset-8">
              02
            </span>
          </div>

          <h2 className="font-brand-script text-5xl md:text-6xl text-brand-black -mb-2 relative z-10 lg:text-right mt-2">
            El destilado
          </h2>
          <h2 className="font-brand-serif text-4xl md:text-5xl text-brand-clay leading-none uppercase tracking-tighter mb-6 relative z-0 lg:text-right">
            Prohibido
          </h2>

          <p className="font-brand-sans text-brand-black/80 text-[11px] md:text-xs uppercase tracking-[0.15em] leading-loose mb-6 border-l lg:border-l-0 lg:border-r border-brand-clay/30 pl-4 lg:pl-0 lg:pr-4 lg:text-right">
            (TEXTO MUESTRA) En 1915, se prohibió la producción de bebidas
            alcohólicas en el estado. Quienes se atrevían a destilar eran
            perseguidos ferozmente. Pero el Bacanora no murió; se ocultó en la
            sierra.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          5. DIVISIÓN EDITORIAL (RENACIMIENTO NEGRO)
      ========================================= */}
      <section className="bg-brand-black text-brand-beige py-16 md:py-32 px-6 relative z-10 mb-16 md:mb-32 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <img
            src={logoUrl}
            alt="Logo"
            className="w-12 h-12 object-contain mx-auto mb-8 "
          />
          <h3 className="font-brand-serif text-3xl md:text-5xl uppercase tracking-tighter mb-6 leading-tight">
            De la oscuridad a <br />
            <span className="font-brand-script text-brand-clay text-4xl md:text-6xl normal-case">
              la luz del mundo
            </span>
          </h3>
          <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-beige/60 leading-loose">
            En 1992 la prohibición fue levantada. Hoy, el Bacanora cuenta con
            Denominación de Origen.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          6. CAPÍTULO 03: EL ORIGEN DE PALMARITO
      ========================================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 relative z-10 mb-16 md:mb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="md:col-span-6 lg:col-span-5 flex flex-col justify-center"
        >
          {/* NÚMERO SUBRAYADO */}
          <div className="flex items-end mb-4 md:mb-6 w-full">
            <span className="font-brand-script text-5xl md:text-6xl text-brand-black underline decoration-brand-black/20 underline-offset-8">
              03
            </span>
          </div>

          <h2 className="font-brand-script text-5xl md:text-6xl text-brand-black -mb-2 mt-2">
            Nace
          </h2>
          <h2 className="font-brand-serif text-4xl md:text-5xl text-brand-clay leading-none uppercase tracking-tighter mb-6">
            Palmarito
          </h2>

          <p className="font-brand-sans uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-brand-black/80 leading-loose md:text-justify font-medium mb-6">
            (TEXTO MUESTRA) Nacimos del profundo respeto a nuestra tierra.
            Palmarito no es solo una marca, es el tributo vivo a las
            generaciones de sonorenses que mantuvieron viva la llama del
            Bacanora durante la prohibición.
          </p>
          <p className="font-brand-sans uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-brand-black/80 leading-loose md:text-justify font-medium mb-8">
            Cada botella que sellamos es una carta de amor al desierto. Un
            homenaje a la flora, la fauna y el calor implacable que le da
            carácter a nuestro destilado.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="md:col-span-6 lg:col-span-7 relative"
        >
          <div className="relative overflow-hidden w-full h-[50vh] md:h-[70vh]">
            <img
              src={images.botella}
              alt="Palmarito Bacanora"
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
            />
          </div>
          {/* FIRMA LATERAL */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -left-28 md:left-150 font-brand-script text-4xl md:text-5xl text-brand-clay/50 -rotate-90 z-30 pointer-events-none whitespace-nowrap"
          >
            {sideSignatures.cap3}
          </motion.span>
          <motion.div
            variants={fadeUpVariant}
            className="absolute -top-6 -right-4 md:-top-10 md:-right-8 w-24 h-24 md:w-36 md:h-36 z-20 pointer-events-none rotate-25"
          >
            <img
              src={stamps.selloBotella}
              alt="Sello Palmarito"
              className="w-full h-full object-contain mix-blend-multiply opacity-80"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          7. CAPÍTULO 04: EL PROCESO
      ========================================= */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 relative z-10 mb-16 md:mb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="md:col-span-6 lg:col-span-7 relative order-2 md:order-1"
        >
          <div className="relative overflow-hidden w-full h-[60vh] md:h-[80vh]">
            <img
              src={images.procesoPalmarito}
              alt="Proceso Palmarito"
              className="w-full h-full object-cover grayscale-20 transition-transform duration-[3s] hover:scale-105"
            />
          </div>
          {/* FIRMA LATERAL */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -right-19 md:right-163 font-brand-script text-4xl md:text-5xl text-brand-clay/50 -rotate-90 z-30 pointer-events-none whitespace-nowrap"
          >
            {sideSignatures.cap4}
          </motion.span>
          <motion.div
            variants={fadeUpVariant}
            className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-28 h-28 md:w-40 md:h-40 z-20 pointer-events-none rotate-20"
          >
            <img
              src={stamps.selloProceso}
              alt="Sello Palmarito"
              className="w-full h-full object-contain mix-blend-multiply opacity-80"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="md:col-span-6 lg:col-span-5 flex flex-col justify-center order-1 md:order-2 md:pl-8"
        >
          {/* NÚMERO SUBRAYADO */}
          <div className="flex items-end justify-start md:justify-end mb-4 md:mb-6 w-full">
            <span className="font-brand-script text-5xl md:text-6xl text-brand-black underline decoration-brand-black/20 underline-offset-8">
              04
            </span>
          </div>

          <h2 className="font-brand-script text-5xl md:text-6xl text-brand-black -mb-2 md:text-right mt-2">
            Hecho a
          </h2>
          <h2 className="font-brand-serif text-4xl md:text-5xl text-brand-clay leading-none uppercase tracking-tighter mb-6 md:text-right">
            Mano
          </h2>

          <p className="font-brand-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-brand-black/80 leading-loose border-l md:border-l-0 md:border-r border-brand-clay/30 pl-4 md:pl-0 md:pr-4 mb-6 md:text-right">
            (TEXTO MUESTRA) Tomamos el legado de los maestros vinateros y lo
            embotellamos cuidando cada detalle: cocción en horno cónico de
            piedra, fermentación natural con levaduras salvajes y doble
            destilación en alambiques de cobre.
          </p>

          <div className="flex items-center md:justify-end gap-4 mt-6 border-t border-brand-black/10 pt-6">
            <div className="flex flex-col md:text-right">
              <span className="font-brand-script text-2xl md:text-3xl text-brand-black leading-none">
                100% Agave Pacífica
              </span>
              <span className="font-brand-sans text-[8px] uppercase tracking-[0.3em] text-brand-clay mt-1">
                Orgullo de la Sierra
              </span>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={stamps.firmaProceso}
                alt="Firma"
                className="w-8 object-contain opacity-80"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          8. CIERRE ÉPICO A PANTALLA COMPLETA
      ========================================= */}
      <section className="w-full h-[70vh] md:h-[90vh] relative overflow-hidden flex items-center justify-center text-center">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0"
        >
          <img
            src={images.sierraFull}
            alt="Cierre Sonora"
            className="w-full h-full object-cover grayscale-40"
          />
          <div className="absolute inset-0 bg-brand-black/60"></div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="relative z-10 px-6 max-w-4xl"
        >
          <img
            src={stamps.logoCierre}
            alt="Palmarito"
            className="w-16 md:w-20 mx-auto mb-8 "
          />
          <h2 className="font-brand-serif text-3xl md:text-5xl lg:text-7xl text-brand-beige uppercase tracking-tighter leading-none mb-6">
            No hacemos Bacanora <br className="hidden md:block" />
            <span className="font-brand-script text-brand-clay text-5xl md:text-7xl lg:text-8xl normal-case mt-2 block">
              para el mundo
            </span>
          </h2>
          <p className="font-brand-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-brand-beige/80 mt-8">
            Hacemos Bacanora para honrar a Sonora
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default HistoryPage;
