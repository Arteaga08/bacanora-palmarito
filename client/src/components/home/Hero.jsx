import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dnppruwh4/image/upload/v1769985557/Gemini_Generated_Image_o2hs6yo2hs6yo2hs_fdltez.png"
          alt="Paisaje Palmarito"
          className="w-full h-full object-cover"
        />
      </div>

     

      {/* 3. CONTENIDO (Texto)
          - z-20 para estar sobre la foto.
          - Colores ajustados: Si la foto es oscura, usamos beige. Si es clara, black.
          - Asumiré foto oscura/contrastada y usaré Beige para que resalte, 
            o Black si es un paisaje desértico muy claro. Tú decides el color final.
      */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center z-20 px-6 relative"
      >
        {/* Eyebrow */}
        <h2 className="font-brand-sans text-brand-clay uppercase tracking-[0.4em] text-[10px] md:text-xs mb-6 font-medium shadow-sm">
          El Espíritu de Sonora
        </h2>

        {/* Título Principal */}
        <h1 className="text-6xl md:text-9xl font-brand-serif text-brand-beige tracking-tighter leading-[0.9] drop-shadow-lg">
          PALMARITO
        </h1>

        {/* Subtítulo */}
        <p className="mt-8 font-brand-sans uppercase tracking-[0.2em] text-[10px] md:text-xs text-brand-beige/90 max-w-md mx-auto leading-relaxed drop-shadow-md">
          Bacanora Blanco 100% Agave.
          <br className="hidden md:block" /> Tradición artesanal embotellada.
        </p>

        {/* CTA */}
        <div className="mt-12">
          <Link
            to="/tienda"
            className="inline-block px-12 py-4 border border-brand-beige text-brand-beige font-brand-sans uppercase text-[10px] tracking-[0.3em] hover:bg-brand-beige hover:text-brand-black transition-all duration-500"
          >
            Descubrir
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
