import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../admin/AdminSideBar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para abrir/cerrar menú móvil

  // 🛡️ PROTECCIÓN DE RUTA:
  // Si no hay usuario en localStorage, manda al login.
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // 🚪 FUNCIÓN DE SALIDA:
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-brand-cream font-sans overflow-hidden">
      {/* SIDEBAR MODULAR (Separado y Renombrado) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* HEADER */}
        <header className="h-16 md:h-20 border-b border-brand-dark/10 flex items-center justify-between px-4 md:px-10 bg-brand-cream/80 backdrop-blur-md shrink-0">
          {/* Botón Hamburguesa (Solo visible en Móvil) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-brand-dark p-2 -ml-2 hover:bg-brand-dark/5 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Título Desktop */}
          <h2 className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-brand-dark/40">
            Sistema de Gestión v1.0
          </h2>

          {/* Título Móvil (Logo) */}
          <span className="md:hidden text-lg font-serif text-brand-orange tracking-tight">
            PALMARITO
          </span>

          {/* Avatar / Perfil */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-[10px] text-brand-cream font-bold shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO (Aquí se cargan Dashboard, Products, etc.) */}
        <section className="flex-1 overflow-y-auto p-4 md:p-10 w-full scroll-smooth">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
