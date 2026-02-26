import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Search,
  Smartphone,
  Mail,
  Package,
  Loader2,
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
      Pagado: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Entregado: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Enviado: "bg-amber-50 text-brand-clay border-brand-clay/10",
      Cancelado: "bg-rose-50 text-rose-700 border-rose-100",
      default: "bg-brand-beige/50 text-brand-black/60 border-brand-black/10",
    };
    const currentStyle = styles[status] || styles.default;

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[8px] font-brand-sans font-bold uppercase tracking-widest border ${currentStyle}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
            Gestión de Órdenes
          </h1>
          <p className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-black/40 mt-1 font-bold">
            {orders.length} pedidos en sistema
          </p>
        </div>
        <div className="relative w-full md:w-64 font-brand-sans">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-black/40" />
          <input
            type="text"
            placeholder="Buscar cliente o # orden..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-brand-black/10 rounded-sm focus:border-brand-clay outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE ÓRDENES */}
      <div className="bg-white border border-brand-black/10 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-brand-black/5 font-brand-sans">
              <tr className="text-left text-[9px] uppercase tracking-[0.2em] text-brand-black/60 font-bold border-b border-brand-black/10">
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Artículos</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5 font-brand-sans">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Loader2
                      className="animate-spin text-brand-clay mx-auto"
                      size={32}
                    />
                    <span className="text-brand-black/20 uppercase text-[9px] tracking-widest mt-4 block">
                      Sincronizando órdenes...
                    </span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-20 text-center text-brand-black/40 text-[10px] uppercase tracking-widest italic"
                  >
                    No se encontraron órdenes en el registro
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-brand-beige/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-brand-black font-bold">
                        #{order.orderNumber}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-brand-black/40 font-bold uppercase tracking-tighter">
                        <Package size={10} className="text-brand-clay" />{" "}
                        {order.items?.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                        piezas
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-black block">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      <span className="text-[10px] text-brand-black/40 font-mono italic">
                        {new Date(order.createdAt).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-black text-xs uppercase tracking-tight">
                        {order.customer?.name}
                      </div>
                      <div className="text-[10px] text-brand-black/40 flex items-center gap-1 truncate max-w-37.5 lowercase">
                        <Mail size={10} /> {order.customer?.email}
                      </div>
                      <div className="text-[10px] text-brand-clay font-bold flex items-center gap-1 mt-0.5">
                        <Smartphone size={10} /> {order.customer?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-brand-black/60 leading-tight italic truncate max-w-45">
                        {order.items
                          ?.map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-brand-black/30 font-mono leading-none mb-0.5">
                          SUB: $
                          {order.totals?.subtotal?.toLocaleString("es-MX")}
                        </span>
                        <span className="text-[8px] text-brand-black/30 font-mono leading-none mb-1">
                          ENV: $
                          {order.totals?.shipping?.toLocaleString("es-MX")}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-black leading-none">
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
                        className="inline-flex p-3 text-brand-black/30 hover:text-brand-clay hover:bg-brand-clay/5 rounded-full transition-all"
                        title="Gestionar Pedido"
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
