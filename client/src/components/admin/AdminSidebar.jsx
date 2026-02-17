// client/src/components/admin/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wine,
  Truck,
  ClipboardList,
  LogOut,
  X,
} from "lucide-react";

// 👇 CAMBIO DE NOMBRE AQUÍ
const AdminSidebar = ({ isOpen, setIsOpen, handleLogout }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin/dashboard",
    },
    { name: "Productos", icon: <Package size={18} />, path: "/admin/products" },
    {
      name: "Inventario",
      icon: <ClipboardList size={18} />,
      path: "/admin/inventory",
    },
    { name: "Mixología", icon: <Wine size={18} />, path: "/admin/mixology" },
    { name: "Órdenes", icon: <Truck size={18} />, path: "/admin/orders" },
    {
      name: "Auditoría",
      icon: <ClipboardList size={18} />,
      path: "/admin/logs",
    },
  ];

  return (
    <>
      {/* OVERLAY MÓVIL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-dark/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-cream border-r border-brand-dark/10 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="p-8 md:p-10 border-b border-brand-dark/10 flex justify-between items-center">
          <div>
            <Link
              to="/"
              className="text-2xl font-serif text-brand-orange tracking-tighter"
            >
              PALMARITO
            </Link>
            <p className="text-[9px] uppercase tracking-[0.3em] text-brand-dark/40 mt-1">
              Panel de Control
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-brand-dark/50"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-10 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${
                  isActive
                    ? "bg-brand-dark text-brand-cream"
                    : "text-brand-dark/60 hover:text-brand-orange hover:bg-brand-dark/5"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-brand-dark/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 w-full transition-all rounded-sm"
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar; // 👈 EXPORTAMOS CON EL NUEVO NOMBRE
