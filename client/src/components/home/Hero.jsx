import { Link } from "react-router-dom";
import VidixImage from "../VidixImage";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-black">
      {/* 1. BACKGROUND: Carga prioritaria */}
      <div className="absolute inset-0 z-0">
        <VidixImage
          src="https://res.cloudinary.com/dnppruwh4/image/upload/v1769985557/Gemini_Generated_Image_o2hs6yo2hs6yo2hs_fdltez.png"
          alt="Paisaje Palmarito Bacanora"
          fill={true}
          priority={true}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. CONTENIDO: 100% Estático para un LCP instantáneo */}
      <div className="text-center z-20 px-6 relative">
        {/* Eyebrow */}
        <p className="font-brand-sans text-brand-clay uppercase tracking-[0.4em] text-[10px] md:text-xs mb-6 font-medium">
          El Espíritu de Sonora
        </p>

        {/* Título Principal */}
        <h1 className="text-6xl md:text-9xl font-brand-serif text-brand-beige tracking-tighter leading-[0.9] drop-shadow-lg uppercase">
          P A L M A R I T O
        </h1>

        {/* Subtítulo */}
        <p className="mt-8 font-brand-sans uppercase tracking-[0.2em] text-[10px] md:text-xs text-brand-beige/90 max-w-md mx-auto leading-relaxed drop-shadow-md">
          Bacanora Blanco 100% Agave Pacífica.
          <br className="hidden md:block" /> Sabiduría vinatera embotellada.
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
      </div>
    </section>
  );
};

export default Hero;
