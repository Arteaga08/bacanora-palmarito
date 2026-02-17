import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  GlassWater,
  UtensilsCrossed,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminMixologyPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await clientAxios.get("/mixology");
        // Filtramos solo las activas
        setRecipes(data.filter((r) => r.isActive !== false));
      } catch (error) {
        console.error("Error cargando recetas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar permanentemente la receta "${name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      try {
        setLoading(true);
        // 🗑️ Borrado físico directo
        await clientAxios.delete(`/mixology/${id}`);

        setRecipes(recipes.filter((r) => r._id !== id));
        alert("Receta eliminada del sistema.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar la receta.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-brand-dark/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark tracking-tighter">
            Recetario de Mixología
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-dark/40 mt-1 font-bold">
            {recipes.length} Cócteles publicados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-dark/40" />
            <input
              type="text"
              placeholder="Buscar cóctel..."
              className="pl-9 pr-4 py-2 text-sm border border-brand-dark/10 rounded-sm outline-none focus:border-brand-orange w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/admin/mixology/new"
            className="bg-brand-orange text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg"
          >
            <Plus size={16} /> Nueva Receta
          </Link>
        </div>
      </div>

      {/* GRID DE RECETAS */}
      <div className="bg-white border border-brand-dark/10 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-200">
            <thead className="bg-brand-dark/5 text-[9px] uppercase tracking-widest text-brand-dark/60 font-bold border-b border-brand-dark/10">
              <tr>
                <th className="px-6 py-4">Cóctel</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Ingredientes</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/5">
              {loading && recipes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center animate-pulse text-[10px] uppercase tracking-widest text-brand-dark/20"
                  >
                    Preparando la barra...
                  </td>
                </tr>
              ) : (
                filteredRecipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="hover:bg-brand-cream/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-dark/5 rounded-sm flex items-center justify-center border border-brand-dark/5 overflow-hidden">
                          {recipe.image ? (
                            <img
                              src={recipe.image}
                              alt={recipe.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <GlassWater
                              size={18}
                              className="text-brand-dark/20"
                            />
                          )}
                        </div>
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-tight">
                          {recipe.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-brand-dark/40 italic">
                      /{recipe.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-brand-dark/5 text-brand-dark/60 rounded-sm flex items-center gap-1 w-fit">
                        <UtensilsCrossed size={10} />{" "}
                        {recipe.ingredients?.length || 0} Insumos
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] uppercase font-medium text-brand-dark/40">
                      {recipe.user?.name || "Admin"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/mixologia/${recipe.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-brand-dark/40 hover:text-brand-orange transition-all"
                        >
                          <Eye size={16} />
                        </a>
                        <Link
                          to={`/admin/mixology/edit/${recipe._id}`}
                          className="p-2 text-brand-dark/40 hover:text-brand-orange transition-all"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe._id, recipe.name)}
                          className="p-2 text-brand-dark/40 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
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
        <p className="text-[9px] text-brand-dark/30 uppercase tracking-widest flex items-center justify-center gap-2">
          Desliza para ver acciones <MoreVertical size={10} />
        </p>
      </div>
    </div>
  );
};

export default AdminMixologyPage;
