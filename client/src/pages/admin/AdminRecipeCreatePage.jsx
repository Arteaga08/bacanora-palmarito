import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GlassWater,
  ListOrdered,
  Upload,
  Loader2,
} from "lucide-react";

// 🧠 Función para automatizar el slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const AdminRecipeCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [preparation, setPreparation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Estado para ingredientes (Lista dinámica de strings)
  const [ingredients, setIngredients] = useState([""]);

  // Al cambiar el nombre, se genera el slug
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value));
  };

  // --- Gestión de Ingredientes Dinámicos ---
  const addIngredient = () => setIngredients([...ingredients, ""]);

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Previsualización de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("preparation", preparation);
    if (image) formData.append("image", image);

    // 🚀 LA CORRECCIÓN: Envolvemos el string en el objeto que espera Mongoose
    const formattedIngredients = ingredients
      .filter((i) => i && i.trim() !== "")
      .map((i) => ({ item: i })); // 👈 Aquí la clave es 'item'

    formData.append("ingredients", JSON.stringify(formattedIngredients));

    try {
      await clientAxios.post("/mixology", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("¡Cóctel creado con éxito! 🍸");
      navigate("/admin/mixology");
    } catch (error) {
      console.error("Error al crear:", error.response?.data);
      alert("Error al guardar. Verifica que todos los campos sean válidos.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-brand-dark/10 pb-6">
        <Link
          to="/admin/mixology"
          className="p-2 rounded-full hover:bg-brand-dark/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Nuevo Cóctel
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-clay mt-1 font-bold">
            Registro de Mixología
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <GlassWater size={14} /> Identidad del Trago
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                  placeholder="Ej. Bacanora Sunrise"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  URL Amigable (Slug)
                </label>
                <input
                  required
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm font-mono focus:border-brand-clay outline-none bg-brand-dark/5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                Método de Preparación
              </label>
              <textarea
                required
                rows="6"
                value={preparation}
                onChange={(e) => setPreparation(e.target.value)}
                className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay leading-relaxed"
                placeholder="Paso 1: Agregar hielo... Paso 2: Servir Bacanora..."
              ></textarea>
            </div>
          </div>

          {/* INGREDIENTES DINÁMICOS */}
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2">
                <ListOrdered size={14} /> Lista de Insumos
              </h3>
              <button
                type="button"
                onClick={addIngredient}
                className="text-[9px] uppercase font-bold tracking-widest flex items-center gap-1 text-brand-clay hover:text-brand-dark transition-colors"
              >
                <Plus size={14} /> Agregar Insumo
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="flex gap-2 group animate-in slide-in-from-left-2"
                >
                  <input
                    required
                    type="text"
                    value={ing}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingrediente ${index + 1} (ej. 1.5 oz Bacanora)`}
                    className="flex-1 p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-3 text-brand-dark/20 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR: MULTIMEDIA Y BOTÓN */}
        <div className="space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <Upload size={14} /> Fotografía
            </h3>

            <div className="relative group border-2 border-dashed border-brand-dark/10 rounded-sm p-4 h-64 overflow-hidden flex flex-col items-center justify-center bg-brand-cream/5">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2">
                  <GlassWater
                    className="mx-auto text-brand-dark/10"
                    size={40}
                  />
                  <p className="text-[9px] text-brand-dark/40 font-bold uppercase tracking-widest">
                    Click para subir foto
                  </p>
                </div>
              )}
              <input
                required={!preview}
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-brand-cream py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-clay transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} /> Publicar Receta
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminRecipeCreatePage;
