import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clientAxios from "../../services/axiosConfig";
import {
  ArrowLeft,
  Upload,
  Save,
  Wine,
  Info,
  DollarSign,
  Box,
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

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado para el formulario (AQUÍ AGREGAMOS VOLUME)
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "Bacanora",
    countInStock: "",
    slug: "",
    ingredients: "",
    volume: "750 ML", // 👈 Nuevo campo con valor por defecto
  });

  // Estado para las imágenes (archivos)
  const [images, setImages] = useState({
    imagePrimary: null,
    imageHover: null,
    imageDetail: null,
  });

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
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Agregamos los textos (incluyendo volume)
    Object.keys(product).forEach((key) => formData.append(key, product[key]));

    // Agregamos los archivos
    if (images.imagePrimary)
      formData.append("imagePrimary", images.imagePrimary);
    if (images.imageHover) formData.append("imageHover", images.imageHover);
    if (images.imageDetail) formData.append("imageDetail", images.imageDetail);

    try {
      await clientAxios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("¡Producto creado con éxito, compañero!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Error al crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-brand-dark/10 pb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-full hover:bg-brand-dark/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Nueva Botella
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/40 mt-1 font-bold">
            Alta de Catálogo
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* COLUMNA IZQUIERDA: DATOS GENERALES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <Info size={14} /> Información Principal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Nombre del Producto
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Ej. Bacanora Blanco Reserva"
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  (Slug)
                </label>
                <input
                  required
                  type="text"
                  name="slug"
                  value={product.slug}
                  onChange={handleChange}
                  placeholder="ej-bacanora-blanco"
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
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
                className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                placeholder="Describe las notas de cata y el proceso artesanal..."
              ></textarea>
            </div>
          </div>

          {/* PRECIOS, STOCK Y VOLUMEN */}
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4 mb-6">
              <DollarSign size={14} /> Valores y Existencias
            </h3>

            {/* Cambiamos de grid-cols-3 a grid-cols-2 en móvil y grid-cols-4 en PC para acomodar el nuevo campo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  placeholder="0.00"
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Stock Inicial
                </label>
                <input
                  required
                  type="number"
                  name="countInStock"
                  value={product.countInStock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay"
                />
              </div>

              {/* 👇 NUEVO CAMPO DE VOLUMEN AQUÍ */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40">
                  Volumen
                </label>
                <input
                  required
                  type="text"
                  name="volume"
                  value={product.volume}
                  onChange={handleChange}
                  placeholder="Ej. 750 ML"
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none focus:border-brand-clay uppercase"
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
                  className="w-full p-3 border border-brand-dark/10 rounded-sm text-sm outline-none bg-white"
                >
                  <option value="Bacanora">Bacanora</option>
                  <option value="Mixología">Mixología</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: IMÁGENES */}
        <div className="space-y-6">
          <div className="bg-white border border-brand-dark/10 p-8 rounded-sm shadow-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/60 flex items-center gap-2 border-b pb-4">
              <Upload size={14} /> Galería Visual
            </h3>

            {["imagePrimary", "imageHover", "imageDetail"].map((imgKey) => (
              <div key={imgKey} className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-dark/40">
                  {imgKey === "imagePrimary"
                    ? "Imagen Principal tarjeta"
                    : imgKey === "imageHover"
                      ? "Imagen Secundaria Tarjeta"
                      : "Imagen Producto (Fondo)"}
                </label>
                <div className="relative group border-2 border-dashed border-brand-dark/10 rounded-sm p-4 hover:border-brand-clay transition-colors">
                  <input
                    type="file"
                    name={imgKey}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center space-y-2">
                    <Wine
                      className={`mx-auto ${images[imgKey] ? "text-brand-clay" : "text-brand-dark/20"}`}
                      size={24}
                    />
                    <p className="text-[10px] text-brand-dark/60 font-medium">
                      {images[imgKey]
                        ? images[imgKey].name
                        : "Seleccionar archivo"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-brand-cream py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-clay transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? (
                "Creando..."
              ) : (
                <>
                  <Save size={16} /> Guardar Producto
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;
