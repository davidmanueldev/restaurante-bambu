'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import {useEffect, useState} from "react";
import {useProfile} from "@/components/UseProfile";
import toast from "react-hot-toast";
import SectionHeaders from "@/components/layout/SectionHeaders";
import ChevronDown from "@/components/icons/ChevronDown";

export default function CategoriesPage() {

  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('main');
  const [categories, setCategories] = useState([]);
  const {loading:profileLoading, data:profileData} = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    if (!categoryName) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = {name:categoryName, type:categoryType};
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      const response = await fetch('/api/categories', {
        method: editedCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setCategoryName('');
      setCategoryType('main');
      fetchCategories();
      setEditedCategory(null);
      if (response.ok)
        resolve();
      else
        reject();
    });
    await toast.promise(creationPromise, {
      loading: editedCategory
                 ? 'Actualizando...'
                 : 'Creando categoría...',
      success: editedCategory ? 'Categoría actualizada' : 'Categoría creada',
      error: 'Hubo un error',
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/categories?_id='+_id, {
        method: 'DELETE',
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: 'Eliminando...',
      success: 'Categoría eliminada',
      error: 'Error al eliminar',
    });

    fetchCategories();
  }

  if (profileLoading) {
    return <div className="text-center mt-24 text-gray-500 font-medium">Cargando la información del usuario...</div>;
  }

  if (!profileData.admin) {
    return <div className="text-center mt-24 text-red-500 font-bold">No es un administrador</div>;
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'main': return 'Plato Principal / Carne';
      case 'side': return 'Guarnición / Extra';
      case 'drink': return 'Bebida';
      default: return 'Otro';
    }
  };

  const buttonStyle = "flex-1 md:flex-none px-6 py-2.5 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 h-fit";

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto px-4">
      <UserTabs isAdmin={true} />
      <div className="mt-12 text-center">
        <SectionHeaders mainHeader="Categorías del Menú" subHeader="Configuración" />
      </div>
      
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-primary-100/20 border-2 border-gray-50 mt-8">
        <form onSubmit={handleCategorySubmit} className="mb-16 border-b-2 border-gray-50 pb-16">
          <h3 className="text-2xl font-black text-primary-950 tracking-tighter mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
            {editedCategory ? `Editar: ${editedCategory.name}` : 'Crear Nueva Categoría'}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-primary-900 font-bold text-base ml-1">Nombre de Categoría</label>
              <input type="text"
                     placeholder="Ej: Cortes Premium"
                     className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all mb-0 font-medium"
                     value={categoryName}
                     onChange={ev => setCategoryName(ev.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-primary-900 font-bold text-base ml-1">Comportamiento en Sistema</label>
              <div className="relative">
                <select 
                  value={categoryType}
                  onChange={ev => setCategoryType(ev.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all cursor-pointer appearance-none font-medium text-gray-700 pr-12"
                >
                  <option value="main">Plato Principal / Carnes</option>
                  <option value="side">Guarnición / Extra</option>
                  <option value="drink">Bebida</option>
                  <option value="other">Otro</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button className="primary flex-1 w-full py-4 text-lg tracking-tight" type="submit">
                {editedCategory ? 'GUARDAR CAMBIOS' : 'REGISTRAR CATEGORÍA'}
              </button>
              {editedCategory && (
                <button
                  type="button"
                  className="flex-1 w-full bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all py-4 border-2 border-transparent active:scale-95"
                  onClick={() => {
                    setEditedCategory(null);
                    setCategoryName('');
                    setCategoryType('main');
                  }}>
                  CANCELAR
                </button>
              )}
            </div>
          </div>
        </form>

        <div>
          <h3 className="text-2xl font-black text-primary-950 tracking-tighter mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-accent-fire rounded-full"></span>
            Categorías Existentes
          </h3>
          <div className="grid gap-4">
            {categories?.length > 0 ? categories.map(c => (
              <div
                key={c._id}
                className="bg-white border-2 border-gray-50 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center justify-between transition-all hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/30 group overflow-hidden">
                <div className="grow flex flex-col text-center md:text-left min-w-0">
                  <span className="font-black text-xl text-primary-950 tracking-tight group-hover:text-primary-600 transition-colors truncate">{c.name}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-500 mt-1">
                    {getTypeLabel(c.type || 'main')}
                  </span>
                </div>
                <div className="flex gap-3 w-full md:w-auto shrink-0 justify-center">
                  <button type="button"
                          className={buttonStyle}
                          onClick={() => {
                            setEditedCategory(c);
                            setCategoryName(c.name);
                            setCategoryType(c.type || 'main');
                          }}
                  >
                    Editar
                  </button>
                  <DeleteButton
                    label="Eliminar"
                    className={`${buttonStyle} hover:border-red-400 hover:text-red-600`}
                    onDelete={() => handleDeleteClick(c._id)} />
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 font-medium">
                No hay categorías creadas aún.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
