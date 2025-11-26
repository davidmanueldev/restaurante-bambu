import {Order} from "@/models/Order";
import mongoose from "mongoose";

const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error('stripe error');
    console.log(e);
    return Response.json(e, {status: 400});
  }

  // Conectar a MongoDB
  mongoose.connect(process.env.MONGO_URL);

  if (event.type === 'checkout.session.completed') {
    console.log('Checkout session completed:', event);
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === 'paid';
    
    console.log('Order ID:', orderId);
    console.log('Is Paid:', isPaid);
    
    if (isPaid && orderId) {
      try {
        const result = await Order.updateOne({_id:orderId}, {paid:true});
        console.log('Order updated:', result);
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }

  return Response.json('ok', {status: 200});
}