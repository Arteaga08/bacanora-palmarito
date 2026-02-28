import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  AlertCircle,
  Search,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import VidixImage from "../../components/VidixImage";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await clientAxios.get("/products");
        setProducts(data.filter((p) => p.isActive !== false));
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleArchive = async (id, name) => {
    const firstCheck = window.confirm(
      `¿Deseas retirar "${name}" del catálogo activo?`,
    );
    if (firstCheck) {
      const secondCheck = window.confirm(
        `⚠️ CONFIRMACIÓN FINAL: El producto se ocultará de la tienda pero se mantendrá en registros históricos. ¿Proceder?`,
      );
      if (secondCheck) {
        try {
          setLoading(true);
          await clientAxios.put(`/products/${id}/archive`);
          setProducts(products.filter((p) => p._id !== id));
        } catch (error) {
          alert("No se pudo archivar el producto.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-brand-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
            Catálogo de Productos
          </h1>
          <p className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-black/40 mt-1 font-bold">
            {products.length} Items activos en bodega
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Buscar bacanora..."
              className="pl-9 pr-4 py-2 text-sm font-brand-sans border border-brand-black/10 rounded-sm outline-none focus:border-brand-clay w-full sm:w-64 bg-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/admin/products/new"
            className="bg-brand-clay hover:bg-brand-black text-brand-beige px-4 py-2 rounded-sm text-[10px] font-brand-sans font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} /> Nuevo Producto
          </Link>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-brand-black/10 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-212.5">
            <thead className="bg-brand-black/5 text-[9px] font-brand-sans uppercase tracking-widest text-brand-black/60 font-bold border-b border-brand-black/10">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5 font-brand-sans">
              {loading && products.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center animate-pulse text-[10px] uppercase tracking-widest text-brand-black/20"
                  >
                    Sincronizando inventario...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] uppercase tracking-widest text-brand-black/40 italic"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-brand-beige/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-black/5 rounded-sm flex items-center justify-center border border-brand-black/5 overflow-hidden shrink-0">
                          {product.images?.cardPrimary ? (
                            <VidixImage
                              src={product.images.cardPrimary}
                              alt={product.name}
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          ) : (
                            <Package
                              size={18}
                              className="text-brand-black/20"
                            />
                          )}
                        </div>
                        <span className="text-xs font-bold text-brand-black uppercase tracking-tight truncate max-w-62.5">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-brand-black/5 text-brand-black/60 rounded-sm border border-brand-black/5">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-brand-black">
                      ${product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${product.countInStock <= 5 ? "text-rose-600" : "text-brand-black"}`}
                        >
                          {product.countInStock}
                        </span>
                        {product.countInStock <= 5 && (
                          <AlertCircle
                            size={14}
                            className="text-rose-500 animate-pulse"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 text-brand-black/30 hover:text-brand-clay hover:bg-brand-clay/5 rounded-full transition-all"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() =>
                            handleArchive(product._id, product.name)
                          }
                          className="p-2 text-brand-black/30 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden text-center">
        <p className="text-[9px] font-brand-sans text-brand-black/30 uppercase tracking-widest flex items-center justify-center gap-2">
          Desliza para ver acciones <MoreVertical size={10} />
        </p>
      </div>
    </div>
  );
};

export default ProductsPage;
