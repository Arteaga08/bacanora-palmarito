import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import {
  ShieldCheck,
  Globe,
  Database,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

// 📖 DICCIONARIO DE TRADUCCIÓN
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

  // Función para traducir términos técnicos
  const t = (categoria, llave) => TRADUCCIONES[categoria][llave] || llave;

  const renderDetails = (details) => {
    if (!details)
      return <span className="text-brand-dark/20 italic">Sin datos</span>;

    // Si es el formato de cambio (from/to)
    if (details.from && details.to) {
      return (
        <div className="flex flex-col gap-1 text-[10px] font-mono">
          <div className="text-rose-600 flex gap-1">
            <span className="font-bold uppercase opacity-50">Anterior:</span>
            {Object.entries(details.from)
              .map(([key, val]) => `${t("claves", key)}: ${val}`)
              .join(" | ")}
          </div>
          <div className="text-emerald-600 flex gap-1">
            <span className="font-bold uppercase opacity-50">Nuevo:</span>
            {Object.entries(details.to)
              .map(([key, val]) => `${t("claves", key)}: ${val}`)
              .join(" | ")}
          </div>
        </div>
      );
    }
    return (
      <div className="text-[10px] font-mono opacity-60">
        {JSON.stringify(details)}
      </div>
    );
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse uppercase tracking-[0.3em] text-[10px]">
        Cargando seguridad...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-end justify-between border-b border-brand-dark/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Historial de Auditoría
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/40 mt-2 flex items-center gap-2 font-bold">
            <ShieldCheck size={12} className="text-emerald-600" /> Registros
            técnicos traducidos del sistema
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark/40 hover:text-brand-orange transition-colors"
        >
          <RefreshCw size={14} /> Sincronizar
        </button>
      </div>

      <div className="bg-white border border-brand-dark/10 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-dark/5 text-[9px] uppercase tracking-[0.2em] text-brand-dark/60 font-bold border-b border-brand-dark/10">
              <th className="px-6 py-4">Fecha / Hora</th>
              <th className="px-6 py-4">Administrador</th>
              <th className="px-6 py-4">Módulo / Acción</th>
              <th className="px-6 py-4">Detalles del Cambio</th>
              <th className="px-6 py-4 text-right">Origen (IP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/5">
            {logs.map((log) => (
              <tr
                key={log._id}
                className="hover:bg-brand-cream/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col text-[11px]">
                    <span className="font-bold text-brand-dark">
                      {new Date(log.createdAt).toLocaleDateString("es-MX")}
                    </span>
                    <span className="text-brand-dark/40 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString("es-MX")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-medium text-brand-dark/70 lowercase">
                    {log.adminId?.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold">
                      {t("modulos", log.module)}
                    </span>
                    <span className="text-[10px] font-bold text-brand-dark uppercase">
                      {t("acciones", log.action)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{renderDetails(log.details)}</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[10px] text-brand-dark/40 font-mono bg-brand-dark/5 px-2 py-1 rounded-sm">
                    {log.ip}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;
