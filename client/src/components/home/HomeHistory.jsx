import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomeHistory = () => {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  return (
    <section className="bg-brand-beige pt-20 md:pt-32 pb-24 md:pb-32 overflow-hidden relative">
      {/* FIRMAS LATERALES */}
      <div className="absolute top-[20%] -left-16 md:-left-20 -rotate-90 origin-center hidden xl:block z-0 opacity-40">
        <span className="font-brand-script text-4xl text-brand-black whitespace-nowrap">
          Firma del Maestro
        </span>
      </div>
      <div className="absolute top-[74%] -right-16 md:-right-20 rotate-90 origin-center hidden xl:block z-0 opacity-40">
        <span className="font-brand-script text-4xl text-brand-black whitespace-nowrap">
          Hecho en Sonora, MX.
        </span>
      </div>

      {/* TÍTULO LLAMATIVO */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariant}
        className="max-w-5xl mx-auto text-center px-6 mb-16 md:mb-24 relative z-10"
      >
        <h2 className="font-brand-serif text-6xl md:text-8xl uppercase tracking-tighter text-brand-black leading-none mb-6 md:mb-8">
          Espíritu <br className="md:hidden" />
          <span className="font-brand-script text-brand-clay lowercase text-7xl md:text-9xl -ml-2 md:-ml-8 relative top-2 md:-top-4">
            salvaje
          </span>
        </h2>

        <p className="font-brand-sans text-brand-black/80 leading-relaxed text-sm md:text-base font-medium max-w-2xl mx-auto mt-4 md:mt-8">
          Para los sonorenses la tierra es sagrada. Los objetos cotidianos, las
          herramientas de trabajo y hasta las recetas se convierten en símbolos
          que nos recuerdan de dónde venimos y hacia dónde cabalgamos.
        </p>
      </motion.div>

      {/* SECCIÓN A: Foto + Texto */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 relative mb-24 md:mb-32 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-5 flex flex-col justify-center lg:pl-4"
        >
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] text-brand-clay font-bold">
              Origen
            </span>
            <div className="w-12 md:w-16 h-px bg-brand-clay/50"></div>
          </div>

          <div>
            <h3 className="font-brand-script text-5xl md:text-6xl text-brand-clay -mb-2 md:-mb-4 relative z-10">
              El desierto
            </h3>
            <h3 className="font-brand-serif text-4xl md:text-5xl text-brand-black leading-none uppercase tracking-tighter mb-4 md:mb-6 relative z-0">
              No se domina
            </h3>

            <p className="font-brand-sans text-brand-black/80 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              Nacido en las condiciones más extremas, nuestro agave acumula
              dulzura y carácter bajo el sol abrasador. Cada gota es un
              testimonio de resistencia.
            </p>
            {/* EL ENLACE SE ELIMINÓ DE AQUÍ */}
          </div>
        </motion.div>

        {/* Imagen Derecha con Primer Sello */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="lg:col-span-7 relative mt-4 lg:mt-0"
        >
          <img
            src="https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1000&q=80"
            alt="Bodegón Bacanora"
            className="w-full h-[55vh] md:h-[65vh] object-cover drop-shadow-xl"
          />

          <motion.div
            initial={{ rotate: -25, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: -15, scale: 1, opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute -bottom-8 -left-6 md:-bottom-12 md:-left-12 w-32 h-32 md:w-56 md:h-56 text-brand-clay mix-blend-multiply z-20 pointer-events-none"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/815/815553.png"
              alt="Sello Puma 1"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* SECCIÓN VIDEO FULL WIDTH */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full h-[50vh] md:h-[60vh] mb-24 md:mb-32 relative bg-brand-black z-10"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80"
          className="w-full h-full object-cover opacity-80"
        >
          <source
            src="https://res.cloudinary.com/demo/video/upload/v1689798402/docs/walking_in_nature.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.span
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.9 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="font-brand-script text-5xl md:text-7xl text-brand-beige drop-shadow-lg"
          >
            Tiempo al tiempo
          </motion.span>
        </div>
      </motion.div>

      {/* SECCIÓN B: Cuadrícula Desfasada */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="md:col-span-6 lg:col-span-7 relative order-2 md:order-1"
          >
            <img
              src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80"
              alt="Campo de Agave"
              className="w-full h-[55vh] md:h-[60vh] object-cover"
            />

            <motion.div
              initial={{ rotate: 30, scale: 0.8, opacity: 0 }}
              whileInView={{ rotate: 5, scale: 1, opacity: 0.8 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-28 h-28 md:w-44 md:h-44 text-brand-clay mix-blend-multiply z-20 pointer-events-none"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/815/815553.png"
                alt="Sello Puma 2"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="md:col-span-6 lg:col-span-5 flex flex-col justify-center lg:pl-10 order-1 md:order-2"
          >
            <div className="flex items-center justify-start md:justify-end gap-4 mb-6 md:mb-8">
              <div className="hidden md:block w-16 h-px bg-brand-clay/50"></div>
              <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] text-brand-clay font-bold">
                Proceso
              </span>
              <div className="md:hidden w-12 h-px bg-brand-clay/50"></div>
            </div>

            <h3 className="font-brand-script text-5xl md:text-6xl text-brand-clay -mb-2">
              Fuego y
            </h3>
            <h3 className="font-brand-serif text-4xl md:text-5xl text-brand-black leading-none uppercase tracking-tighter mb-4 md:mb-6">
              Paciencia
            </h3>

            <p className="font-brand-sans uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-brand-black/80 leading-loose md:text-justify font-medium">
              En cada botella se vierte agave verdadero. El Puma salvaje que se
              muestra en la etiqueta simboliza la libertad y el respeto que
              sentimos por la tierra. Nuestro deseo es conservarlos y llevarlos
              por siempre en nuestra memoria.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. CTA FINAL: ENLACE REUBICADO */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
        className="w-full flex justify-center mt-16 md:mt-24 relative z-10"
      >
        <Link
          to="/historia"
          className="group flex flex-col items-center cursor-pointer text-center"
        >
          <span className="font-brand-script text-4xl md:text-5xl text-brand-clay -mb-2 opacity-90 group-hover:opacity-100 transition-opacity">
            Descubre
          </span>
          <span className="font-brand-sans uppercase tracking-[0.4em] text-[10px] md:text-xs text-brand-black font-bold border-b border-brand-black/30 md:border-transparent pb-1 group-hover:border-brand-clay group-hover:text-brand-clay transition-all duration-500">
            Nuestro Origen
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default HomeHistory;
