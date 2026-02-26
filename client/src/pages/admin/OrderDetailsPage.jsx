import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import {
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Smartphone,
  Package,
  Truck,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [localCarrier, setLocalCarrier] = useState("");
  const [localTracking, setLocalTracking] = useState("");
  const [isCustomCarrier, setIsCustomCarrier] = useState(false);

  const CARRIER_OPTIONS = ["DHL", "FedEx", "Estafeta"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await clientAxios.get(`/orders/${id}`);
        setOrder(data);
        const carrier = data.shipping?.carrier || "";
        setLocalTracking(data.shipping?.trackingNumber || "");

        if (carrier && !CARRIER_OPTIONS.includes(carrier)) {
          setLocalCarrier("Otro");
          setIsCustomCarrier(true);
        } else {
          setLocalCarrier(carrier);
          setIsCustomCarrier(false);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateTracking = async () => {
    const finalCarrier = isCustomCarrier
      ? document.getElementById("customCarrier").value
      : localCarrier;

    if (!finalCarrier || !localTracking)
      return alert("Completa paquetería y guía.");

    try {
      setUpdating(true);
      await clientAxios.put(`/orders/${order.orderNumber}/tracking`, {
        carrier: finalCarrier,
        trackingNumber: localTracking,
      });
      setOrder({
        ...order,
        status: "Enviado",
        shipping: {
          ...order.shipping,
          carrier: finalCarrier,
          trackingNumber: localTracking,
        },
      });
    } catch (error) {
      alert("Error al procesar el envío.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-clay" size={32} />
        <span className="text-[10px] uppercase tracking-widest text-brand-black/20 mt-4">
          Consultando expediente...
        </span>
      </div>
    );

  const hasChanges =
    (isCustomCarrier
      ? order?.shipping?.carrier !==
        document.getElementById("customCarrier")?.value
      : localCarrier !== (order?.shipping?.carrier || "")) ||
    localTracking !== (order?.shipping?.trackingNumber || "");

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto font-brand-sans">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-brand-black/10 pb-6">
        <Link
          to="/admin/orders"
          className="p-2 rounded-full hover:bg-brand-black/5 transition-colors text-brand-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-brand-serif text-brand-black tracking-tighter flex items-center gap-3">
            Orden #{order.orderNumber}
            <span
              className={`text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-widest border font-bold ${order.status === "Enviado" || order.status === "Entregado" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-brand-clay/10 text-brand-clay border-brand-clay/20"}`}
            >
              {order.status}
            </span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mt-1 flex items-center gap-2 font-bold">
            <Calendar size={12} className="text-brand-clay" />
            {new Date(order.createdAt).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COMPRA Y TOTALES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-black/10 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-brand-black/5 border-b border-brand-black/10 flex justify-between">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 flex items-center gap-2">
                <Package size={14} className="text-brand-clay" /> Detalle de
                Compra
              </h3>
            </div>
            <div className="divide-y divide-brand-black/5">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="p-5 flex items-center gap-6 group hover:bg-brand-beige/5 transition-colors"
                >
                  <div className="w-12 h-14 bg-brand-black text-brand-beige rounded-sm flex flex-col items-center justify-center shrink-0 shadow-md">
                    <span className="text-[8px] uppercase font-bold opacity-60 leading-none mb-1">
                      Cant
                    </span>
                    <span className="text-lg font-brand-serif font-bold leading-none">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-brand-black uppercase tracking-tight">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-brand-black/40 font-mono mt-1 italic">
                      SKU: {item.slug}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-brand-black">
                      ${item.price?.toLocaleString("es-MX")}
                    </p>
                    <p className="text-[9px] font-bold text-brand-clay mt-1 uppercase tracking-tighter">
                      Subt: $
                      {(item.price * item.quantity).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-brand-black/10 rounded-sm p-8 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] text-brand-black/60 font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="font-mono">
                  ${order.totals?.subtotal?.toLocaleString("es-MX")}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-brand-black/40 font-bold uppercase tracking-widest">
                <span>IVA Incluido</span>
                <span className="font-mono">
                  ${order.totals?.tax?.toLocaleString("es-MX") || "0"}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-brand-black/60 font-bold uppercase tracking-widest">
                <span>Envío</span>
                <span className="font-mono">
                  {order.totals?.shipping > 0
                    ? `$${order.totals.shipping.toLocaleString("es-MX")}`
                    : "Cortesía"}
                </span>
              </div>
              <div className="border-t border-brand-black/10 pt-4 mt-2 flex justify-between items-center">
                <span className="text-lg font-brand-serif font-bold text-brand-black uppercase tracking-tighter">
                  Total Pagado
                </span>
                <span className="text-2xl font-brand-serif font-bold text-brand-clay">
                  ${order.totals?.total?.toLocaleString("es-MX")}
                </span>
              </div>
            </div>
          </div>

          {order.customerNote && (
            <div className="bg-brand-clay/5 border border-brand-clay/20 p-6 rounded-sm flex gap-4 shadow-inner">
              <AlertTriangle className="text-brand-clay shrink-0" size={24} />
              <div>
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-clay mb-1">
                  Nota del Cliente:
                </h4>
                <p className="text-sm text-brand-black/80 italic font-medium leading-relaxed">
                  "{order.customerNote}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LOGÍSTICA Y CLIENTE */}
        <div className="space-y-6">
          <div className="bg-white border border-brand-black/10 rounded-sm p-6 shadow-md border-t-4 border-t-brand-black">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 mb-5 flex items-center gap-2">
              <Truck size={14} className="text-brand-clay" /> Logística de Envío
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold mb-1.5 block">
                  Paquetería
                </label>
                <div className="relative">
                  <select
                    value={localCarrier}
                    onChange={(e) => {
                      setLocalCarrier(e.target.value);
                      setIsCustomCarrier(e.target.value === "Otro");
                    }}
                    className="w-full p-2.5 bg-brand-black/5 border border-brand-black/10 rounded-sm text-[10px] font-bold uppercase tracking-widest outline-none appearance-none focus:border-brand-clay"
                  >
                    <option value="">Seleccionar...</option>
                    {CARRIER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="Otro">Otro (Manual)</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-3 pointer-events-none text-brand-black/30"
                  />
                </div>
              </div>
              {isCustomCarrier && (
                <input
                  id="customCarrier"
                  type="text"
                  placeholder="Nombre de paquetería"
                  className="w-full p-2.5 border border-brand-black/10 rounded-sm text-xs outline-none focus:border-brand-clay bg-brand-beige/5 uppercase tracking-widest"
                />
              )}
              <div>
                <label className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold mb-1.5 block">
                  Guía de Rastreo
                </label>
                <input
                  type="text"
                  placeholder="Tracking #"
                  value={localTracking}
                  onChange={(e) => setLocalTracking(e.target.value)}
                  className="w-full p-2.5 border border-brand-black/10 rounded-sm text-sm font-mono focus:border-brand-clay outline-none"
                />
              </div>
              <button
                onClick={handleUpdateTracking}
                disabled={updating || !hasChanges}
                className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all flex items-center justify-center gap-2 ${!hasChanges ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-brand-black text-brand-beige hover:bg-brand-clay shadow-lg"}`}
              >
                {updating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : !hasChanges ? (
                  <>
                    <CheckCircle size={14} /> Guía Guardada
                  </>
                ) : (
                  "Actualizar y Notificar"
                )}
              </button>
            </div>
          </div>

          <div className="bg-white border border-brand-black/10 rounded-sm p-6 shadow-sm space-y-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 flex items-center gap-2 border-b border-brand-black/5 pb-3">
              <User size={14} className="text-brand-clay" /> Cliente
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-brand-black uppercase tracking-tight">
                  {order.customer?.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-brand-black/60 mt-2">
                  <Mail size={12} /> {order.customer?.email}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-clay mt-2 font-bold">
                  <Smartphone size={12} /> {order.customer?.phone}
                </div>
              </div>
              <div className="pt-4 border-t border-brand-black/5">
                <h4 className="text-[9px] uppercase tracking-widest text-brand-black/40 font-bold mb-2 flex items-center gap-2">
                  <MapPin size={12} /> Dirección de Entrega
                </h4>
                <div className="text-[11px] text-brand-black/80 space-y-1 font-medium leading-relaxed">
                  <p className="font-bold">{order.shipping?.address}</p>
                  <p>
                    {order.shipping?.city}, {order.shipping?.state}, CP{" "}
                    {order.shipping?.zip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
