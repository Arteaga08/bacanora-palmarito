import React, { useEffect, useState } from "react";
import clientAxios from "../../services/axiosConfig";
import VidixImage from "../../components/VidixImage";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  GlassWater,
  UtensilsCrossed,
  MoreVertical,
  Eye,
  Loader2,
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
        await clientAxios.delete(`/mixology/${id}`);
        setRecipes(recipes.filter((r) => r._id !== id));
      } catch (error) {
        alert("No se pudo eliminar la receta.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && recipes.length === 0)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-clay" size={32} />
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* HEADER - Sin cambios */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-brand-black/10 pb-6">
        <div>
          <h1 className="text-3xl font-brand-serif text-brand-black tracking-tighter">
            Recetario de Mixología
          </h1>
          <p className="text-[10px] font-brand-sans uppercase tracking-[0.3em] text-brand-black/40 mt-1 font-bold">
            {recipes.length} Cócteles publicados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Buscar cóctel..."
              className="pl-9 pr-4 py-2 text-sm font-brand-sans border border-brand-black/10 rounded-sm outline-none focus:border-brand-clay w-full sm:w-64 bg-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/admin/mixology/new"
            className="bg-brand-clay hover:bg-brand-black text-brand-beige px-4 py-2 rounded-sm text-[10px] font-brand-sans font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} /> Nueva Receta
          </Link>
        </div>
      </div>

      {/* GRID DE RECETAS (TABLA) */}
      <div className="bg-white border border-brand-black/10 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-200">
            <thead className="bg-brand-black/5 text-[9px] font-brand-sans uppercase tracking-widest text-brand-black/60 font-bold border-b border-brand-black/10">
              <tr>
                <th className="px-6 py-4">Cóctel</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Ingredientes</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5 font-brand-sans">
              {filteredRecipes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[10px] uppercase tracking-widest text-brand-black/40 italic"
                  >
                    No se encontraron recetas
                  </td>
                </tr>
              ) : (
                filteredRecipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="hover:bg-brand-beige/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* 🛡️ MINIATURA DEL CÓCTEL PROTEGIDA POR VIDIX STUDIO */}
                        <div className="w-12 h-12 bg-brand-black/5 rounded-sm flex items-center justify-center border border-brand-black/5 overflow-hidden shrink-0">
                          {recipe.image ? (
                            <VidixImage
                              src={recipe.image}
                              alt={recipe.name}
                              className="w-full h-full object-cover"
                              // Como es una miniatura de 48px, pedimos anchos pequeños para no gastar banda
                              widths={[100, 200]}
                              sizes="48px"
                            />
                          ) : (
                            <GlassWater
                              size={18}
                              className="text-brand-black/20"
                            />
                          )}
                        </div>
                        <span className="text-xs font-bold text-brand-black uppercase tracking-tight">
                          {recipe.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-brand-black/40 italic">
                      /{recipe.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] uppercase font-bold px-2 py-1 bg-brand-black/5 text-brand-black/60 rounded-sm flex items-center gap-1 w-fit border border-brand-black/5">
                        <UtensilsCrossed
                          size={10}
                          className="text-brand-clay"
                        />{" "}
                        {recipe.ingredients?.length || 0} Insumos
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] uppercase font-medium text-brand-black/40">
                      {recipe.user?.name || "Admin"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* ACCIONES - Sin cambios significativos */}
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/mixologia/${recipe.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-brand-black/30 hover:text-brand-clay transition-all"
                          title="Ver en tienda"
                        >
                          <Eye size={16} />
                        </a>
                        <Link
                          to={`/admin/mixology/edit/${recipe._id}`}
                          className="p-2 text-brand-black/30 hover:text-brand-clay transition-all"
                          title="Editar receta"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe._id, recipe.name)}
                          className="p-2 text-brand-black/30 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                          title="Eliminar receta"
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

export default AdminMixologyPage;
