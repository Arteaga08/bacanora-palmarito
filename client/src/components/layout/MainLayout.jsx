import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    // ¡EL BLINDAJE ESTÁ AQUÍ!
    // w-full asegura que no pase del 100% de la pantalla
    // overflow-x-hidden corta cualquier sello o firma que intente salirse hacia los lados
    <div className="flex flex-col min-h-screen bg-brand-beige w-full relative overflow-x-hidden">
      {/* 1. Menú persistente */}
      <Navbar />

      {/* 2. Área donde se renderiza la HomePage, Tienda, etc. */}
      {/* Le agregamos w-full para evitar desbordes internos */}
      <main className="grow w-full flex flex-col relative">
        <Outlet />
      </main>

      {/* 3. Pie de página persistente */}
      <Footer />
    </div>
  );
};

export default MainLayout;
