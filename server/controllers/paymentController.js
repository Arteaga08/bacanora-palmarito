import asyncHandler from "express-async-handler";
import Stripe from "stripe";

// Inicializamos Stripe con nuestra llave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Crear intención de pago en Stripe
// @route   POST /api/payment/create-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body; // El monto debe venir en centavos (ej: $100 -> 10000)

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "mxn",
    automatic_payment_methods: { enabled: true },
    metadata: { company: "Bacanora Palmarito" },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
