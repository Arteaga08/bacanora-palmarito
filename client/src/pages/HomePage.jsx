import Hero from "../components/home/Hero";
import HomeHistory from "../components/home/HomeHistory";
import HomeProducts from "../components/home/HomeProducts";
import HomeCocktails from "../components/home/HomeCocktails";
import HomeTransition from "../components/home/HomeTransition";
import HomeInstagram from "../components/home/HomeInstagram";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Impacto Inicial */}
      <Hero />

      {/* 2. Sección que sigue (Scroll) */}
      <HomeHistory />

      {/* 3. El Catálogo (Scroll) */}
      <HomeProducts />

      {/* 4. Imagen Separadora de Gran Calidad */}
      <HomeTransition />

      {/* 5. Sección Final de la Home (Scroll) */}
      <HomeCocktails />

      {/* 5.- Instagram */}
      <HomeInstagram />
    </div>
  );
};

export default HomePage;
