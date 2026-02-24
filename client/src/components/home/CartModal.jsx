import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // Ajusta la ruta a tu contexto

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();

  // Función para ir al Checkout y cerrar el modal
  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* FONDO OSCURO (BACKDROP) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/60 z-100 backdrop-blur-sm"
          />

          {/* PANEL LATERAL DEL CARRITO */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-112.5 bg-brand-beige z-101 shadow-2xl flex flex-col border-l border-brand-black/20"
          >
            {/* HEADER DEL MODAL */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-brand-black/10 bg-brand-beige">
              <div className="flex items-center gap-3">
                <span className="font-brand-script text-3xl text-brand-clay mt-2">
                  Tu
                </span>
                <h2 className="font-brand-serif text-3xl text-brand-black uppercase tracking-tighter">
                  Reserva
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center border border-brand-black/20 rounded-full hover:bg-brand-clay hover:text-brand-beige hover:border-brand-clay transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* CUERPO DEL CARRITO (LISTA DE PRODUCTOS) */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-16 h-16 mb-4 text-brand-clay"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  <p className="font-brand-sans uppercase tracking-widest text-xs">
                    Tu reserva está vacía
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      {/* Imagen del producto */}
                      <div className="w-20 h-24 bg-brand-black/5 p-2 flex items-center justify-center border border-brand-black/10">
                        <img
                          src={
                            item.image ||
                            "https://res.cloudinary.com/djtetdac1/image/upload/v1771342440/palmarito_assets/hz0ce6vn5me6bliauwef.webp"
                          }
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Info del producto */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-brand-serif text-xl uppercase tracking-tighter text-brand-black leading-none">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-brand-black/40 hover:text-red-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                              </svg>
                            </button>
                          </div>
                          <span className="font-brand-sans text-[10px] text-brand-clay font-bold tracking-widest">
                            ${item.price.toLocaleString("es-MX")} MXN
                          </span>
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center border border-brand-black/20 w-fit mt-2 bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-3 py-1 font-brand-sans text-brand-black/60 hover:text-brand-black transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 font-brand-sans text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-3 py-1 font-brand-sans text-brand-black/60 hover:text-brand-black transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER DEL CARRITO (TOTAL Y BOTÓN DE PAGO) */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-brand-black/10 bg-brand-beige">
                <div className="flex items-end justify-between mb-6">
                  <span className="font-brand-sans uppercase tracking-[0.2em] text-[10px] text-brand-black/60">
                    Subtotal
                  </span>
                  <span className="font-brand-script text-3xl text-brand-black leading-none">
                    ${cartSubtotal.toLocaleString("es-MX")}
                  </span>
                </div>

                <p className="font-brand-sans text-[9px] text-brand-black/50 uppercase tracking-widest mb-4 text-center">
                  Envío y métodos de pago se calculan en el siguiente paso.
                </p>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-black text-brand-beige py-4 font-brand-sans uppercase tracking-[0.3em] text-[10px] hover:bg-brand-clay transition-colors border border-brand-black"
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
