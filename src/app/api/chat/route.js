import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchMenu, getRestaurantInfo } from "@/libs/chatTools";
import mongoose from "mongoose";
import { Order } from "@/models/Order";

// Ensure DB connection is handled globally in Next.js usually via libs/mongoConnect
// but checking it here doesn't hurt or importing the connection utility
import { getServerSession } from "next-auth";
// Assuming auth options are available to import, or we just trust the userEmail for now if passed?
// Better to check session for security on Order status.
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function POST(req) {
  const body = await req.json();
  const { messages } = body; 
  // messages format expected: [{ role: 'user'|'model', parts: [{ text: '...' }] }] 
  // or simple strings if we adapt. Let's assume we receive the history or just the last message.
  // For simplicity keeping stateless or passing history. Let's start with passing history.

  // NOTE: Simple implementation assuming we get the full history or just the last text.
  // Standard Vercel AI SDK sends { messages: [] }, but we are doing custom Gemini implementation.
  // Let's assume input is { message: "Hola" } for single turn or handle history client side.
  
  const userMessage = body.message;

  if (!process.env.GOOGLE_API_KEY) {
    return Response.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Tools Definition
  const tools = {
    functionDeclarations: [
      {
        name: "searchMenu",
        description: "Busca platos en el menú del restaurante por nombre o categoría.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: { type: "STRING", description: "El nombre del plato o ingrediente a buscar (ej. 'pollo')." },
            category: { type: "STRING", description: "La categoría del plato (ej. 'Entradas', 'Bebidas')." }
          },
        },
      },
      {
        name: "getRestaurantInfo",
        description: "Obtiene información general del restaurante como horarios, ubicación y métodos de pago.",
      },
      {
        name: "getOrderStatus",
        description: "Obtiene el estado de un pedido dado su ID (solo si el usuario lo proporciona).",
        parameters: {
            type: "OBJECT",
            properties: {
                orderId: { type: "STRING", description: "El ID del pedido que el usuario quiere consultar." }
            },
            required: ["orderId"]
        }
      }
    ],
  };

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    tools: [tools],
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hola, eres el asistente del Restaurante. Compórtate como tal." }],
      },
      {
        role: "model",
        parts: [{ text: "Hola! Soy el asistente virtual del Restaurante Bambú. Estoy aquí para ayudarte a explorar nuestro menú, resolver tus dudas sobre nuestros servicios o consultar el estado de tus pedidos. ¿En qué puedo ayudarte hoy?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const call = response.functionCalls();

    if (call && call.length > 0) {
        const firstCall = call[0];
        const functionName = firstCall.name;
        const args = firstCall.args;

        let toolResult = null;

        if (functionName === "searchMenu") {
            toolResult = await searchMenu(args.query, args.category);
        } else if (functionName === "getRestaurantInfo") {
            toolResult = getRestaurantInfo();
        } else if (functionName === "getOrderStatus") {
            // Basic secure check: in real app, verify user owns order.
            // For now, simple query.
            if (mongoose.connection.readyState === 0) {
                 await mongoose.connect(process.env.MONGO_URL);
            }
            try {
                const order = await Order.findById(args.orderId).lean();
                if (order) {
                    toolResult = {
                         id: order._id,
                         paid: order.paid,
                         status: order.paid ? "Pagado y en preparación" : "Pendiente de pago",
                         products: order.cartProducts.length
                    };
                } else {
                    toolResult = { error: "Pedido no encontrado." };
                }
            } catch (e) {
                toolResult = { error: "ID de pedido inválido." };
            }
        }

        // Send tool result back to model to get final natural language response
        const result2 = await chat.sendMessage([
            {
                functionResponse: {
                    name: functionName,
                    response: { result: toolResult }
                }
            }
        ]);
        return Response.json({ text: result2.response.text() });
    }

    return Response.json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return Response.json({ error: "Lo siento, tuve un problema procesando tu solicitud." }, { status: 500 });
  }
}
