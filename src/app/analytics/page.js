'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color = "primary" }) {
  const colors = {
    primary: "from-primary-600 to-primary-800",
    green:   "from-emerald-500 to-emerald-700",
    orange:  "from-orange-500 to-orange-700",
    purple:  "from-purple-500 to-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-3xl p-6 text-white shadow-xl`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-black tracking-tighter">{value}</div>
      <div className="text-sm font-semibold opacity-80 mt-1">{label}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

function TrendBadge({ trend, changePercent }) {
  if (trend === "up")
    return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">↑ +{changePercent}%</span>;
  if (trend === "down")
    return <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">↓ {changePercent}%</span>;
  return <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">→ estable</span>;
}

function DemandBar({ level, value }) {
  const colors = { high: "bg-emerald-500", medium: "bg-amber-400", low: "bg-gray-200" };
  const widths = { high: "w-4/5", medium: "w-2/5", low: "w-1/6" };
  const labels = { high: "Alta demanda", medium: "Demanda media", low: "Demanda baja" };
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colors[level]} ${widths[level]}`} />
      </div>
      <span className={`text-xs font-semibold w-28 text-right ${level === "high" ? "text-emerald-600" : level === "medium" ? "text-amber-600" : "text-gray-400"}`}>
        {labels[level]}
      </span>
    </div>
  );
}

function HeatCell({ value }) {
  const opacity =
    value > 75 ? "bg-primary-600" :
    value > 50 ? "bg-primary-400" :
    value > 25 ? "bg-primary-200" :
    value > 0  ? "bg-primary-100" : "bg-gray-50";
  return <div className={`w-5 h-5 rounded-sm ${opacity} flex-shrink-0`} title={`${value}%`} />;
}

// ── Página Principal ───────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: profile, loading } = useProfile();
  const [analytics, setAnalytics]   = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | predictions

  useEffect(() => {
    if (!loading) {
      if (!profile?.admin) {
        redirect("/");
        return;
      }
      Promise.all([
        fetch("/api/analytics").then(r => r.json()),
        fetch("/api/predictions").then(r => r.json()),
      ]).then(([a, p]) => {
        setAnalytics(a);
        setPredictions(p);
        setLoadingData(false);
      });
    }
  }, [loading, profile]);

  if (loading || loadingData) {
    return (
      <section className="mt-8 max-w-6xl mx-auto">
        <UserTabs isAdmin={true} />
        <div className="mt-20 text-center text-gray-400 font-medium animate-pulse">
          Cargando Analytics... 📊
        </div>
      </section>
    );
  }

  const { kpis, topItems, topCustomers, ordersByHour, paymentBreakdown } = analytics;
  const { trending, hourlyPredictions, heatmap, dayOfWeekData, currentHour, predictWindow, dataQuality } = predictions;

  // Horas activas del restaurante para el heatmap (11-22h)
  const activeHours = Array.from({ length: 12 }, (_, i) => i + 11);

  return (
    <section className="mt-8 mb-24 max-w-6xl mx-auto">
      <UserTabs isAdmin={true} />

      <div className="mt-12">
        <SectionHeaders mainHeader="Analytics" subHeader="Panel de Control" />

        {/* Data quality notice */}
        <div className={`mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium w-fit mx-auto ${
          dataQuality.hasEnoughData
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          <span>{dataQuality.hasEnoughData ? "🧠" : "⚠️"}</span>
          <span>{dataQuality.message} · <strong>{dataQuality.totalOrders}</strong> pedidos analizados</span>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-3 mt-8 mb-10">
          {[
            { id: "overview", label: "📊 Resumen" },
            { id: "predictions", label: "🔮 Predicciones" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ═══════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-10">

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon="📦" label="Pedidos totales"  value={kpis.totalOrders}  sub={`${kpis.todayOrders} hoy`}     color="primary" />
              <KpiCard icon="💰" label="Ingresos totales" value={`Bs ${kpis.totalRevenue}`} sub={`Bs ${kpis.todayRevenue} hoy`} color="green"   />
              <KpiCard icon="👥" label="Clientes únicos"  value={kpis.uniqueCustomers} sub={`${kpis.weekOrders} pedidos esta semana`} color="orange" />
              <KpiCard icon="🍽️" label="Platos en menú"  value={kpis.totalMenuItems}  sub="ítems disponibles" color="purple" />
            </div>

            {/* Ranking de platos + Clientes frecuentes */}
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Ranking */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
                <h3 className="text-xl font-black text-primary-950 mb-6">🏆 Platos más pedidos</h3>
                {topItems.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Sin datos aún</p>
                ) : (
                  <div className="space-y-4">
                    {topItems.map((item, i) => {
                      const maxCount = topItems[0]?.count || 1;
                      const pct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className={`text-sm font-black w-5 text-right ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-300"}`}>
                            {i + 1}
                          </span>
                          {item.menuItem?.image && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                              <Image src={item.menuItem.image} alt={item.name} width={40} height={40} className="object-contain w-full h-full" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm text-gray-800 truncate">{item.name}</span>
                              <span className="text-xs text-gray-500 ml-2 shrink-0">{item.count} pedidos</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Clientes frecuentes */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
                <h3 className="text-xl font-black text-primary-950 mb-6">👥 Clientes frecuentes</h3>
                {topCustomers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Sin datos aún</p>
                ) : (
                  <div className="space-y-3">
                    {topCustomers.map((c, i) => (
                      <div key={c.email} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-black text-sm shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{c.email}</p>
                          <p className="text-xs text-gray-400">{c.count} pedidos realizados</p>
                        </div>
                        <div className="shrink-0 bg-primary-50 text-primary-700 text-xs font-black px-3 py-1 rounded-full">
                          {c.count}x
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Métodos de pago */}
                <h3 className="text-lg font-black text-primary-950 mt-8 mb-4">💳 Métodos de pago</h3>
                <div className="space-y-2">
                  {Object.entries(paymentBreakdown).map(([method, count]) => {
                    const total = Object.values(paymentBreakdown).reduce((s, v) => s + v, 0);
                    const pct = Math.round((count / total) * 100);
                    const labels = { total: "💳 Pago total", advance: "📲 Adelanto 30%", cash: "💵 Efectivo" };
                    return (
                      <div key={method} className="flex items-center gap-3">
                        <span className="text-sm w-36 text-gray-600">{labels[method] || method}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="h-full bg-primary-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pedidos por hora del día */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
              <h3 className="text-xl font-black text-primary-950 mb-6">🕐 Pedidos por hora del día</h3>
              <div className="flex items-end gap-1.5 h-32 overflow-x-auto pb-6">
                {ordersByHour.map((count, hour) => {
                  if (hour < 10 || hour > 22) return null;
                  const max = Math.max(...ordersByHour, 1);
                  const height = Math.max((count / max) * 100, count > 0 ? 8 : 0);
                  const isCurrent = hour === currentHour;
                  return (
                    <div key={hour} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]">
                      <span className="text-xs text-gray-500">{count || ""}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isCurrent ? "bg-accent-fire" : "bg-primary-400"
                        }`}
                        style={{ height: `${height}%`, minHeight: count > 0 ? "6px" : "0" }}
                      />
                      <span className={`text-[10px] font-medium ${isCurrent ? "text-accent-fire font-bold" : "text-gray-400"}`}>
                        {hour}h
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 text-center">La barra naranja indica la hora actual</p>
            </div>

            {/* Pedidos por día de semana */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
              <h3 className="text-xl font-black text-primary-950 mb-6">📅 Pedidos por día de la semana</h3>
              <div className="grid grid-cols-7 gap-2">
                {dayOfWeekData.map((d) => {
                  const max = Math.max(...dayOfWeekData.map(x => x.count), 1);
                  const pct = Math.round((d.count / max) * 100);
                  const isToday = d.name === ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()];
                  return (
                    <div key={d.name} className="flex flex-col items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">{d.count}</span>
                      <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-20 flex items-end">
                        <div
                          className={`w-full rounded-lg transition-all duration-500 ${isToday ? "bg-accent-fire" : "bg-primary-400"}`}
                          style={{ height: `${pct}%`, minHeight: d.count > 0 ? "6px" : "0" }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${isToday ? "text-accent-fire" : "text-gray-400"}`}>{d.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: PREDICCIONES ════════════════════════════════════════════════ */}
        {activeTab === "predictions" && (
          <div className="space-y-10">

            {/* Predicción próximas horas */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-primary-950">
                  🔮 Demanda esperada próximas horas
                </h3>
                <span className="text-sm bg-primary-50 text-primary-700 font-semibold px-3 py-1.5 rounded-full">
                  Ahora: {currentHour}:00 — {(currentHour + 2) % 24}:00
                </span>
              </div>

              {hourlyPredictions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">📉</p>
                  <p className="font-medium">Sin suficientes pedidos para predecir</p>
                  <p className="text-sm mt-1">El modelo necesita al menos 5 pedidos con horarios registrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hourlyPredictions.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      {item.image && (
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.image} alt={item.name} width={48} height={48} className="object-contain w-full h-full" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-800 truncate">{item.name}</span>
                          {item.basePrice > 0 && (
                            <span className="text-xs text-gray-400 shrink-0">Bs {item.basePrice}</span>
                          )}
                        </div>
                        <DemandBar level={item.demandLevel} value={item.predictedDemand} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50">
              <h3 className="text-xl font-black text-primary-950 mb-2">📈 Tendencias esta semana</h3>
              <p className="text-sm text-gray-400 mb-6">Comparando últimos 3 días vs la semana anterior</p>

              {trending.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Sin suficientes datos de tendencias</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {trending.map((item) => (
                    <div key={item.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${
                      item.trend === "up"   ? "border-emerald-100 bg-emerald-50" :
                      item.trend === "down" ? "border-red-100 bg-red-50" :
                                              "border-gray-100 bg-gray-50"
                    }`}>
                      {item.image && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                          <Image src={item.image} alt={item.name} width={48} height={48} className="object-contain w-full h-full" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <TrendBadge trend={item.trend} changePercent={Math.abs(item.changePercent)} />
                          <span className="text-xs text-gray-400">
                            {item.recentCount} recientes · {item.olderCount} anteriores
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Heatmap */}
            {heatmap.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-50 overflow-x-auto">
                <h3 className="text-xl font-black text-primary-950 mb-2">🌡️ Mapa de calor — Popularidad por hora</h3>
                <p className="text-sm text-gray-400 mb-6">Qué tan popular es cada plato en cada hora del día</p>

                <div className="min-w-[600px]">
                  {/* Header de horas */}
                  <div className="flex items-center gap-1 mb-3 ml-36">
                    {activeHours.map(h => (
                      <div key={h} className={`w-5 text-center text-[10px] font-bold ${h === currentHour ? "text-accent-fire" : "text-gray-400"}`}>
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Filas del heatmap */}
                  {heatmap.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 mb-2">
                      <span className="w-36 text-xs font-semibold text-gray-600 truncate pr-2 text-right shrink-0">
                        {item.name}
                      </span>
                      {activeHours.map(h => (
                        <HeatCell key={h} value={item.hours[h]} />
                      ))}
                    </div>
                  ))}

                  {/* Leyenda */}
                  <div className="flex items-center gap-2 mt-4 ml-36">
                    <span className="text-[10px] text-gray-400">Menos</span>
                    {[0, 25, 50, 75, 100].map(v => <HeatCell key={v} value={v} />)}
                    <span className="text-[10px] text-gray-400">Más</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
