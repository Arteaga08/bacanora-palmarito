import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  Smartphone,
  Mail,
  Package,
} from "lucide-react";
import clientAxios from "../../services/axiosConfig";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await clientAxios.get("/orders");
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) || (order.orderNumber || "").includes(searchTerm),
  );

  const getStatusBadge = (status) => {
    const styles = {
      Pagado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Entregado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Enviado: "bg-sky-100 text-sky-800 border-sky-200",
      Cancelado: "bg-rose-100 text-rose-800 border-rose-200",
      default: "bg-amber-100 text-amber-800 border-amber-200",
    };
    const currentStyle = styles[status] || styles.default;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${currentStyle}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-dark/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Gestión de Órdenes
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/40 mt-1 font-bold">
            {orders.length} pedidos en sistema
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-dark/40" />
          <input
            type="text"
            placeholder="Buscar cliente o # orden..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-brand-dark/10 rounded-sm focus:border-brand-orange outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-brand-dark/10 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-brand-dark/5">
              <tr className="text-left text-[9px] uppercase tracking-[0.2em] text-brand-dark/60 font-bold border-b border-brand-dark/10">
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Artículos</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Guia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-brand-dark/40 animate-pulse uppercase text-[10px] tracking-widest"
                  >
                    Sincronizando...
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-brand-cream/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-brand-dark font-bold">
                        #{order.orderNumber}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-brand-dark/40 font-bold uppercase tracking-tighter">
                        <Package size={10} />{" "}
                        {order.items?.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                        piezas
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-dark block">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      <span className="text-[10px] text-brand-dark/40 font-mono italic">
                        {new Date(order.createdAt).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-dark text-xs uppercase tracking-tight">
                        {order.customer?.name}
                      </div>
                      <div className="text-[10px] text-brand-dark/40 flex items-center gap-1 truncate max-w-37.5">
                        <Mail size={10} /> {order.customer?.email}
                      </div>
                      <div className="text-[10px] text-brand-orange font-bold flex items-center gap-1">
                        <Smartphone size={10} /> {order.customer?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-brand-dark/60 leading-tight italic truncate max-w-45">
                        {order.items
                          ?.map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </div>
                    </td>
                    {/* 👇 COLUMNA DE TOTAL CON MÁS INFORMACIÓN */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-brand-dark/40 font-mono leading-none mb-0.5">
                          SUB: $
                          {order.totals?.subtotal?.toLocaleString("es-MX")}
                        </span>
                        <span className="text-[9px] text-brand-dark/40 font-mono leading-none mb-1">
                          ENV: $
                          {order.totals?.shipping?.toLocaleString("es-MX")}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-dark leading-none">
                          ${order.totals?.total?.toLocaleString("es-MX")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex p-2 text-brand-dark/40 hover:text-brand-orange hover:bg-brand-orange/5 rounded-full transition-all"
                      >
                        <Edit3 size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
