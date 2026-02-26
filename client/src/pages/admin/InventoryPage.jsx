import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import { Save, AlertTriangle, Package, Loader2 } from "lucide-react";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await clientAxios.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, newValue) => {
    const updatedProducts = products.map((p) =>
      p._id === id ? { ...p, countInStock: parseInt(newValue) || 0 } : p,
    );
    setProducts(updatedProducts);
  };

  const saveStock = async (product) => {
    try {
      setUpdating(product._id);
      await clientAxios.put(`/products/${product._id}/stock`, {
        countInStock: product.countInStock,
      });
      // Notificación sutil en consola o podrías usar un toast
    } catch (error) {
      alert("Error al actualizar el stock");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-clay" size={32} />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="border-b border-brand-black/10 pb-6">
        <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
          Control de Inventario
        </h1>
        <p className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-black/40 mt-1 font-bold">
          Gestión de existencias en bodega
        </p>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="bg-white border border-brand-black/10 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-black/5 text-[9px] font-brand-sans uppercase tracking-widest text-brand-black/60 font-bold border-b border-brand-black/10">
              <tr>
                <th className="px-6 py-4">Botella</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center w-48">Existencias</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5 font-brand-sans">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-brand-beige/20 transition-colors group"
                >
                  {/* PRODUCTO CON IMAGEN */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-12 bg-brand-black/5 rounded-sm flex items-center justify-center border border-brand-black/5 overflow-hidden shrink-0">
                        {product.images?.cardPrimary ? (
                          <img
                            src={product.images.cardPrimary}
                            alt={product.name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        ) : (
                          <Package size={16} className="text-brand-black/20" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-brand-black uppercase tracking-tight">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* ESTADO VISUAL */}
                  <td className="px-6 py-4 text-center">
                    {product.countInStock <= 5 ? (
                      <span className="text-[8px] font-bold px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-sm uppercase tracking-widest">
                        Crítico
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-sm uppercase tracking-widest">
                        Saludable
                      </span>
                    )}
                  </td>

                  {/* INPUT DE CANTIDAD */}
                  <td className="px-6 py-4">
                    <div className="relative max-w-32 mx-auto">
                      <input
                        type="number"
                        value={product.countInStock}
                        onChange={(e) =>
                          handleStockChange(product._id, e.target.value)
                        }
                        className="w-full text-center p-2 border border-brand-black/10 rounded-sm font-mono text-sm focus:border-brand-clay outline-none bg-brand-beige/5 transition-colors"
                      />
                    </div>
                  </td>

                  {/* BOTÓN DE GUARDAR */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => saveStock(product)}
                      disabled={updating === product._id}
                      className={`p-3 rounded-full transition-all ${
                        updating === product._id
                          ? "text-brand-black/20"
                          : "text-brand-black hover:text-brand-clay hover:bg-brand-clay/5"
                      }`}
                      title="Guardar Stock"
                    >
                      {updating === product._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
