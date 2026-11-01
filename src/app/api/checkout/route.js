import {authOptions} from '@/libs/auth';
import {prepareCheckout} from '@/libs/checkout';
import {errorResponse, HttpError} from '@/libs/httpError';
import {Order} from '@/models/Order';
import {getServerSession} from 'next-auth';
import Stripe from 'stripe';

export async function POST(req) {
  let stripe;
  let stripeSession;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new HttpError(401, 'Inicia sesión');
    const data = await req.json();
    const priced = await prepareCheckout(data, session.user.email);
    const order = new Order(priced.orderData);
    const advance = data.paymentMethod === 'advance';
    // Preserve the existing policy: round the 30% advance to whole bolivianos.
    const advanceCents = Math.round((priced.total / 100) * 0.3) * 100;
    if (advance) order.advanceAmount = advanceCents / 100;
    const lineItems = advance ? [{
      quantity: 1,
      price_data: {currency: 'bob', product_data: {name: 'Adelanto de Reserva (30%)'}, unit_amount: advanceCents},
    }] : priced.lines.map(line => ({
      quantity: 1,
      price_data: {currency: 'bob', product_data: {name: line.name}, unit_amount: line.amount},
    }));
    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) throw new HttpError(503, 'El servicio de pagos no está configurado');
    stripe = new Stripe(process.env.STRIPE_SK);
    stripeSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      customer_email: session.user.email,
      success_url: new URL('/orders/' + order._id + '?clear-cart=1', baseUrl).toString(),
      cancel_url: new URL('/cart?canceled=1', baseUrl).toString(),
      metadata: {orderId: order._id.toString()},
      payment_intent_data: {metadata: {orderId: order._id.toString()}},
      shipping_options: [{
        shipping_rate_data: {
          display_name: 'Gastos de envío / Procesamiento', type: 'fixed_amount',
          fixed_amount: {amount: 500, currency: 'bob'},
        },
      }],
    });
    order.stripeSessionId = stripeSession.id;
    order.expectedPaymentAmount = (advance ? advanceCents : priced.total) + 500;
    await order.save();
    return Response.json(stripeSession.url);
  } catch (error) {
    if (stripeSession) {
      try { await stripe.checkout.sessions.expire(stripeSession.id); }
      catch { console.error('No se pudo cancelar la sesión de pago'); }
    }
    return errorResponse(error);
  }
}
