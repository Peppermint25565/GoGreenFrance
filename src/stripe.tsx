import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_PRIVATE);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export async function pay(amount: number, name: string, callbackUrl: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: { name: name },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    success_url: callbackUrl, // `/success?session_id={CHECKOUT_SESSION_ID}
  });
  const stripe2 = await stripePromise;
  await stripe2.redirectToCheckout({ sessionId: session.id });
}

export const isPaid = async (checkoutId: string) => {
  const session = await stripe.checkout.sessions.retrieve(checkoutId, {
    expand: ['payment_intent'],
  });
  return session.payment_status === 'paid'
}