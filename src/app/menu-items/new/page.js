'use client';
import Left from "@/components/icons/Left";
import Right from "@/components/icons/Right";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {redirect} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function NewMenuItemPage() {

  const [redirectToItems, setRedirectToItems] = useState(false);
  const {loading, data} = useProfile();

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(savingPromise, {
      loading: 'Guardando el nuevo item...',
      success: '¡Item guardado exitosamente!',
      error: 'Hubo un error al guardar.',
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect('/menu-items');
  }

  if (loading) {
    return <div className="text-center mt-24 text-gray-500 font-medium">Cargando la información de usuario...</div>;
  }

  if (!data.admin) {
    return <div className="text-center mt-24 text-red-500 font-bold">No tienes permisos de administrador.</div>;
  }

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-12 text-center">
        <SectionHeaders mainHeader="Crear Nuevo Item" subHeader="Menú Admin" />
      </div>
      <div className="max-w-4xl mx-auto mt-8 mb-4">
        <Link href={'/menu-items'} className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-6 py-3 rounded-full hover:bg-primary-100 transition-colors">
          <Left className="w-5 h-5" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}