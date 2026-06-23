'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function UserTabs({isAdmin}) {
  const path = usePathname();
  
  const activeClass = "bg-primary-600 text-white shadow-md shadow-primary-200";
  const inactiveClass = "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700";
  
  return (
    <div className="flex mx-auto gap-4 tabs justify-center flex-wrap max-w-3xl">
      <Link
        className={`px-6 py-3 rounded-full font-bold transition-all ${path === '/profile' ? activeClass : inactiveClass}`}
        href={'/profile'}
      >
        Perfil
      </Link>
      <Link
        className={`px-6 py-3 rounded-full font-bold transition-all ${path === '/recompensas' ? activeClass : inactiveClass}`}
        href={'/recompensas'}
      >
        Recompensas
      </Link>
      <Link
        className={`px-6 py-3 rounded-full font-bold transition-all ${path === '/orders' ? activeClass : inactiveClass}`}
        href={'/orders'}
      >
        Pedidos
      </Link>
      {isAdmin && (
        <>
          <div className="w-px bg-gray-200 mx-2 hidden md:block"></div>
          <Link
            href={'/categories'}
            className={`px-6 py-3 rounded-full font-bold transition-all ${path === '/categories' ? activeClass : inactiveClass}`}
          >
            Categorias
          </Link>
          <Link
            href={'/menu-items'}
            className={`px-6 py-3 rounded-full font-bold transition-all ${path.includes('menu-items') ? activeClass : inactiveClass}`}
          >
            Menú Admin
          </Link>
          <Link
            className={`px-6 py-3 rounded-full font-bold transition-all ${path.includes('/users') ? activeClass : inactiveClass}`}
            href={'/users'}
          >
            Usuarios
          </Link>
        </>
      )}
    </div>
  );
}