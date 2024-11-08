import Right from "@/components/icons/Right";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Todo<br />
          es mejor<br />
          con una&nbsp;
          <span className="text-primary">
            Buena Comida
          </span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Disfrute de la mejor comida en Restaurante Bambú. Ofrecemos una amplia variedad de platos para satisfacer su apetito. 
        </p>
        <div className="flex gap-4 text-sm">
          <button className="flex justify-center bg-primary uppercase items-center gap-2 text-white px-4 py-2 rounded-full">
            Compre Ya!!
            <Right />
          </button>
          <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            <a href="https://www.google.com">Saber más</a>
            <Right />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image src={'/carne.png'} layout={'fill'} objectFit={'contain'} alt={'pizza'} />
      </div>
    </section>
  );
}