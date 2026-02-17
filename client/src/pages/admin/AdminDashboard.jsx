import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Loader2,
  RefreshCw,
  ChevronDown,
  Package,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🗓️ ESTADOS PARA FILTROS
  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [dateLabel, setDateLabel] = useState("");

  // 🧠 LÓGICA DE RANGO DE FECHAS
  const getDateRange = () => {
    const now = new Date();
    let start = null;
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    let label = "";

    switch (filterType) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0));
        label = "Solo hoy";
        break;

      case "week":
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(now.setDate(diff));
        start.setHours(0, 0, 0, 0);
        label = `Semana actual`;
        break;

      case "month":
        const [year, month] = selectedMonth.split("-");
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0, 23, 59, 59, 999);
        label = start.toLocaleDateString("es-MX", {
          month: "long",
          year: "numeric",
        });
        label = label.charAt(0).toUpperCase() + label.slice(1);
        break;

      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        label = `Año ${now.getFullYear()}`;
        break;

      default:
        start = null;
        label = "Histórico completo";
        break;
    }

    return { start, end, label };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { start, end, label } = getDateRange();
      setDateLabel(label);

      let url = "/orders/stats";
      if (start && end) {
        url += `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }

      const { data } = await clientAxios.get(url);
      setStats(data);
    } catch (err) {
      console.error("Error dashboard:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, selectedMonth]);

  if (loading && !stats)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={32} />
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER DE ACTIVIDAD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-dark/5 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Resumen de Actividad
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/40 mt-2 flex items-center gap-2">
            Mostrando datos de:{" "}
            <span className="text-brand-orange font-bold">{dateLabel}</span>
          </p>
        </div>

        {/* CONTROLES DE FILTRO */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-brand-dark/20 hover:border-brand-orange text-brand-dark text-[10px] font-bold uppercase tracking-widest py-2 pl-3 pr-8 rounded-sm cursor-pointer outline-none transition-colors h-9"
            >
              <option value="all">Histórico</option>
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Por Mes</option>
              <option value="year">Este Año</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-3 text-brand-dark/50 pointer-events-none"
            />
          </div>

          {filterType === "month" && (
            <div className="flex items-center bg-white border border-brand-dark/20 rounded-sm px-2 h-9 animate-in fade-in slide-in-from-left-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none text-[10px] text-brand-dark uppercase font-bold focus:ring-0 py-1 cursor-pointer w-auto outline-none"
              />
            </div>
          )}

          <button
            onClick={fetchStats}
            className="h-9 w-9 flex items-center justify-center border border-brand-dark/10 hover:border-brand-orange text-brand-dark/40 hover:text-brand-orange transition-colors rounded-sm bg-white"
            title="Actualizar datos"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS (GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjeta 1: Ventas */}
        <StatCard
          title={
            filterType === "today" ? "Ganancias de Hoy" : "Ingresos del Periodo"
          }
          value={`$${(stats?.cards?.totalRevenue || 0).toLocaleString("es-MX")}`}
          icon={<DollarSign size={20} />}
          trend={
            filterType === "all"
              ? "Total histórico"
              : `En ${dateLabel.toLowerCase()}`
          }
        />
        {/* Tarjeta 2: Órdenes */}
        <StatCard
          title={
            filterType === "today" ? "Pedidos de Hoy" : "Órdenes del Periodo"
          }
          value={stats?.cards?.totalOrders || 0}
          icon={<TrendingUp size={20} />}
          trend={
            filterType === "today" ? "Procesados hoy" : "Total en este rango"
          }
        />

        {/* Tarjeta 3: Stock */}
        <StatCard
          title="Stock Bajo"
          value={stats?.cards?.lowStockAlerts || 0}
          icon={<AlertTriangle size={20} />}
          isDanger={stats?.cards?.lowStockAlerts > 0}
          trend="Productos por agotarse"
        />

        {/* Tarjeta 3: Pedidos hoy  */}
        <StatCard
          title="Pedidos de Hoy"
          value={stats?.cards?.todayOrders || 0}
          icon={<ShoppingBag size={20} />}
          trend="Movimientos recientes"
        />
      </div>

      {/* 🍶 TABLA DE RENDIMIENTO DEL CATÁLOGO (TUS 4 BOTELLAS) */}
      <div className="bg-white border border-brand-dark/10 rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="px-6 py-4 bg-brand-dark/5 border-b border-brand-dark/10 flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2">
            <Package size={14} /> Rendimiento del Catálogo
          </h3>
          <span className="text-[9px] text-brand-dark/30 font-bold uppercase tracking-tighter">
            Ventas por Etiqueta
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-brand-dark/40 border-b border-brand-dark/5 bg-brand-cream/5">
                <th className="px-6 py-4 font-bold">Bacanora</th>
                <th className="px-6 py-4 text-center font-bold">Unidades</th>
                <th className="px-6 py-4 text-right font-bold">Ingresos</th>
                <th className="px-6 py-4 text-right font-bold">
                  Participación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/5">
              {stats?.productPerformance?.map((product, index) => {
                const percentage =
                  stats.cards.totalRevenue > 0
                    ? (product.revenue / stats.cards.totalRevenue) * 100
                    : 0;

                return (
                  <tr
                    key={index}
                    className="hover:bg-brand-cream/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-brand-dark/20 font-bold">
                          0{index + 1}
                        </span>
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-tight group-hover:text-brand-orange transition-colors">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs font-mono font-bold ${product.qty > 0 ? "text-brand-dark" : "text-brand-dark/20"}`}
                      >
                        {product.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-xs font-mono font-bold ${product.revenue > 0 ? "text-brand-dark" : "text-brand-dark/20"}`}
                      >
                        ${product.revenue.toLocaleString("es-MX")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-20 bg-brand-dark/5 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-orange h-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-brand-dark/40 w-8">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!stats?.productPerformance ||
                stats.productPerformance.length === 0) && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-[10px] uppercase tracking-widest text-brand-dark/20"
                  >
                    No se encontraron datos en el periodo seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
