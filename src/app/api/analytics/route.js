import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@/models/Category";
import { MenuItem } from "@/models/MenuItem";
import { Order } from "@/models/Order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const admin = await isAdmin();
  if (!admin) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const [allOrders, allItems, allCategories] = await Promise.all([
    Order.find().sort({ createdAt: -1 }),
    MenuItem.find(),
    Category.find(),
  ]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function extractItems(order) {
    const products = Array.isArray(order.cartProducts)
      ? order.cartProducts
      : Object.values(order.cartProducts || {});

    const items = [];
    products.forEach((p) => {
      if (p.plateConfig) {
        p.plateConfig.carnes?.forEach((c) => items.push({ id: c._id?.toString(), name: c.name, price: c.basePrice || 0 }));
        if (p.plateConfig.guarnicion) {
          items.push({ id: p.plateConfig.guarnicion._id?.toString(), name: p.plateConfig.guarnicion.name, price: p.plateConfig.guarnicion.basePrice || 0 });
        }
      } else if (p._id) {
        items.push({ id: p._id?.toString(), name: p.name, price: p.basePrice || 0 });
      }
    });
    return items;
  }

  function getOrderTotal(order) {
    const products = Array.isArray(order.cartProducts)
      ? order.cartProducts
      : Object.values(order.cartProducts || {});
    return products.reduce((sum, p) => sum + (p.basePrice || 0), 0);
  }

  // ── 1. KPIs generales ──────────────────────────────────────────────────────
  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

  const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfToday);
  const weekOrders  = allOrders.filter(o => new Date(o.createdAt) >= startOfWeek);

  const totalRevenue      = allOrders.reduce((s, o) => s + getOrderTotal(o), 0);
  const todayRevenue      = todayOrders.reduce((s, o) => s + getOrderTotal(o), 0);
  const weekRevenue       = weekOrders.reduce((s, o) => s + getOrderTotal(o), 0);
  const uniqueCustomers   = new Set(allOrders.map(o => o.userEmail).filter(Boolean)).size;

  // ── 2. Ranking de platos más pedidos (global) ──────────────────────────────
  const itemFrequency = {};
  allOrders.forEach(order => {
    extractItems(order).forEach(({ id, name, price }) => {
      if (!id) return;
      if (!itemFrequency[id]) itemFrequency[id] = { id, name, count: 0, revenue: 0 };
      itemFrequency[id].count++;
      itemFrequency[id].revenue += price;
    });
  });

  const topItems = Object.values(itemFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(item => ({
      ...item,
      menuItem: allItems.find(i => i._id.toString() === item.id) || null,
    }));

  // ── 3. Clientes más frecuentes ─────────────────────────────────────────────
  const customerFreq = {};
  allOrders.forEach(o => {
    if (!o.userEmail) return;
    customerFreq[o.userEmail] = (customerFreq[o.userEmail] || 0) + 1;
  });
  const topCustomers = Object.entries(customerFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([email, count]) => ({ email, count }));

  // ── 4. Pedidos por hora del día ────────────────────────────────────────────
  const ordersByHour = Array(24).fill(0);
  allOrders.forEach(o => {
    const h = new Date(o.createdAt).getHours();
    ordersByHour[h]++;
  });

  // ── 5. Pedidos por día (últimas 2 semanas) ─────────────────────────────────
  const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14);
  const recentOrders = allOrders.filter(o => new Date(o.createdAt) >= twoWeeksAgo);
  const ordersByDay = {};
  recentOrders.forEach(o => {
    const day = new Date(o.createdAt).toLocaleDateString("es", { month: "short", day: "numeric" });
    ordersByDay[day] = (ordersByDay[day] || 0) + 1;
  });

  // ── 6. Métodos de pago ─────────────────────────────────────────────────────
  const paymentBreakdown = {};
  allOrders.forEach(o => {
    const method = o.paymentMethod || "desconocido";
    paymentBreakdown[method] = (paymentBreakdown[method] || 0) + 1;
  });

  return Response.json({
    kpis: {
      totalOrders: allOrders.length,
      todayOrders: todayOrders.length,
      weekOrders:  weekOrders.length,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      uniqueCustomers,
      totalMenuItems: allItems.length,
    },
    topItems,
    topCustomers,
    ordersByHour,
    ordersByDay,
    paymentBreakdown,
  });
}
