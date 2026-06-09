import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {image, description, name, basePrice,
    sizes, extraIngredientPrices,
  } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
  return (
    <div className="bg-white p-8 rounded-[2rem] text-center border-2 border-gray-50
      group hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
      <div className="relative h-48 mb-6 transition-transform duration-500 group-hover:scale-110">
        <img src={image} className="h-full w-full object-contain mx-auto" alt={name}/>
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-2xl mb-4 text-primary-950 group-hover:text-primary-600 transition-colors">{name}</h4>
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-50">
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