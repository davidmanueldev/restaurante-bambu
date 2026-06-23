'use client';
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

import SectionHeaders from "@/components/layout/SectionHeaders";

export default function MenuItemsPage() {

  const [menuItems, setMenuItems] = useState([]);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    })
  }, []);

  if (loading) {
    return <div className="text-center mt-24 text-gray-500 font-medium">Cargando la información...</div>;
  }

  if (!data.admin) {
    return <div className="text-center mt-24 text-red-500 font-bold">No tienes permisos de administrador.</div>;
  }

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto px-4">
      <UserTabs isAdmin={true} />

      <div className="mt-12 text-center">
        <SectionHeaders mainHeader="Gestión de Menú" subHeader="Panel Admin" />
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <Link
          className="flex items-center justify-center gap-3 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-full font-black text-lg transition-all shadow-lg shadow-primary-100/50 group"
          href={'/menu-items/new'}>
          <span>CREAR NUEVO ITEM DEL MENÚ</span>
          <Right className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-black text-primary-950 tracking-tighter mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-accent-fire rounded-full"></span>
          Items en el Catálogo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems?.length > 0 ? menuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/'+item._id}
              className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 flex flex-col items-center gap-4 transition-all hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-100/30 group hover:-translate-y-2"
            >
              <div className="relative h-48 w-full transition-transform duration-500 group-hover:scale-110">
                <Image
                  className="object-contain mx-auto"
                  src={item.image} alt={item.name} fill />
              </div>
              <div className="text-center mt-4">
                <h4 className="font-black text-xl text-primary-950 tracking-tight group-hover:text-primary-600 transition-colors">
                  {item.name}
                </h4>
                <div className="mt-2 inline-block px-4 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-full group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                  ID: {item._id.slice(-6).toUpperCase()}
                </div>
              </div>
              <div className="mt-auto w-full pt-6 border-t border-gray-50">
                <div className="flex items-center justify-center gap-2 text-primary-600 font-bold">
                  <span>Editar Item</span>
                  <Right className="w-4 h-4" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center text-gray-400 py-16 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 font-medium">
              Aún no has creado ningún item para el menú.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}