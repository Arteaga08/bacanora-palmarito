import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeIntent = async (amountInCents, orderNumber) => {
  return stripe.paymentIntents.create(
    {
      amount: amountInCents,
      currency: "mxn",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderNumber,
      },
    },
    {
      idempotencyKey: orderNumber,
    },
  );
};
