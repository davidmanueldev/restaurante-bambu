import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    mongoose.connect(process.env.MONGO_URL);

    const { message, conversationHistory = [] } = await req.json();

    if (!message?.trim()) {
      return Response.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "TU_API_KEY_AQUI") {
      return Response.json({
        reply:
          "⚠️ El chatbot aún no está configurado. Por favor, agrega una API key de Google Gemini en el archivo .env (variable GEMINI_API_KEY). Puedes obtenerla gratis en https://aistudio.google.com/apikey",
      });
    }

    // Obtener menú y categorías para el contexto
    const [menuItems, categories] = await Promise.all([
      MenuItem.find(),
      Category.find(),
    ]);

    const menuContext = menuItems
      .map((item) => {
        const cat = categories.find(
          (c) => c._id.toString() === item.category?.toString()
        );
        const sizes = item.sizes?.length
          ? ` | Tamaños: ${item.sizes.map((s) => `${s.name} +Bs${s.price}`).join(", ")}`
          : "";
        const extras = item.extraIngredientPrices?.length
          ? ` | Extras: ${item.extraIngredientPrices.map((e) => `${e.name} +Bs${e.price}`).join(", ")}`
          : "";
        return `• ${item.name} — Bs ${item.basePrice} [${cat?.name || "Sin categoría"}]${sizes}${extras}`;
      })
      .join("\n");

    // Contexto personal del cliente
    let personalContext = "";
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const recentOrders = await Order.find({ userEmail: session.user.email })
        .sort({ createdAt: -1 })
        .limit(5);

      if (recentOrders.length > 0) {
        const lastOrderItems = recentOrders[0].cartProducts;
        const products = Array.isArray(lastOrderItems)
          ? lastOrderItems
          : Object.values(lastOrderItems || {});

        const itemNames = products
          .map((p) => {
            if (p.isPlate && p.plateConfig) {
              const carnes = p.plateConfig.carnes?.map((c) => c.name).join(" + ") || "Sin carne";
              const guar = p.plateConfig.guarnicion?.name || "Sin guarnición";
              return `Plato: ${carnes} con ${guar}`;
            }
            return p.name;
          })
          .filter(Boolean)
          .join(", ");

        personalContext = `
HISTORIAL DEL CLIENTE:
- Nombre: ${session.user.name || session.user.email}
- Total de pedidos anteriores: ${recentOrders.length}
- Último pedido (${new Date(recentOrders[0].createdAt).toLocaleDateString("es")}): ${itemNames}`;
      } else {
        personalContext = `\nCLIENTE: ${session.user.name || session.user.email} (cliente nuevo, sin pedidos anteriores)`;
      }
    }

    const systemPrompt = `Eres el asistente virtual del Restaurante Bambú. 🎋
Eres amigable, servicial y siempre hablas en español latinoamericano.
Tu objetivo es ayudar al cliente a elegir su pedido, responder preguntas y mejorar su experiencia.

━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMACIÓN DEL RESTAURANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nombre: Restaurante Bambú
• Horario: 11:00 AM – 10:00 PM (todos los días)
• Moneda: Bolivianos (Bs)
• Métodos de pago: Tarjeta de crédito/débito (Stripe) o Efectivo al recoger
• Pedidos grandes (3+ platos): requieren pago con tarjeta o adelanto del 30%
• Sistema de puntos: Bambú Rewards — acumulas puntos por cada compra para canjear premios

━━━━━━━━━━━━━━━━━━━━━━━━━━
MENÚ DISPONIBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━
${menuContext}
${personalContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Responde de forma concisa (máximo 2-3 párrafos cortos)
• Si el cliente pregunta por recomendaciones, usa su historial si está disponible
• Usa emojis con moderación para hacer la conversación más amigable
• Si no sabes algo, dilo honestamente y ofrece alternativas
• Si el cliente quiere hacer un pedido, indícale que vaya a /pedidos o /menu en la web
• NO inventes precios, items ni información que no esté en el menú proporcionado`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Construir el historial de conversación para Gemini
    const contents = [];

    // Agregar historial previo
    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Agregar mensaje actual del usuario
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Retry hasta 3 veces en caso de 503 (sobrecarga temporal)
    let response;
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          systemInstruction: systemPrompt,
          contents,
          config: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        });
        break; // éxito → salir del loop
      } catch (retryErr) {
        const is503 = retryErr?.status === 503 || retryErr?.message?.includes("503");
        if (is503 && attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, attempt * 1000)); // 1s, 2s
          continue;
        }
        throw retryErr; // otro error o agotamos reintentos
      }
    }

    const reply = response?.text || "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";

    return Response.json({ reply });
  } catch (error) {
    console.error("[Chat API Error]", error);
    return Response.json(
      {
        reply:
          "Ups, tuve un problema al procesar tu mensaje 😅. Por favor, intenta de nuevo en unos segundos.",
      },
      { status: 200 } // 200 para que el frontend muestre el mensaje de error amablemente
    );
  }
}
