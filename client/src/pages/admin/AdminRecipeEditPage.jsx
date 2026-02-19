import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  MoreVertical,
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

const AdminRecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [preparation, setPreparation] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // 📥 CARGAR DATOS
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await clientAxios.get(`/mixology/${id}`);
        setName(data.name || "");
        setSlug(data.slug || "");
        setPreparation(data.preparation || "");
        setPreview(data.image || "");

        // 🧠 DESENVOLVER: Extraemos solo el texto para el input del admin
        if (data.ingredients && Array.isArray(data.ingredients)) {
          const simpleStrings = data.ingredients.map((ing) =>
            typeof ing === "object" ? ing.item || "" : ing,
          );
          setIngredients(simpleStrings.length > 0 ? simpleStrings : [""]);
        }
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, value) => {
    const newIngs = [...ingredients];
    newIngs[index] = value;
    setIngredients(newIngs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("preparation", preparation);

    // 🧠 ENVOLVER: Convertimos los textos en objetos para que Mongoose no llore
    const formattedIngredients = ingredients
      .filter((i) => i && i.trim() !== "")
      .map((i) => ({ item: i }));

    formData.append("ingredients", JSON.stringify(formattedIngredients));

    if (image) formData.append("image", image);

    try {
      await clientAxios.put(`/mixology/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Receta actualizada. 🍸");
      navigate("/admin/mixology");
    } catch (error) {
      console.error("Error 400:", error.response?.data);
      alert("Error al actualizar. Revisa los datos enviados.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-brand-dark/20 uppercase tracking-widest text-[10px]">
        Sincronizando bar...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 border-b border-brand-dark/10 pb-6">
        <Link
          to="/admin/mixology"
          className="p-2 rounded-full hover:bg-brand-dark/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Editar Receta
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-clay mt-1 font-bold">
            Botella: {name}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 border-b pb-4">
              Detalles Base
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(slugify(e.target.value));
                  }}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  URL (Slug)
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
                Instrucciones
              </label>
              <textarea
                required
                rows="5"
                value={preparation}
                onChange={(e) => setPreparation(e.target.value)}
                className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
              ></textarea>
            </div>
          </div>

          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2">
                <ListOrdered size={14} /> Insumos
              </h3>
              <button
                type="button"
                onClick={addIngredient}
                className="text-[9px] uppercase font-bold text-brand-clay hover:text-brand-dark transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Añadir campo
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
                    value={typeof ing === "string" ? ing : ""}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="Ej. 2oz de Bacanora"
                    className="flex-1 p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-brand-dark/20 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 border-b pb-4">
              Imagen
            </h3>
            <div className="relative group border-2 border-dashed border-brand-dark/10 rounded-sm p-4 h-64 overflow-hidden flex flex-col items-center justify-center">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-dark text-brand-cream py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-clay transition-all shadow-xl disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminRecipeEditPage;
