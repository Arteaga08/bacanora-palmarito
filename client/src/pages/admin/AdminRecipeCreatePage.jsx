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

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [preparation, setPreparation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [ingredients, setIngredients] = useState([""]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(slugify(value));
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

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

    const formattedIngredients = ingredients
      .filter((i) => i && i.trim() !== "")
      .map((i) => ({ item: i }));

    formData.append("ingredients", JSON.stringify(formattedIngredients));

    try {
      await clientAxios.post("/mixology", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/mixology");
    } catch (error) {
      console.error("Error al crear:", error.response?.data);
      alert("Error al guardar la receta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-brand-black/10 pb-6">
        <Link
          to="/admin/mixology"
          className="p-2 rounded-full hover:bg-brand-black/5 transition-colors text-brand-black"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
            Nuevo Cóctel
          </h1>
          <p className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-clay mt-1 font-bold">
            Registro de Mixología
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6 font-brand-sans">
          <div className="bg-white border border-brand-black/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 flex items-center gap-2 border-b border-brand-black/5 pb-4">
              <GlassWater size={14} className="text-brand-clay" /> Identidad del
              Trago
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full p-3 border border-brand-black/10 rounded-sm text-sm outline-none focus:border-brand-clay bg-brand-beige/5"
                  placeholder="Ej. Bacanora Sunrise"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
                  Slug (URL)
                </label>
                <input
                  required
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-3 border border-brand-black/10 rounded-sm text-sm font-mono focus:border-brand-clay outline-none bg-brand-black/2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
                Método de Preparación
              </label>
              <textarea
                required
                rows="6"
                value={preparation}
                onChange={(e) => setPreparation(e.target.value)}
                className="w-full p-3 border border-brand-black/10 rounded-sm text-sm outline-none focus:border-brand-clay leading-relaxed bg-brand-beige/5"
                placeholder="Paso 1: Agregar hielo... Paso 2: Servir Bacanora..."
              ></textarea>
            </div>
          </div>

          {/* INGREDIENTES */}
          <div className="bg-white border border-brand-black/10 p-8 rounded-sm shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-brand-black/5 pb-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 flex items-center gap-2">
                <ListOrdered size={14} className="text-brand-clay" /> Lista de
                Insumos
              </h3>
              <button
                type="button"
                onClick={addIngredient}
                className="text-[9px] uppercase font-bold tracking-widest flex items-center gap-1 text-brand-clay hover:text-brand-black transition-colors"
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
                    className="flex-1 p-3 border border-brand-black/10 rounded-sm text-sm outline-none focus:border-brand-clay bg-brand-beige/5"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-3 text-brand-black/20 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA LATERAL */}
        <div className="space-y-6 font-brand-sans">
          <div className="bg-white border border-brand-black/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-black/60 flex items-center gap-2 border-b border-brand-black/5 pb-4">
              <Upload size={14} className="text-brand-clay" /> Fotografía
            </h3>

            <div className="relative group border-2 border-dashed border-brand-black/10 rounded-sm p-4 h-64 overflow-hidden flex flex-col items-center justify-center bg-brand-beige/5 hover:border-brand-clay transition-colors">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-2">
                  <GlassWater
                    className="mx-auto text-brand-black/10"
                    size={40}
                  />
                  <p className="text-[9px] text-brand-black/40 font-bold uppercase tracking-widest">
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
              className="w-full bg-brand-black text-brand-beige py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-clay transition-all shadow-lg active:scale-95 disabled:opacity-50"
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
