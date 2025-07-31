import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { PriceAdjustment } from './types/requests';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_PRIVATE);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export async function pay(adjustment: PriceAdjustment) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: { name: adjustment.serviceName },
        unit_amount: Math.round(adjustment.newPrice * 100),
      },
      quantity: 1,
    }]
  });
  const stripe2 = await stripePromise;
  await stripe2.redirectToCheckout({ sessionId: session.id, successUrl: `${window.location.protocol}//${window.location.host}/chat?checkoutId={CHECKOUT_SESSION_ID}&adjustmentId=${adjustment.id}` });
}

export const isPaid = async (checkoutId: string) => {
  const session = await stripe.checkout.sessions.retrieve(checkoutId, {
    expand: ['payment_intent'],
  });
  return session.payment_status === 'paid'
}