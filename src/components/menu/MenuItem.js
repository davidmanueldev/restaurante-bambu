import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import {useContext, useState} from "react";
import FlyingButton from "react-flying-item";
import toast from "react-hot-toast";

export default function MenuItem(menuItem) {
  const {
    image,name,description,basePrice,
    sizes, extraIngredientPrices,
  } = menuItem;
  const [
    selectedSize, setSelectedSize
  ] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const {addToCart} = useContext(CartContext);

  async function handleAddToCartButtonClick() {
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowPopup(false);
  }

  function handleExtraThingClick(extraThing) {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e._id === extraThing._id);
      if (exists) {
        return prev.filter(e => e._id !== extraThing._id);
      }
      return [...prev, extraThing];
    });
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div
            onClick={ev => ev.stopPropagation()}
            className="bg-white rounded-[2.5rem] shadow-2xl max-w-3xl w-full overflow-hidden animate-in zoom-in fade-in duration-300 border-4 border-gray-50 flex flex-col md:flex-row max-h-[90vh]">

            {/* Image Section */}
            <div className="md:w-5/12 bg-gray-50 flex items-center justify-center p-8 relative min-h-[300px] md:min-h-0">
              <div className="relative w-full h-full min-h-[200px]">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-contain drop-shadow-2xl" />
              </div>
            </div>

            {/* Content Section */}
            <div className="md:w-7/12 p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-primary-950 tracking-tighter mb-3 leading-none">{name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {description}
                </p>
              </div>

              <div className="space-y-6 flex-grow">
                {sizes?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-500 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                      Tamaño de la porción
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {sizes.map(size => (
                        <button
                          key={size._id}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 rounded-xl border-2 transition-all text-xs font-bold flex flex-col gap-1 items-start ${
                            selectedSize?.name === size.name 
                            ? 'border-primary-600 bg-primary-50 text-primary-700' 
                            : 'border-gray-100 bg-white text-gray-500 hover:border-primary-200'
                          }`}
                        >
                          <span className="block">{size.name}</span>
                          <span className="text-[10px] opacity-60">Bs {basePrice + size.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {extraIngredientPrices?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-500 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-fire rounded-full"></span>
                      ¿Deseas algo extra?
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {extraIngredientPrices.map(extra => (
                        <button
                          key={extra._id}
                          onClick={() => handleExtraThingClick(extra)}
                          className={`p-3 rounded-xl border-2 transition-all text-xs font-bold flex flex-col gap-1 items-start ${
                            selectedExtras.find(e => e._id === extra._id)
                            ? 'border-primary-600 bg-primary-50 text-primary-700' 
                            : 'border-gray-100 bg-white text-gray-500 hover:border-primary-200'
                          }`}
                        >
                          <span className="block">{extra.name}</span>
                          <span className="text-[10px] opacity-60">+ Bs {extra.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-50">
                <div className="flex justify-between items-center px-1 mb-6">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total a pagar</span>
                  <span className="text-3xl font-black text-primary-950 tracking-tighter">Bs {selectedPrice}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 font-bold text-gray-400 hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest">
                    Cancelar
                  </button>
                  <div className="grow">
                    <FlyingButton targetTop={'5%'} targetLeft={'95%'} src={image}>
                      <div 
                        className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-6 rounded-full shadow-lg shadow-primary-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-tight whitespace-nowrap"
                        onClick={handleAddToCartButtonClick}>
                        Añadir al Carrito
                      </div>
                    </FlyingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}