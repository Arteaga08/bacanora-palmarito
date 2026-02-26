import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import clientAxios from "../services/axiosConfig";
import { useCart } from "../context/CartContext";

const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const stripePromise = loadStripe(
  "pk_test_51Sy1AGFHPx1jF6lFYsgpzQFjPLc8j9QTLA0rw7zjf6irs1o4sJFuBNAPlkA7ISSqbispa7DFVbHRl2YAOx4Yq5mk00UaZJlUdS",
);

const ESTADOS_MEXICO = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Coahuila",
  "Colima",
  "Ciudad de México",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

/* =========================================================
   COMPONENTE INTERNO: EL FORMULARIO DE PAGO DE STRIPE
========================================================= */
const StripePaymentForm = ({ clientSecret, onPaymentSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaymentSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in duration-500"
    >
      <div className="bg-white p-6 md:p-8 border border-brand-black/10 shadow-xl">
        <h3 className="font-brand-serif text-3xl text-brand-black mb-6 border-b border-brand-black/10 pb-4">
          Datos de Pago
        </h3>
        <PaymentElement options={{ layout: "tabs" }} />
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 font-brand-sans text-[10px] uppercase tracking-widest">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-1/3 border border-brand-black/20 text-brand-black py-4 font-brand-sans uppercase tracking-[0.2em] text-[10px] hover:bg-brand-black/5 transition-colors disabled:opacity-50"
        >
          Regresar
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-2/3 bg-brand-black text-brand-beige py-4 font-brand-sans uppercase tracking-[0.3em] text-[10px] hover:bg-brand-clay transition-colors border border-brand-black disabled:opacity-50"
        >
          {isProcessing ? "Procesando pago..." : "Pagar Ahora"}
        </button>
      </div>
    </form>
  );
};

