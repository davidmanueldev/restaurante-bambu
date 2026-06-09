export default function SectionHeaders({subHeader,mainHeader}) {
  return (
    <div className="text-center mb-12">
      <h3 className="uppercase text-primary-500 font-bold tracking-[0.2em] text-sm mb-2">
        {subHeader}
      </h3>
      <h2 className="text-primary-950 font-black text-4xl md:text-5xl tracking-tighter">
        {mainHeader}
      </h2>
      <div className="w-24 h-1.5 bg-accent-fire mx-auto mt-6 rounded-full"></div>
    </div>
  );
}