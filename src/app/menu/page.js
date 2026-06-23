'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import {useEffect, useState} from "react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories))
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
  }, []);

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchPhrase.toLowerCase())
  );

  return (
    <section className="mt-8 mb-24 px-4 max-w-7xl mx-auto overflow-x-hidden">
      <div className="text-center mb-16">
        <SectionHeaders mainHeader="Nuestro Menú" subHeader="Explora" />
      </div>

      <div className="max-w-2xl mx-auto mb-20 relative group px-2">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-primary-500 group-focus-within:text-primary-600 transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Busca tu platillo favorito..."
          className="w-full bg-white border-2 border-gray-100 rounded-full py-5 pl-16 pr-12 text-lg font-medium shadow-xl shadow-primary-100/20 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none placeholder:text-gray-300 relative"
          value={searchPhrase}
          onChange={ev => setSearchPhrase(ev.target.value)}
        />
        {searchPhrase && (
          <button 
            onClick={() => setSearchPhrase('')}
            className="absolute inset-y-0 right-4 flex items-center pr-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {categories?.length > 0 && categories.map(c => {
        const categoryItems = filteredItems.filter(item => item.category === c._id);
        if (categoryItems.length === 0) return null;

        return (
          <div key={c._id} className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-3xl font-black text-primary-950 tracking-tighter whitespace-nowrap">
                {c.name}
              </h3>
              <div className="h-px bg-gray-100 grow"></div>
              <span className="bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-sm font-bold">
                {categoryItems.length} items
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryItems.map(item => (
                <MenuItem key={item._id} {...item} />
              ))}
            </div>
          </div>
        );
      })}

      {filteredItems.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-6">🍽️</div>
          <h3 className="text-2xl font-black text-primary-950 tracking-tighter mb-2">No encontramos nada...</h3>
          <p className="text-gray-500 font-medium">Intenta con otro nombre o ingrediente.</p>
          <button 
            onClick={() => setSearchPhrase('')}
            className="mt-8 text-primary-600 font-bold hover:underline underline-offset-4"
          >
            Ver todo el menú
          </button>
        </div>
      )}
    </section>
  );
}