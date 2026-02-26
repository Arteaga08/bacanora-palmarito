import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import { ShieldCheck, RefreshCw, Loader2 } from "lucide-react";

const TRADUCCIONES = {
  modulos: {
    Shipping: "Envíos",
    Products: "Productos",
    Inventory: "Inventario",
    Auth: "Seguridad",
  },
  acciones: {
    UPDATE_SHIPPING_GUIDE: "Guía Actualizada",
    UPDATE_STATUS: "Estado Cambiado",
    LOGIN_SUCCESS: "Inicio de Sesión",
    UPDATE_PRODUCT: "Producto Editado",
  },
  claves: {
    carrier: "Paquetería",
    trackingNumber: "Guía",
    status: "Estado",
    from: "De",
    to: "A",
  },
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await clientAxios.get("/audit");
      setLogs(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const t = (categoria, llave) => TRADUCCIONES[categoria][llave] || llave;

  const renderDetails = (details) => {
    if (!details)
      return <span className="text-brand-black/20 italic">Sin registros</span>;

    if (details.from && details.to) {
      return (
        <div className="flex flex-col gap-1.5 text-[10px] font-mono leading-tight">
          {/* ANTERIOR: Con fondo rojo sutil pero texto NEGRO sólido */}
          <div className="bg-rose-50 border-l-2 border-rose-200 px-2 py-1 text-brand-black">
            <span className="font-bold uppercase text-[8px] text-rose-800/60 mr-2">
              Anterior:
            </span>
            {Object.entries(details.from)
              .map(([key, val]) => `${t("claves", key)}: ${val}`)
              .join(" | ")}
          </div>
          {/* NUEVO: Con fondo verde sutil pero texto NEGRO sólido */}
          <div className="bg-emerald-50 border-l-2 border-emerald-200 px-2 py-1 text-brand-black">
            <span className="font-bold uppercase text-[8px] text-emerald-800/60 mr-2">
              Nuevo:
            </span>
            {Object.entries(details.to)
              .map(([key, val]) => `${t("claves", key)}: ${val}`)
              .join(" | ")}
          </div>
        </div>
      );
    }
    return (
      <div className="text-[10px] font-mono text-brand-black bg-brand-black/5 p-2 rounded-sm border-l-2 border-brand-black/20">
        {JSON.stringify(details)}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-clay" size={32} />
        <span className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-black/20 mt-4">
          Consultando Seguridad...
        </span>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 font-brand-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-black/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
            Historial de Auditoría
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-black/40 mt-2 flex items-center gap-2 font-bold">
            <ShieldCheck size={12} className="text-brand-clay" /> Registros del
            sistema
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-brand-black/40 hover:text-brand-black hover:bg-brand-black/5 transition-all rounded-sm border border-brand-black/10"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
          Sincronizar
        </button>
      </div>

      <div className="bg-white border border-brand-black/10 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-max">
            <thead>
              <tr className="bg-brand-black/5 text-[9px] uppercase tracking-[0.2em] text-brand-black/60 font-bold border-b border-brand-black/10">
                <th className="px-6 py-4">Sincronización</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Módulo / Acción</th>
                <th className="px-6 py-4">Trazabilidad del Cambio</th>
                <th className="px-6 py-4 text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5">
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="hover:bg-brand-beige/10 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-brand-black">
                        {new Date(log.createdAt).toLocaleDateString("es-MX")}
                      </span>
                      <span className="text-brand-black/30 font-mono text-[10px] italic">
                        {new Date(log.createdAt).toLocaleTimeString("es-MX")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-medium text-brand-black/70 lowercase">
                      {log.adminId?.email || "Sistema Automático"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-brand-clay font-bold">
                        {t("modulos", log.module)}
                      </span>
                      <span className="text-[10px] font-bold text-brand-black uppercase tracking-tighter">
                        {t("acciones", log.action)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{renderDetails(log.details)}</td>
                  <td className="px-6 py-4 text-right font-mono text-[9px] text-brand-black/30">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
