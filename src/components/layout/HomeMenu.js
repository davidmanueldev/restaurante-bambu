'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setBestSellers(menuItems.slice(-3));
      });
    });
  }, []);
  return (
    <section className="relative mt-24">
      <div className="absolute left-0 right-0 w-full justify-start overflow-x-hidden pointer-events-none">
        <div className="absolute -left-12 -top-[120px] text-left -z-10 opacity-40 md:opacity-100">
          <Image src={'/sallad1.png'} width={160} height={280}  alt={'sallad'} className="rotate-12" />
        </div>
        <div className="absolute -top-[150px] -right-12 -z-10 opacity-40 md:opacity-100">
          <Image src={'/sallad2.png'} width={160} height={280} alt={'sallad'} className="-rotate-12" />
        </div>
      </div>
      <div className="text-center mb-16">
        <SectionHeaders
          subHeader={'Elija entre'}
          mainHeader={'Nuestros Mejores Platos'} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bestSellers?.length > 0 && bestSellers.map(item => (
          <MenuItem key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
}