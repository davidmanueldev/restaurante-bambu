export default function SectionHeaders({subHeader,mainHeader}) {
  return (
    <div className="text-center mb-16">
      <h3 className="uppercase text-primary-500 font-black tracking-[0.3em] text-xs mb-3">
        {subHeader}
      </h3>
      <h2 className="text-primary-950 font-black text-5xl md:text-6xl tracking-tighter leading-none mb-6">
        {mainHeader}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <div className="w-10 h-1.5 bg-accent-fire rounded-full"></div>
        <div className="w-3 h-1.5 bg-primary-600 rounded-full"></div>
        <div className="w-10 h-1.5 bg-accent-fire rounded-full"></div>
      </div>
    </div>
  );
}