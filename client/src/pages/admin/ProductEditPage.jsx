import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import {
  ArrowLeft,
  Upload,
  Save,
  Wine,
  Info,
  DollarSign,
  Box,
  Loader2,
} from "lucide-react";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/[^\w-]+/g, "") // Elimina todo lo que no sea letra, número o guion
    .replace(/--+/g, "-"); // Evita guiones dobles
};

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    countInStock: "",
    slug: "",
    ingredients: "",
  });

  const [images, setImages] = useState({
    imagePrimary: null,
    imageHover: null,
    imageDetail: null,
  });

  const [previews, setPreviews] = useState({
    primary: "",
    hover: "",
    detail: "",
  });

  // 📥 CARGAR DATOS DEL PRODUCTO
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await clientAxios.get(`/products/${id}`);
        setProduct({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          countInStock: data.countInStock,
          slug: data.slug,
          ingredients: JSON.stringify(data.ingredients),
        });
        setPreviews({
          primary: data.images?.cardPrimary,
          hover: data.images?.cardHover,
          detail: data.images?.displayDetail,
        });
      } catch (error) {
        console.error("Error cargando producto:", error);
        alert("No se pudo cargar la información de la botella.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setProduct({
        ...product,
        name: value,
        slug: slugify(value),
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImages({ ...images, [e.target.name]: file });

    // Generar preview local
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const key =
          e.target.name === "imagePrimary"
            ? "primary"
            : e.target.name === "imageHover"
              ? "hover"
              : "detail";
        setPreviews((prev) => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.keys(product).forEach((key) => formData.append(key, product[key]));

    if (images.imagePrimary)
      formData.append("imagePrimary", images.imagePrimary);
    if (images.imageHover) formData.append("imageHover", images.imageHover);
    if (images.imageDetail) formData.append("imageDetail", images.imageDetail);

    try {
      await clientAxios.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Botella actualizada correctamente.");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={32} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 border-b border-brand-dark/10 pb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-full hover:bg-brand-dark/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Editar Botella
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange mt-1 font-bold">
            Modificando: {product.name}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <Info size={14} /> Ficha Técnica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Slug (URL)
                </label>
                <input
                  required
                  type="text"
                  name="slug"
                  value={product.slug}
                  onChange={handleChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-orange"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                Descripción
              </label>
              <textarea
                required
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-orange"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                Ingredientes (JSON)
              </label>
              <input
                type="text"
                name="ingredients"
                value={product.ingredients}
                onChange={handleChange}
                className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm font-mono focus:border-brand-orange outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4 mb-6">
              <DollarSign size={14} /> Precios y Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Precio (MXN)
                </label>
                <input
                  required
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Inventario
                </label>
                <input
                  required
                  type="number"
                  name="countInStock"
                  value={product.countInStock}
                  onChange={handleChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-orange"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Categoría
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none bg-white font-bold uppercase tracking-tight"
                >
                  <option value="Bacanora">Bacanora</option>
                  <option value="Mixología">Mixología</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <Upload size={14} /> Multimedia
            </h3>

            {["imagePrimary", "imageHover", "imageDetail"].map((imgKey) => {
              const previewKey =
                imgKey === "imagePrimary"
                  ? "primary"
                  : imgKey === "imageHover"
                    ? "hover"
                    : "detail";
              return (
                <div key={imgKey} className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-brand-dark/40">
                    {imgKey}
                  </label>
                  <div className="relative group border-2 border-dashed border-brand-dark/10 rounded-sm p-4 overflow-hidden">
                    {previews[previewKey] && (
                      <img
                        src={previews[previewKey]}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity"
                      />
                    )}
                    <input
                      type="file"
                      name={imgKey}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center space-y-1 relative z-0">
                      <Wine className="mx-auto text-brand-dark/20" size={20} />
                      <p className="text-[9px] text-brand-dark/60 font-bold uppercase">
                        Cambiar Imagen
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-dark text-brand-cream py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-orange transition-all shadow-xl disabled:opacity-50"
            >
              {saving ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={16} /> Actualizar Botella
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;
