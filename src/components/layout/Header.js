"use client";
import { CartContext } from "@/components/AppContext";
import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";

function AuthLinks({ status, userName }) {
  if (status === "authenticated") {
    return (
      <>
        <Link href={"/profile"} className="whitespace-nowrap hover:text-primary-600 transition-colors">
          Hola, <span className="font-bold text-primary-700">{userName}</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary-600 hover:bg-primary-700 rounded-full text-white px-8 py-3 font-bold shadow-md shadow-primary-200 transition-all active:scale-95"
        >
          Cerrar Sesión
        </button>
      </>
    );
  }
  if (status === "unauthenticated" || status === "loading") {
    return (
      <>
        <Link href={"/login"} className="hover:text-primary-600 transition-colors">Iniciar Sesión</Link>
        <Link
          href={"/register"}
          className="bg-primary-600 hover:bg-primary-700 rounded-full text-white px-8 py-3 font-bold shadow-md shadow-primary-200 transition-all active:scale-95"
        >
          Registro
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(CartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const path = usePathname();

  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/menu", label: "Menú Completo" },
    { href: "/pedidos", label: "Armar Pedido" },
    { href: "/#about", label: "Nosotros" },
    { href: "/#contact", label: "Contacto" },
  ];

  return (
    <header className="py-6 mb-12">
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary-600 font-black text-3xl tracking-tighter" href={"/"}>
          Bambú
        </Link>
        <div className="flex gap-6 items-center">
          <Link href={"/cart"} className="relative p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-fire text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full leading-none shadow-sm">
                {cartProducts.length}
              </span>
            )}
          </Link>
          <button
            className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden fixed inset-x-4 top-24 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl z-50 flex flex-col gap-6 text-center border border-white/50"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-semibold transition-colors ${
                path === link.href ? "text-primary-600 font-bold" : "hover:text-primary-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-4">
            <AuthLinks status={status} userName={userName} />
          </div>
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 lg:gap-10 text-gray-500 font-medium">
          <Link className="text-primary-600 font-black text-3xl tracking-tighter mr-4" href={"/"}>
            Bambú
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative transition-all duration-300 hover:text-primary-600 ${
                path === link.href ? "text-primary-600 font-bold" : ""
              }`}
            >
              {link.label}
              {path === link.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600 rounded-full transition-all duration-500 ease-in-out"></span>
              )}
            </Link>
          ))}
        </nav>
        <nav className="flex items-center gap-8 text-gray-500 font-medium">
          <AuthLinks status={status} userName={userName} />
          <Link href={"/cart"} className="relative p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all hover:scale-110 active:scale-95">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-fire text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full leading-none shadow-md shadow-accent-fire/30">
                {cartProducts.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

