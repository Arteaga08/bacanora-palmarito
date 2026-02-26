import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const AgeVerification = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Revisamos si el usuario ya confirmó su edad anteriormente
    const isAdult = localStorage.getItem("isAdult");
    if (!isAdult) {
      setShowModal(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("isAdult", "true");
    setShowModal(false);
  };

  const handleExit = () => {
    // Si dice que no, lo mandamos a Google
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-brand-beige px-6"
        >
          {/* Fondo decorativo sutil */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
            <img src={logoUrl} alt="" className="w-[80%] rotate-12" />
          </div>

          <div className="max-w-md w-full text-center relative z-10">
            {/* LOGO */}
            <img
              src={logoUrl}
              alt="Palmarito Logo"
              className="w-24 mx-auto mb-8 "
            />

            <h2 className="font-brand-serif text-4xl md:text-5xl text-brand-black tracking-tighter uppercase mb-4">
              Palmarito Sonora
            </h2>

            <p className="font-brand-sans text-[10px] uppercase tracking-[0.4em] text-brand-black/60 mb-12 leading-relaxed">
              Debes tener la edad legal para consumir alcohol <br /> en tu país
              para ingresar.
            </p>

            <div className="space-y-4 font-brand-sans">
              <button
                onClick={handleConfirm}
                className="w-full bg-brand-black text-brand-beige py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-clay transition-all duration-500 shadow-xl"
              >
                Soy mayor de edad
              </button>

              <button
                onClick={handleExit}
                className="w-full py-5 text-[9px] uppercase tracking-[0.3em] text-brand-black/40 hover:text-brand-black transition-colors"
              >
                No tengo la edad legal
              </button>
            </div>

            <p className="mt-16 text-[8px] uppercase tracking-widest text-brand-black/30 font-medium">
              Disfruta con responsabilidad. <br />
              Palmarito © 2026
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerification;
