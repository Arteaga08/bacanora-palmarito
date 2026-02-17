import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import { Save, AlertTriangle, Package, RefreshCw } from "lucide-react";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Guardará el ID del producto que se está guardando

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

  // Función para manejar el cambio de stock localmente
  const handleStockChange = (id, newValue) => {
    const updatedProducts = products.map((p) =>
      p._id === id ? { ...p, countInStock: parseInt(newValue) || 0 } : p,
    );
    setProducts(updatedProducts);
  };

  // Función para guardar el stock en el servidor y registrar en Auditoría
  const saveStock = async (product) => {
    try {
      setUpdating(product._id);
      // Aquí llamaremos a un endpoint específico de stock o al general de update
      await clientAxios.put(`/products/${product._id}/stock`, {
        countInStock: product.countInStock,
      });
      alert(`Inventario de ${product.name} actualizado.`);
    } catch (error) {
      alert("Error al actualizar el stock");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center uppercase tracking-widest text-[10px] animate-pulse">
        Sincronizando Bodega...
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-brand-dark/10 pb-6">
        <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
          Control de Inventario
        </h1>
      </div>

      <div className="bg-white border border-brand-dark/10 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-brand-dark/5 text-[9px] uppercase tracking-widest text-brand-dark/60 font-bold">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 text-center">Estado de Stock</th>
              <th className="px-6 py-4 text-center w-48">Cantidad Actual</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/5">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-brand-cream/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-tight">
                    {product.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {product.countInStock <= 5 ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full uppercase">
                      Crítico
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full uppercase">
                      Saludable
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={product.countInStock}
                    onChange={(e) =>
                      handleStockChange(product._id, e.target.value)
                    }
                    className="w-full text-center p-2 border border-brand-dark/10 rounded-sm font-mono text-sm focus:border-brand-orange outline-none"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => saveStock(product)}
                    disabled={updating === product._id}
                    className={`p-2 rounded-sm transition-all ${
                      updating === product._id
                        ? "text-brand-dark/20"
                        : "text-brand-dark hover:text-brand-orange"
                    }`}
                  >
                    <Save
                      size={18}
                      className={updating === product._id ? "animate-spin" : ""}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
