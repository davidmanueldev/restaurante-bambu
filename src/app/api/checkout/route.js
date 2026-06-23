import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {MenuItem} from "@/models/MenuItem";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const {cartProducts, address, selectedTime, paymentMethod, isLargeOrder} = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDoc = await Order.create({
    userEmail,
    ...address,
    cartProducts,
    selectedTime,
    paymentMethod,
    paid: false,
  });

  let totalProductsPrice = 0;
  const stripeLineItems = [];

  for (const cartProduct of cartProducts) {
    let productPrice = 0;
    
    if (cartProduct.isPlate) {
      // Trust the client price for dynamic plates (in a real scenario, re-validate config here)
      productPrice = cartProduct.basePrice;
    } else {
      const productInfo = await MenuItem.findById(cartProduct._id);
      productPrice = productInfo.basePrice;
      
      if (cartProduct.size) {
        const size = productInfo.sizes
          .find(size => size._id.toString() === cartProduct.size._id.toString());
        productPrice += size.price;
      }
      if (cartProduct.extras?.length > 0) {
        for (const cartProductExtraThing of cartProduct.extras) {
          const productExtras = productInfo.extraIngredientPrices;
          const extraThingInfo = productExtras
            .find(extra => extra._id.toString() === cartProductExtraThing._id.toString());
          productPrice += extraThingInfo.price;
        }
      }
    }

    totalProductsPrice += productPrice;

    if (paymentMethod === 'total') {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: 'BOB',
          product_data: {
            name: cartProduct.name,
          },
          unit_amount: productPrice * 100,
        },
      });
    }
  }

  // Handle Advance Payment
  let advanceAmount = 0;
  if (paymentMethod === 'advance' && isLargeOrder) {
    advanceAmount = Math.round(totalProductsPrice * 0.3);
    orderDoc.advanceAmount = advanceAmount;
    await orderDoc.save();

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: 'BOB',
        product_data: {
          name: "Adelanto de Reserva (30%)",
          description: "Saldo a pagar al momento de recoger el pedido.",
        },
        unit_amount: advanceAmount * 100,
      },
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    customer_email: userEmail,
    success_url: process.env.NEXTAUTH_URL + 'orders/' + orderDoc._id.toString() + '?clear-cart=1',
    cancel_url: process.env.NEXTAUTH_URL + 'cart?canceled=1',
    metadata: {orderId:orderDoc._id.toString()},
    payment_intent_data: {
      metadata:{orderId:orderDoc._id.toString()},
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Gastos de envío / Procesamiento',
          type: 'fixed_amount',
          fixed_amount: {amount: 500, currency: 'BOB'},
        },
      }
    ],
  });

  return Response.json(stripeSession.url);
}