import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el cliente (luego la harás) */}
        <Route
          path="/"
          element={
            <h1 className="text-3xl font-bold">
              Página de Inicio (Próximamente)
            </h1>
          }
        />

        {/* Ruta para tu Dashboard */}
        <Route
          path="/admin"
          element={
            <h1 className="text-3xl font-bold text-amber-600">
              ¡Hola, Administrador!
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
