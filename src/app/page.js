import Whatsapp from "@/components/icons/Whatsapp";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Nuestra Historia'}
          mainHeader={'Restaurante Bambú Origins'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni minima odit recusandae. Illum ipsa non repudiandae? Eum ipsam iste quos suscipit tempora? Aperiam esse fugiat inventore laboriosam officiis quam rem!
          </p>
          <p>At consectetur delectus ducimus est facere iure molestias obcaecati quaerat vitae voluptate? Aspernatur dolor explicabo iste minus molestiae pariatur provident quibusdam saepe?</p>
          <p>Laborum molestias neque nulla obcaecati odio quia quod reprehenderit sit vitae voluptates? Eos, tenetur.</p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'No dude en llamarnos'}
          mainHeader={'Contáctese con Nosotros'}
        />
        <div className="flex justify-center gap-2 mt-8">
          <a className="flex justify-center bg-whatsapp items-center gap-2 text-white font-semibold text-4xl px-4 py-2 rounded-full" href="tel:+59162294912">
            <Whatsapp/>
            {/* +591 62294912 */}
            +591 62294912
          </a>
        </div>
      </section>
    </>
  )
}
