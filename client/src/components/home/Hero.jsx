import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 border-b border-brand-dark/10">
      {/* Las "Separaciones": Líneas finas laterales (estilo Fulgencio) */}
      <div className="absolute inset-y-0 left-10 border-l border-brand-dark/5 hidden lg:block"></div>
      <div className="absolute inset-y-0 right-10 border-r border-brand-dark/5 hidden lg:block"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-6"
      >
        <h2 className="text-brand-orange uppercase tracking-[0.3em] text-xs mb-4 font-medium">
          El Espíritu de Sonora
        </h2>
        <h1 className="text-6xl md:text-9xl font-serif text-brand-dark tracking-tighter leading-none">
          PALMARITO
        </h1>
        <p className="mt-6 text-sm uppercase tracking-widest text-brand-dark/60 max-w-md mx-auto leading-relaxed">
          Bacanora Blanco 100% Agave. Tradición artesanal embotellada.
        </p>

        {/* Botón Minimalista con línea de separación */}
        <button className="mt-12 px-10 py-4 border border-brand-dark text-brand-dark uppercase text-[10px] tracking-[0.2em] hover:bg-brand-dark hover:text-brand-cream transition-all duration-500">
          Explorar Colección
        </button>
      </motion.div>

      {/* Placeholder para la imagen de impacto (Luego pondremos el Bacanora) */}
      <div className="absolute bottom-0 w-full h-1/2 bg-linear-to-t from-brand-orange/5 to-transparent z-0"></div>
    </section>
  );
};

export default Hero;
