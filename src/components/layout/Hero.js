import Right from "@/components/icons/Right";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero md:mt-8 mb-24">
      <div className="py-12 md:py-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
          Todo es mejor<br />
          con una&nbsp;
          <span className="text-primary-600">
            Buena Parrilla
          </span>
        </h1>
        <p className="my-10 text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-lg">
          Disfrute de la mejor comida en <span className="font-semibold text-primary-800">The Grill Bambú</span>. Ofrecemos una experiencia artesanal diseñada para satisfacer los paladares más exigentes.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 text-base">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            ORDENAR AHORA
            <Right className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center border-2 border-gray-100 bg-white hover:bg-gray-50 text-gray-700 px-10 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 gap-3">
            <a href="#about">Nuestra Historia</a>
            <Right className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block h-[600px] w-full">
        <div className="absolute inset-0 bg-primary-100/30 rounded-3xl -rotate-2 -z-10 transition-transform hover:rotate-0 duration-700"></div>
        <div className="relative h-full w-full drop-shadow-2xl">
          <Image 
            src={'/carne.png'} 
            layout={'fill'} 
            objectFit={'contain'} 
            alt={'parrilla'} 
            className="hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </section>
  );
}