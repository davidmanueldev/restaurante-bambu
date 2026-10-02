import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Obtener todos los items del menú y categorías
  const allItems = await MenuItem.find();
  const categories = await Category.find();

  let recommendations = [];
  let source = "popularity";

  // --- Recomendaciones personales ---
  if (userEmail) {
    const userOrders = await Order.find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(20);

    if (userOrders.length >= 2) {
      const itemFrequency = {};

      userOrders.forEach((order) => {
        const products = Array.isArray(order.cartProducts)
          ? order.cartProducts
          : Object.values(order.cartProducts || {});

        products.forEach((product) => {
          // Contar carnes y guarniciones dentro de platos configurados
          if (product.plateConfig) {
            product.plateConfig.carnes?.forEach((c) => {
              const id = c._id?.toString();
              if (id) itemFrequency[id] = (itemFrequency[id] || 0) + 2; // carnes pesan más
            });
            if (product.plateConfig.guarnicion) {
              const gId = product.plateConfig.guarnicion._id?.toString();
              if (gId) itemFrequency[gId] = (itemFrequency[gId] || 0) + 1;
            }
          } else if (product._id && !product.isPlate) {
            // Items directos del menú
            const id = product._id?.toString();
            if (id) itemFrequency[id] = (itemFrequency[id] || 0) + 1;
          }
        });
      });

      const sortedIds = Object.entries(itemFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([id]) => id);

      const personalItems = sortedIds
        .map((id) =>
          allItems.find((item) => item._id.toString() === id)
        )
        .filter(Boolean);

      if (personalItems.length >= 2) {
        recommendations = personalItems;
        source = "personal";
      }
    }
  }

  // --- Fallback: popularidad global ---
  if (recommendations.length === 0) {
    const allOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100);

    const globalFrequency = {};

    allOrders.forEach((order) => {
      const products = Array.isArray(order.cartProducts)
        ? order.cartProducts
        : Object.values(order.cartProducts || {});

      products.forEach((product) => {
        if (product.plateConfig) {
          product.plateConfig.carnes?.forEach((c) => {
            const id = c._id?.toString();
            if (id) globalFrequency[id] = (globalFrequency[id] || 0) + 2;
          });
          if (product.plateConfig.guarnicion) {
            const gId = product.plateConfig.guarnicion._id?.toString();
            if (gId) globalFrequency[gId] = (globalFrequency[gId] || 0) + 1;
          }
        } else if (product._id && !product.isPlate) {
          const id = product._id?.toString();
          if (id) globalFrequency[id] = (globalFrequency[id] || 0) + 1;
        }
      });
    });

    if (Object.keys(globalFrequency).length >= 2) {
      const sortedGlobalIds = Object.entries(globalFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([id]) => id);

      const globalItems = sortedGlobalIds
        .map((id) =>
          allItems.find((item) => item._id.toString() === id)
        )
        .filter(Boolean);

      recommendations = globalItems;
    } else {
      // Sin datos suficientes: devolver items aleatorios del menú
      recommendations = [...allItems].sort(() => Math.random() - 0.5).slice(0, 6);
    }
    source = "popularity";
  }

  // Enriquecer items con nombre de categoría
  const enriched = recommendations.map((item) => {
    const category = categories.find(
      (c) => c._id.toString() === item.category?.toString()
    );
    return { ...item.toObject(), categoryName: category?.name || "" };
  });

  // Determinar franja horaria
  const hour = new Date().getHours();
  const timeOfDay = hour >= 11 && hour <= 15 ? "lunch" : "dinner";

  return Response.json({
    recommendations: enriched,
    source,
    timeOfDay,
    message:
      source === "personal"
        ? "🎯 Basado en tus pedidos anteriores"
        : "🔥 Lo más popular del momento",
  });
}
