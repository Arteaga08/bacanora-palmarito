import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Si ya está logueado, mandarlo al dashboard
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) navigate("/admin/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Usamos /auth/login (según tu server.js)
      const { data } = await clientAxios.post("/auth/login", {
        email,
        password,
      });

      // 2. Guardamos la respuesta completa (que trae _id, username, email, role, token)
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/admin/dashboard");
    } catch (err) {
      // Si el error es 500, es problema del servidor. Si es 401, son las credenciales.
      console.error("Error completo:", err.response);
      setError(
        err.response?.data?.message || "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* LOGO Y TÍTULO */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-brand-dark tracking-tighter mb-4">
            PALMARITO
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-dark/40 font-medium">
            Acceso Administrativo
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-brand-dark/10 p-10 bg-white/30 backdrop-blur-sm"
        >
          {error && (
            <div className="text-[10px] uppercase tracking-widest text-rose-600 text-center font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-brand-dark/60 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full bg-transparent border-b border-brand-dark/20 py-3 focus:outline-none focus:border-brand-clay transition-colors text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-brand-dark/60 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full bg-transparent border-b border-brand-dark/20 py-3 focus:outline-none focus:border-brand-clay transition-colors text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-brand-dark text-brand-cream text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-clay transition-all duration-500 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Entrar al Sistema"
            )}
          </button>
        </form>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="text-[9px] uppercase tracking-[0.2em] text-brand-dark/30 hover:text-brand-dark transition-colors"
          >
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
