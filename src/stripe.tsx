import { loadStripe, RedirectToCheckoutOptions } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { PriceAdjustment } from './types/requests';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_API_PRIVATE);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export async function pay(adjustment: PriceAdjustment) {
  const stripe2 = await stripePromise;
  const checkout = await stripe.checkout.sessions.create({
    ui_mode: 'custom',
      mode: 'payment',
      return_url: `${window.location.protocol}//${window.location.host}/chat?checkoutId={CHECKOUT_SESSION_ID}&adjustmentId=${adjustment.id}`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: adjustment.newPrice * 100,
            product_data: { name: adjustment.serviceName },
          },
          quantity: 1,
        },
      ],
  } as Stripe.Checkout.SessionCreateParams)
  await stripe2.redirectToCheckout({sessionId: checkout.id} as RedirectToCheckoutOptions)
}

export const isPaid = async (checkoutId: string) => {
  const session = await stripe.checkout.sessions.retrieve(checkoutId, {
    expand: ['payment_intent'],
  });
  return session.payment_status === 'paid'
}