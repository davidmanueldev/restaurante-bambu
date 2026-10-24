import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const admin = await isAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const allOrders = await Order.find().sort({ createdAt: -1 });
  const allItems  = await MenuItem.find();

  function extractItems(order) {
    const products = Array.isArray(order.cartProducts)
      ? order.cartProducts
      : Object.values(order.cartProducts || {});
    const items = [];
    products.forEach((p) => {
      if (p.plateConfig) {
        p.plateConfig.carnes?.forEach((c) =>
          items.push({ id: c._id?.toString(), name: c.name })
        );
        if (p.plateConfig.guarnicion)
          items.push({ id: p.plateConfig.guarnicion._id?.toString(), name: p.plateConfig.guarnicion.name });
      } else if (p._id) {
        items.push({ id: p._id?.toString(), name: p.name });
      }
    });
    return items;
  }

  const now = new Date();

  // ── 1. TRENDING SCORE ──────────────────────────────────────────────────────
  // Compara pedidos últimos 3 días vs 3-10 días atrás
  const threeDaysAgo = new Date(now); threeDaysAgo.setDate(now.getDate() - 3);
  const tenDaysAgo   = new Date(now); tenDaysAgo.setDate(now.getDate() - 10);

  const recentOrders = allOrders.filter(o => new Date(o.createdAt) >= threeDaysAgo);
  const olderOrders  = allOrders.filter(o => {
    const d = new Date(o.createdAt);
    return d >= tenDaysAgo && d < threeDaysAgo;
  });

  const recentFreq = {};
  const olderFreq  = {};

  recentOrders.forEach(o => extractItems(o).forEach(({ id, name }) => {
    if (!id) return;
    recentFreq[id] = recentFreq[id] || { id, name, count: 0 };
    recentFreq[id].count++;
  }));

  olderOrders.forEach(o => extractItems(o).forEach(({ id, name }) => {
    if (!id) return;
    olderFreq[id] = olderFreq[id] || { id, name, count: 0 };
    olderFreq[id].count++;
  }));

  // Calcular trending score para cada ítem
  const allItemIds = new Set([
    ...Object.keys(recentFreq),
    ...Object.keys(olderFreq),
  ]);

  const trendingScores = [];
  allItemIds.forEach(id => {
    const recent = recentFreq[id]?.count || 0;
    const older  = olderFreq[id]?.count  || 0;
    const name   = recentFreq[id]?.name  || olderFreq[id]?.name || "Desconocido";

    // Score: cuánto subió/bajó la demanda reciente vs la anterior
    // Normalizamos por número de días (3 vs 7)
    const recentNorm = (recent / 3);
    const olderNorm  = (older  / 7);
    const score = recentNorm / (olderNorm + 0.1); // +0.1 evita división por 0

    const menuItem = allItems.find(i => i._id.toString() === id);

    trendingScores.push({
      id,
      name,
      image: menuItem?.image || null,
      recentCount: recent,
      olderCount: older,
      score: Math.round(score * 100) / 100,
      trend: score >= 1.5 ? "up" : score <= 0.7 ? "down" : "stable",
      // % cambio para mostrar en UI
      changePercent: olderNorm > 0
        ? Math.round(((recentNorm - olderNorm) / olderNorm) * 100)
        : recent > 0 ? 100 : 0,
    });
  });

  const trending = trendingScores
    .filter(i => i.recentCount > 0 || i.olderCount > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // ── 2. PREDICCIÓN DE DEMANDA POR HORA ─────────────────────────────────────
  // Para cada ítem, calcula su distribución histórica por hora
  const itemHourlyMap = {}; // { itemId: { hour: count } }

  allOrders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    extractItems(order).forEach(({ id, name }) => {
      if (!id) return;
      if (!itemHourlyMap[id]) itemHourlyMap[id] = { name, hours: Array(24).fill(0), total: 0 };
      itemHourlyMap[id].hours[hour]++;
      itemHourlyMap[id].total++;
    });
  });

  // Para la hora actual y las próximas 2 horas, predecir qué se pedirá
  const currentHour = now.getHours();
  const predictWindow = [currentHour, currentHour + 1, currentHour + 2].map(h => h % 24);

  const hourlyPredictions = Object.entries(itemHourlyMap)
    .map(([id, data]) => {
      const windowCount = predictWindow.reduce((sum, h) => sum + data.hours[h], 0);
      const windowPct   = data.total > 0 ? (windowCount / data.total) : 0;
      const menuItem    = allItems.find(i => i._id.toString() === id);

      return {
        id,
        name: data.name,
        image: menuItem?.image || null,
        basePrice: menuItem?.basePrice || 0,
        predictedDemand: windowPct, // 0-1 probabilidad en este rango horario
        demandLevel:
          windowPct >= 0.35 ? "high" :
          windowPct >= 0.15 ? "medium" : "low",
        hourlyDistribution: data.hours, // array de 24 valores
        total: data.total,
      };
    })
    .filter(i => i.total >= 1)
    .sort((a, b) => b.predictedDemand - a.predictedDemand)
    .slice(0, 6);

  // ── 3. HEATMAP: ítem × hora (top 5 ítems) ─────────────────────────────────
  const top5Ids = hourlyPredictions.slice(0, 5).map(i => i.id);
  const heatmap = top5Ids.map(id => {
    const data = itemHourlyMap[id];
    // Normalizar por el máximo para que sea 0-1
    const max = Math.max(...data.hours, 1);
    return {
      id,
      name: data.name,
      hours: data.hours.map(v => Math.round((v / max) * 100)), // 0-100
    };
  });

  // ── 4. PATRÓN DÍA DE SEMANA ───────────────────────────────────────────────
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const ordersByDayOfWeek = Array(7).fill(0);
  allOrders.forEach(o => {
    ordersByDayOfWeek[new Date(o.createdAt).getDay()]++;
  });
  const dayOfWeekData = dayNames.map((name, i) => ({
    name,
    count: ordersByDayOfWeek[i],
  }));

  return Response.json({
    trending,
    hourlyPredictions,
    heatmap,
    dayOfWeekData,
    currentHour,
    predictWindow,
    dataQuality: {
      totalOrders: allOrders.length,
      hasEnoughData: allOrders.length >= 10,
      message: allOrders.length < 10
        ? "Se necesitan más pedidos para mejorar las predicciones"
        : "Modelo funcionando con datos reales",
    },
  });
}
