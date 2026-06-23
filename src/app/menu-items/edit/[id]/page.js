'use client';
import DeleteButton from "@/components/DeleteButton";
import Left from "@/components/icons/Left";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {redirect, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function EditMenuItemPage() {

  const {id} = useParams();

  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(items => {
        const item = items.find(i => i._id === id);
        setMenuItem(item);
      });
    })
  }, [id]);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    data = {...data, _id:id};
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(savingPromise, {
      loading: 'Actualizando item...',
      success: '¡Actualizado correctamente!',
      error: 'Error al actualizar',
    });

    setRedirectToItems(true);
  }

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/menu-items?_id='+id, {
        method: 'DELETE',
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Borrando...',
      success: '¡Item eliminado!',
      error: 'Error al eliminar',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (loading || !menuItem) {
    return <div className="text-center mt-24 text-gray-500 font-medium">Cargando información...</div>;
  }

  if (!data.admin) {
    return <div className="text-center mt-24 text-red-500 font-bold">No tienes permisos de administrador.</div>;
  }

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-12 text-center">
        <SectionHeaders mainHeader="Editar Item" subHeader="Menú Admin" />
      </div>
      <div className="max-w-4xl mx-auto mt-8 mb-4">
        <Link href={'/menu-items'} className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-6 py-3 rounded-full hover:bg-primary-100 transition-colors">
          <Left className="w-5 h-5" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
      
      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} onDelete={handleDeleteClick} />
    </section>
  );
}