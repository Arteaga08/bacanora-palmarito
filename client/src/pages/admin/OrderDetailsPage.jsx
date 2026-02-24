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
      alert("🚀 Guía actualizada y correo enviado.");
    } catch (error) {
      alert("Error al procesar el envío.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-brand-dark/40 uppercase tracking-widest text-[10px]">
        Consultando expediente...
      </div>
    );

  const hasChanges =
    (isCustomCarrier
      ? order?.shipping?.carrier !== localCarrier
      : localCarrier !== (order?.shipping?.carrier || "")) ||
    localTracking !== (order?.shipping?.trackingNumber || "");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-brand-dark/10 pb-6">
        <Link
          to="/admin/orders"
          className="p-2 rounded-full hover:bg-brand-dark/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif text-brand-dark tracking-tighter flex items-center gap-3">
            Orden #{order.orderNumber}
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest border font-bold ${order.status === "Enviado" || order.status === "Entregado" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
            >
              {order.status}
            </span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mt-1 flex items-center gap-2 font-bold">
            <Calendar size={12} />{" "}
            {new Date(order.createdAt).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-dark/10 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-brand-dark/5 border-b border-brand-dark/10 flex justify-between">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2">
                <Package size={14} /> Detalle de Compra
              </h3>
            </div>
            <div className="divide-y divide-brand-dark/5">
              {order.items?.map((item, index) => (
                <div key={index} className="p-5 flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-dark text-brand-cream rounded-sm flex flex-col items-center justify-center shrink-0 border border-brand-dark shadow-md">
                    <span className="text-[9px] uppercase font-bold opacity-60 leading-none mt-1">
                      Cant
                    </span>
                    <span className="text-xl font-serif font-bold leading-none mb-1">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-brand-dark uppercase tracking-tight leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-brand-dark/40 font-mono mt-1 italic">
                      SKU: {item.slug}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-brand-dark/40 mb-1 font-bold uppercase tracking-tighter">
                      Unitario
                    </p>
                    <p className="text-sm font-mono font-bold text-brand-dark">
                      ${item.price?.toLocaleString("es-MX")}
                    </p>
                    {/* 👇 SUB-TOTAL POR ITEM AGREGADO */}
                    <p className="text-[9px] font-bold text-brand-clay mt-1 uppercase tracking-tighter">
                      Subt: $
                      {(item.price * item.quantity).toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTALES INDEPENDIENTES CON MÁS INFORMACIÓN */}
          <div className="bg-white border border-brand-dark/10 rounded-sm p-8 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-brand-dark/60 font-bold uppercase tracking-widest">
                <span>Subtotal (Productos)</span>
                <span className="font-mono">
                  ${order.totals?.subtotal?.toLocaleString("es-MX")}
                </span>
              </div>

              {/* 👇 IVA AGREGADO */}
              <div className="flex justify-between text-xs text-brand-dark/40 font-bold uppercase tracking-widest">
                <span>IVA (Incluido)</span>
                <span className="font-mono">
                  ${order.totals?.tax?.toLocaleString("es-MX") || "0"}
                </span>
              </div>

              <div className="flex justify-between text-xs text-brand-dark/60 font-bold uppercase tracking-widest">
                <span>Envío</span>
                <span className="font-mono">
                  {order.totals?.shipping > 0
                    ? `$${order.totals.shipping.toLocaleString("es-MX")}`
                    : "Cortesía"}
                </span>
              </div>
              <div className="border-t border-brand-dark/10 pt-4 mt-2 flex justify-between items-center">
                <span className="text-lg font-serif font-bold text-brand-dark uppercase tracking-tighter">
                  Total Pagado
                </span>
                <span className="text-2xl font-serif font-bold text-brand-clay">
                  ${order.totals?.total?.toLocaleString("es-MX")}
                </span>
              </div>
            </div>
          </div>

          {order.customerNote && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-sm flex gap-4 shadow-inner">
              <AlertTriangle className="text-amber-500 shrink-0" size={24} />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 mb-1 underline underline-offset-4">
                  Nota del Cliente:
                </h4>
                <p className="text-sm text-amber-900/80 italic font-medium leading-relaxed">
                  "{order.customerNote}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <div className="bg-white border border-brand-dark/10 rounded-sm p-6 shadow-md border-t-4 border-t-brand-dark">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 mb-5 flex items-center gap-2">
              <Truck size={14} /> Logística de Envío
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-brand-dark/40 font-bold mb-1.5 block">
                  Paquetería
                </label>
                <div className="relative">
                  <select
                    value={localCarrier}
                    onChange={(e) => {
                      setLocalCarrier(e.target.value);
                      setIsCustomCarrier(e.target.value === "Otro");
                    }}
                    className="w-full p-2.5 bg-brand-dark/5 border border-brand-dark/10 rounded-sm text-xs font-bold uppercase tracking-widest outline-none appearance-none focus:border-brand-clay"
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
                    className="absolute right-3 top-3 pointer-events-none text-brand-dark/30"
                  />
                </div>
              </div>
              {isCustomCarrier && (
                <input
                  id="customCarrier"
                  type="text"
                  placeholder="Nombre de paquetería"
                  className="w-full p-2.5 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay animate-in slide-in-from-top-1"
                />
              )}
              <div>
                <label className="text-[9px] uppercase tracking-widest text-brand-dark/40 font-bold mb-1.5 block">
                  Guía de Rastreo
                </label>
                <input
                  type="text"
                  placeholder="Tracking #"
                  value={localTracking}
                  onChange={(e) => setLocalTracking(e.target.value)}
                  className="w-full p-2.5 border border-brand-dark/10 rounded-sm text-sm font-mono focus:border-brand-clay outline-none"
                />
              </div>
              <button
                onClick={handleUpdateTracking}
                disabled={updating || !hasChanges}
                className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all border flex items-center justify-center gap-2 ${!hasChanges ? "bg-brand-clay text-emerald-200 border-emerald-200" : "bg-brand-dark text-white hover:bg-brand-dark shadow-lg"}`}
              >
                {updating ? (
                  "Actualizando..."
                ) : !hasChanges ? (
                  <>
                    <CheckCircle size={14} /> Datos Guardados
                  </>
                ) : (
                  "Actualizar y Notificar"
                )}
              </button>
            </div>
          </div>

          <div className="bg-white border border-brand-dark/10 rounded-sm p-6 shadow-sm space-y-5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2">
              <User size={14} /> Cliente
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-brand-dark uppercase tracking-tight">
                  {order.customer?.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-brand-dark/60 mt-2 font-medium">
                  <Mail size={12} /> {order.customer?.email}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-clay mt-2 font-bold">
                  <Smartphone size={12} /> {order.customer?.phone}
                </div>
              </div>
              <div className="pt-4 border-t border-brand-dark/5">
                <h4 className="text-[9px] uppercase tracking-widest text-brand-dark/40 font-bold mb-2 flex items-center gap-2">
                  <MapPin size={12} /> Dirección de Entrega
                </h4>
                <div className="text-[11px] text-brand-dark/80 space-y-1 font-medium leading-relaxed">
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
