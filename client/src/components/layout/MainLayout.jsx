import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-beige">
      {/* 1. Menú persistente */}
      <Navbar />

      {/* 2. Área donde se renderiza la HomePage, Tienda, etc. */}
      <main className="grow">
        <Outlet />
      </main>
      
      {/* 3. Pie de página persistente */}
      <Footer />
    </div>
  );
};

export default MainLayout;