/* =========================================================
   COMPONENTE PRINCIPAL: CHECKOUT PAGE
========================================================= */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Sonora",
    zip: "",
    references: "",
  });

  const shippingCost = cartSubtotal > 2000 ? 0 : 150;
  const total = cartSubtotal + shippingCost;

  // AUTOCOMPLETADO POR CÓDIGO POSTAL
  useEffect(() => {
    const fetchAddressByZip = async () => {
      if (formData.zip.length === 5) {
        try {
          const response = await fetch(
            `https://api.zippopotam.us/mx/${formData.zip}`,
          );
          if (response.ok) {
            const data = await response.json();
            const place = data.places[0];
            setFormData((prev) => ({
              ...prev,
              state: place["state"],
              city: place["place name"],
            }));
          }
        } catch (error) {
          console.error("Error al buscar el CP:", error);
        }
      }
    };
    fetchAddressByZip();
  }, [formData.zip]);

  useEffect(() => {
    if (cartItems.length === 0 && step === 1) {
      navigate("/tienda");
    }
  }, [cartItems, navigate, step]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: "México",
          references: formData.references,
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerNote: formData.references,
        legalAgeConfirmed: localStorage.getItem("isAdult") === "true",
      };

      console.log("📦 PAQUETE LISTO PARA EL BACKEND:", payload);

      const { data } = await clientAxios.post("/orders", payload);
      setClientSecret(data.clientSecret);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar tu orden.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate("/checkout/success");
  };

  return (
    <main className="min-h-screen bg-brand-beige pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="w-full lg:w-3/5 order-2 lg:order-1">
          <div className="flex items-center gap-4 border-b border-brand-black/10 pb-6 mb-8">
            <img
              src={logoUrl}
              alt="Palmarito"
              className="w-12 md:w-16 grayscale opacity-80"
            />
            <div className="flex flex-col">
              <h1 className="font-brand-serif text-3xl md:text-4xl text-brand-black tracking-tighter">
                Finalizar Compra
              </h1>
              <div className="flex items-center gap-2 font-brand-sans text-[8px] md:text-[10px] uppercase tracking-widest text-brand-clay mt-1">
                <span className={step === 1 ? "font-bold" : "opacity-50"}>
                  1. Envío
                </span>
                <span className="opacity-50">/</span>
                <span className={step === 2 ? "font-bold" : "opacity-50"}>
                  2. Pago
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleProceedToPayment}
                className="space-y-10"
              >
                {/* CONTACTO */}
                <div className="space-y-6">
                  <h3 className="font-brand-script text-4xl text-brand-clay border-b border-brand-black/10 pb-2">
                    Contacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        Nombre Completo *
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        Correo Electrónico *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        Teléfono *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* DIRECCIÓN */}
                <div className="space-y-6">
                  <h3 className="font-brand-script text-4xl text-brand-clay border-b border-brand-black/10 pb-2">
                    Dirección de Envío
                  </h3>
                  <div className="space-y-2">
                    <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                      Calle y Número *
                    </label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        CP *
                      </label>
                      <input
                        required
                        type="text"
                        name="zip"
                        maxLength="5"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="5 dígitos"
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        Ciudad *
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                        Estado *
                      </label>
                      <select
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors appearance-none"
                      >
                        <option value="">Seleccionar...</option>
                        {ESTADOS_MEXICO.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 font-bold">
                      Referencias (Opcional)
                    </label>
                    <input
                      type="text"
                      name="references"
                      value={formData.references}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-brand-black/30 p-2 text-sm focus:border-brand-clay outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-brand-black/10">
                  <Link
                    to="/carrito"
                    className="font-brand-sans text-[9px] uppercase tracking-widest text-brand-black/60 hover:text-brand-clay transition-colors"
                  >
                    ← Volver al carrito
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-black text-brand-beige px-10 py-4 font-brand-sans uppercase tracking-[0.3em] text-[10px] hover:bg-brand-clay transition-colors disabled:opacity-50"
                  >
                    {loading ? "Preparando orden..." : "Continuar al Pago"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {clientSecret && (
                  <Elements
                    options={{ clientSecret, appearance: { theme: "stripe" } }}
                    stripe={stripePromise}
                  >
                    <StripePaymentForm
                      clientSecret={clientSecret}
                      onPaymentSuccess={handlePaymentSuccess}
                      onBack={() => setStep(1)}
                    />
                  </Elements>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =========================================
            COLUMNA DERECHA: RESUMEN DE COMPRA
        ========================================= */}
        <div className="w-full lg:w-2/5 order-1 lg:order-2">
          <div className="bg-white border border-brand-black/10 shadow-2xl p-6 md:p-8 sticky top-32">
            <h3 className="font-brand-serif text-2xl text-brand-black uppercase tracking-tighter mb-6">
              Resumen de Reserva
            </h3>

            {/* LISTA DE PRODUCTOS - Ajuste de padding para evitar cortes en el badge */}
            <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 items-center border-b border-brand-black/5 pb-4 last:border-0"
                >
                  <div className="w-20 h-24 bg-brand-black/5 p-2 border border-brand-black/10 shrink-0 relative flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />

                    {/* BADGE: Posición corregida para visibilidad total */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-clay text-brand-beige text-[8px] font-brand-sans rounded-full flex items-center justify-center shadow-md z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-brand-serif text-lg leading-tight uppercase tracking-tight">
                      {item.name}
                    </h4>
                    <span className="font-brand-sans text-[9px] text-brand-black/60 uppercase tracking-widest block mt-1">
                      ${item.price.toLocaleString("es-MX")}
                    </span>
                  </div>
                  <div className="font-brand-sans font-bold text-sm">
                    ${(item.price * item.quantity).toLocaleString("es-MX")}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-brand-black/10 pt-6">
              <div className="flex justify-between font-brand-sans text-[10px] uppercase tracking-widest text-brand-black/60">
                <span>Subtotal</span>
                <span>${cartSubtotal.toLocaleString("es-MX")}</span>
              </div>
              <div className="flex justify-between font-brand-sans text-[10px] uppercase tracking-widest text-brand-black/60">
                <span>Envío {shippingCost === 0 && "(Gratis > $2,000)"}</span>
                <span>
                  {shippingCost === 0
                    ? "GRATIS"
                    : `$${shippingCost.toLocaleString("es-MX")}`}
                </span>
              </div>
              <div className="flex items-end justify-between border-t border-brand-black/10 pt-4 mt-4">
                <span className="font-brand-serif text-xl uppercase tracking-widest">
                  Total
                </span>
                <span className="font-brand-script text-4xl text-brand-clay leading-none">
                  ${total.toLocaleString("es-MX")}{" "}
                  <span className="text-sm font-brand-sans text-brand-black/60 not-italic">
                    MXN
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 border border-brand-black/10 p-4 bg-brand-black/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-brand-clay"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <span className="font-brand-sans text-[8px] uppercase tracking-[0.2em] text-brand-black/60">
                Pago encriptado y 100% seguro
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
