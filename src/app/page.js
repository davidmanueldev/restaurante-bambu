import Whatsapp from "@/components/icons/Whatsapp";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      
      <section className="my-32" id="about">
        <div className="bg-bambu-950 text-white rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-fire/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="uppercase text-primary-400 font-bold tracking-[0.2em] text-sm mb-4">
                Nuestra Historia
              </h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
                Tradición y <br/>
                <span className="text-primary-300">Pasión por el Fuego</span>
              </h2>
              <div className="w-20 h-1.5 bg-accent-fire mb-8 rounded-full"></div>
            </div>
            <div className="text-primary-50/70 text-lg font-light leading-relaxed flex flex-col gap-6">
              <p>
                En <span className="font-semibold text-white">The Grill Bambú</span>, cada plato es una obra maestra forjada en el calor de nuestra cocina artesanal. Nuestra historia comenzó con una visión simple: fusionar los sabores más frescos de la naturaleza con la intensidad del fuego tradicional.
              </p>
              <p>
                Seleccionamos cuidadosamente cada ingrediente, priorizando la calidad y la frescura para ofrecer una experiencia gastronómica que trasciende lo convencional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center my-32 py-24 bg-bambu-50/30 rounded-[3rem]" id="contact">
        <SectionHeaders
          subHeader={'Estamos para servirle'}
          mainHeader={'Hablemos de su Experiencia'}
        />
        <p className="text-gray-500 max-w-xl mx-auto mb-12 text-lg">
          ¿Tiene alguna duda o desea realizar un pedido especial? Nuestro equipo está listo para atenderle con la calidez que nos caracteriza.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <a className="flex justify-center bg-whatsapp hover:bg-[#39ad48] items-center gap-4 text-white font-black text-2xl md:text-3xl px-12 py-6 rounded-full shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95" 
             href="https://api.whatsapp.com/send?phone=59162294912&text=Hola%2C%20tengo%20una%20consulta%20con%20mi%20pedido" 
             target="_blank">
            <Whatsapp className="w-8 h-8 md:w-10 md:h-10"/>
            +591 62294912
          </a>
        </div>
      </section>
    </>
  )
}

