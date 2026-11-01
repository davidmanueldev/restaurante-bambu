import {connectDB} from '@/libs/db';
import {errorResponse} from '@/libs/httpError';
import {Order} from '@/models/Order';
import {isValidObjectId} from 'mongoose';
import Stripe from 'stripe';

export async function POST(req) {
  let event;
  if (!process.env.STRIPE_SIGN_SECRET || !process.env.STRIPE_SK) {
    return Response.json({error: 'Webhook no configurado'}, {status: 503});
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SK);
    event = stripe.webhooks.constructEvent(
      await req.text(), req.headers.get('stripe-signature'), process.env.STRIPE_SIGN_SECRET
    );
  } catch {
    return Response.json({error: 'Firma de webhook inválida'}, {status: 400});
  }
  try {
    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
      const checkout = event.data.object;
      const orderId = checkout.metadata?.orderId;
      if (checkout.payment_status === 'paid' && typeof orderId === 'string' && isValidObjectId(orderId)) {
        await connectDB();
        const order = await Order.findOne({_id: orderId, stripeSessionId: checkout.id});
        if (!order) return Response.json({error: 'Pedido no encontrado'}, {status: 404});
        if (checkout.currency !== 'bob' || checkout.amount_total !== order.expectedPaymentAmount) {
          return Response.json({error: 'Importe de pago incorrecto'}, {status: 400});
        }
        await Order.updateOne({_id: order._id, paid: false}, {$set: {paid: true}});
      }
    }
    return Response.json('ok');
  } catch (error) { return errorResponse(error); }
}
