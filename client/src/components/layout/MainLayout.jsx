import { Outlet } from "react-router-dom";
// import Navbar from './Navbar';
// import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav>/* Aquí irá el Navbar de Fulgencio */</nav>

      <main className="grow">
        <Outlet /> {/* Aquí es donde "caen" tus páginas */}
      </main>

      <footer>/* Aquí irá el Footer de Casa Malka */</footer>
    </div>
  );
};

export default MainLayout;
