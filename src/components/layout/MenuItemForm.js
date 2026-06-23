'use client';
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import {useEffect, useState} from "react";
import DeleteButton from "@/components/DeleteButton";
import ChevronDown from "@/components/icons/ChevronDown";

export default function MenuItemForm({onSubmit,menuItem,onDelete}) {
  const [image, setImage] = useState(menuItem?.image || '');
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || '');
  const [categories, setCategories] = useState([]);
  const [
    extraIngredientPrices,
    setExtraIngredientPrices,
  ] = useState(menuItem?.extraIngredientPrices || []);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
        if (categories.length > 0 && !category) {
          setCategory(categories[0]._id);
        }
      });
    });
  }, [category]);

  return (
    <form
      onSubmit={ev =>
        onSubmit(ev, {
          image,name,description,basePrice,sizes,extraIngredientPrices,category,
        })
      }
      className="mt-8 max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl shadow-primary-100/20 border-2 border-gray-50">
      <div
        className="md:grid items-start gap-12"
        style={{gridTemplateColumns:'.3fr .7fr'}}>
        <div className="mb-8 md:mb-0">
          <EditableImage link={image} setLink={setImage} />
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-primary-900 font-bold text-base ml-1">Nombre del Plato/Item</label>
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all mb-0 font-medium"
              placeholder="Ej. Bife de Chorizo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-primary-900 font-bold text-base ml-1">Descripción</label>
            <textarea
              type="text"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all mb-0 font-medium resize-none"
              placeholder="Escribe una breve descripción de los ingredientes..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-primary-900 font-bold text-base ml-1">Categoría</label>
              <div className="relative">
                <select 
                  value={category} 
                  onChange={ev => setCategory(ev.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all cursor-pointer appearance-none font-medium text-gray-700 pr-12"
                >
                  {categories?.length > 0 ? (
                    categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))
                  ) : (
                    <option value="">Cargando categorías...</option>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-primary-900 font-bold text-base ml-1">Precio Base (Bs)</label>
              <input
                type="text"
                value={basePrice}
                onChange={ev => setBasePrice(ev.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all mb-0 font-medium"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-primary-50/30 p-8 rounded-[2rem] border-2 border-primary-50 space-y-8">
            <MenuItemPriceProps name={'Tamaños / Porciones'}
                                addLabel={'Añadir tamaño'}
                                props={sizes}
                                setProps={setSizes} />
            <MenuItemPriceProps name={'Ingredientes Extra / Guarniciones'}
                                addLabel={'Añadir extra'}
                                props={extraIngredientPrices}
                                setProps={setExtraIngredientPrices}/>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button type="submit" className="primary flex-[2] py-4 text-lg tracking-tight">
              {menuItem ? 'ACTUALIZAR ITEM' : 'CREAR ITEM'}
            </button>
            {onDelete && (
              <DeleteButton
                label="ELIMINAR"
                onDelete={onDelete}
                className="flex-1 bg-white border-2 border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-400 rounded-full py-4 font-black transition-all active:scale-95 shadow-sm hover:shadow-md"
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
