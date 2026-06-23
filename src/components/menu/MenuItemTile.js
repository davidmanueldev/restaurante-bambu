import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {image, description, name, basePrice,
    sizes, extraIngredientPrices,
  } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
  
  return (
    <div className="bg-white p-6 rounded-[2.5rem] text-center border-2 border-gray-50
      group hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-100/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-bl-[5rem] -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

      <div className="relative h-44 mb-6 transition-transform duration-500 group-hover:scale-110 z-10">
        <img 
          src={image} 
          className="h-full w-full object-contain mx-auto drop-shadow-xl" 
          alt={name}
        />
      </div>

      <div className="flex-grow flex flex-col z-10">
        <h4 className="font-black text-xl mb-3 text-primary-950 group-hover:text-primary-600 transition-colors leading-tight">
          {name}
        </h4>
        <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed mb-6 px-2">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-50 w-full z-10">
        <AddToCartButton
          image={image}
          hasSizesOrExtras={hasSizesOrExtras}
          onClick={onAddToCart}
          basePrice={basePrice}
        />
      </div>
    </div>
  );
}