import { loadStripe, RedirectToCheckoutOptions } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { PriceAdjustment } from './types/requests';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_PRIVATE);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export async function pay(adjustment: PriceAdjustment) {
  const stripe2 = await stripePromise;
  const price = await stripe.prices.create({
    currency: 'eur',
    unit_amount: adjustment.newPrice * 100,
    product_data: {
      name: adjustment.serviceName
    }
  });
  await stripe2.redirectToCheckout({
    mode: 'payment',
    lineItems: [{
      price: price.id,
      quantity: 1,
    }],
    successUrl: `${window.location.protocol}//${window.location.host}/chat?checkoutId={CHECKOUT_SESSION_ID}&adjustmentId=${adjustment.id}`
  } as RedirectToCheckoutOptions)
}

export const isPaid = async (checkoutId: string) => {
  const session = await stripe.checkout.sessions.retrieve(checkoutId, {
    expand: ['payment_intent'],
  });
  return session.payment_status === 'paid'
}