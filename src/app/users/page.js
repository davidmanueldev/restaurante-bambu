'use client';
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const {loading,data} = useProfile();

  useEffect(() => {
    fetch('/api/users').then(response => {
      response.json().then(users => {
        setUsers(users);
      });
    })
  }, []);

  if (loading) {
    return 'Cargando la información de usuario...';
  }

  if (!data.admin) {
    return 'No es un administrador.';
  }

  return (
    <section className="max-w-4xl mx-auto mt-8 mb-24">
      <UserTabs isAdmin={true} />
      <div className="mt-12">
        <div className="space-y-3">
          {users?.length > 0 && users.map(user => (
            <div
              key={user._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow items-center">
                <div className="text-gray-900 font-bold">
                  {!!user.name && (<span>{user.name}</span>)}
                  {!user.name && (<span className="italic text-gray-400 font-normal">Sin nombre</span>)}
                </div>
                <span className="text-gray-500 font-medium truncate">{user.email}</span>
                <span className="hidden md:block text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit">
                  Usuario Registrado
                </span>
              </div>
              <div className="shrink-0">
                <Link className="px-6 py-2 bg-gray-50 border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:border-primary-400 hover:bg-white transition-all inline-block" href={'/users/'+user._id}>
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}