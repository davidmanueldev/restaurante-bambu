import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

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

  return Response.json(orderDoc);
}
