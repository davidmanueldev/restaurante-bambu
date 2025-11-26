import {Order} from "@/models/Order";
import mongoose from "mongoose";

// Endpoint temporal para marcar pedidos como pagados en desarrollo
export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  
  const {orderId} = await req.json();
  
  if (!orderId) {
    return Response.json({error: "Order ID is required"}, {status: 400});
  }
  
  try {
    const result = await Order.updateOne({_id: orderId}, {paid: true});
    
    if (result.matchedCount === 0) {
      return Response.json({error: "Order not found"}, {status: 404});
    }
    
    return Response.json({
      message: "Order marked as paid",
      orderId: orderId,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking order as paid:', error);
    return Response.json({error: "Failed to update order"}, {status: 500});
  }
}