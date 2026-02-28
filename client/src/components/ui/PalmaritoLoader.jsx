import React from "react";
import VidixImage from "../VidixImage";

const PalmaritoLoader = ({ fullScreen = false, text = "Cargando" }) => {
  // 1. BLINDAJE DE CENTRADO:
  // Usamos 'h-screen' para asegurar que ocupe todo el alto del celular.
  // 'flex-col' + 'justify-center' + 'items-center' garantiza el centro absoluto.
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[999] bg-brand-beige w-full h-screen flex flex-col items-center justify-center"
    : "relative w-full min-h-[60vh] bg-brand-beige flex flex-col items-center justify-center p-6";

  return (
    <div className={containerClasses}>
      {/* Contenedor interno para asegurar que nada se mueva */}
      <div className="flex flex-col items-center justify-center text-center max-w-xs">
        {/* LOGO: Con un pulso muy elegante, no frenético */}
        <div className="w-32 md:w-48 mb-10 opacity-60 animate-pulse transition-all duration-1000">
          <VidixImage
            // 🌟 Aquí pega la URL de tu logo en Cloudinary
            src="https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png"
            alt="Palmarito Bacanora"
            priority={true}
            widths={[300, 600]}
            className="object-contain"
          />
        </div>

        {/* TEXTO: Con la tipografía Raaf y espaciado premium */}
        <div className="relative">
          <span className="block font-brand-sans font-bold text-brand-clay uppercase tracking-[0.8em] text-[10px] md:text-xs leading-none">
            {text}
          </span>

          {/* Línea decorativa que crece desde el centro */}
          <div className="mt-6 w-8 h-px bg-brand-sand/60 mx-auto animate-bounce" />
        </div>
      </div>

      {/* Sello de agua sutil en la esquina (opcional, muy Vidix) */}
      <div className="absolute bottom-8 font-brand-sans text-[8px] text-brand-sand/40 uppercase tracking-[0.4em]">
        Espíritu Salvaje
      </div>
    </div>
  );
};

export default PalmaritoLoader;
