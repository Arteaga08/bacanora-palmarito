import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import { Loader2 } from "lucide-react";

// URL del logotipo
const logoUrl =
  "https://res.cloudinary.com/djtetdac1/image/upload/v1771606556/BACANORA_qxqqpz.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) navigate("/admin/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await clientAxios.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* HEADER CON TÍTULO Y LOGO */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-brand-serif text-brand-black tracking-tighter mb-2 uppercase">
            PALMARITO
          </h1>

          {/* 👇 LOGO INSERTADO AQUÍ 👇 */}
          <img
            src={logoUrl}
            alt="Palmarito Isotipo"
            className="w-12 mx-auto mb-3 opacity-80 mix-blend-multiply"
          />

          <p className="text-[10px] font-brand-sans uppercase tracking-[0.4em] text-brand-black/40 font-medium">
            Acceso Administrativo
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-brand-black/10 p-10 bg-white/30 backdrop-blur-sm shadow-sm relative overflow-hidden"
        >
          {/* Decoración de fondo sutil en el formulario */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-[0.03] pointer-events-none">
            <img src={logoUrl} alt="" className="w-40 h-40 -rotate-12" />
          </div>

          {error && (
            <div className="text-[10px] font-brand-sans uppercase tracking-widest text-rose-600 text-center font-bold bg-rose-50/50 py-2 relative z-10">
              {error}
            </div>
          )}

          <div className="relative z-10">
            <label className="block text-[9px] font-brand-sans uppercase tracking-[0.2em] text-brand-black/60 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full bg-transparent border-b border-brand-black/20 py-3 focus:outline-none focus:border-brand-clay transition-colors text-sm font-brand-sans placeholder:text-brand-black/20"
              placeholder="usuario@palmarito.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative z-10">
            <label className="block text-[9px] font-brand-sans uppercase tracking-[0.2em] text-brand-black/60 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full bg-transparent border-b border-brand-black/20 py-3 focus:outline-none focus:border-brand-clay transition-colors text-sm font-brand-sans"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-brand-black text-brand-beige text-[10px] font-brand-sans uppercase tracking-[0.3em] font-bold hover:bg-brand-clay transition-all duration-300 flex items-center justify-center relative z-10 active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="animate-spin text-brand-clay" size={16} />
            ) : (
              "Entrar al Sistema"
            )}
          </button>
        </form>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="text-[9px] font-brand-sans uppercase tracking-[0.2em] text-brand-black/30 hover:text-brand-black transition-colors flex items-center justify-center gap-2 mx-auto hover:gap-3"
          >
            <span>←</span> Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
