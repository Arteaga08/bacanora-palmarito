import Hero from "../components/home/Hero";

const HomePage = () => {
  return (
    <div>
      <Hero />

      {/* SECCIÓN TEMPORAL PARA PROBAR SCROLL */}
      <section className="h-screen bg-brand-cream flex items-center justify-center border-t border-brand-dark/10">
        <p className="text-brand-dark/30 uppercase tracking-widest text-xs">
          Aquí irá la sección de Historia...
        </p>
      </section>
    </div>
  );
};

export default HomePage;
