'use client';
import {CartContext} from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PedidosPage() {
  const {addToCart} = useContext(CartContext);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPlates, setTotalPlates] = useState(null);
  const [activePlate, setActivePlate] = useState(0);
  const [plates, setPlates] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/menu-items').then(res => res.json())
    ]).then(([cats, items]) => {
      setCategories(cats);
      setMenuItems(items);
      setLoading(false);
    });
  }, []);

  function handleTotalPlatesChange(num) {
    setTotalPlates(num);
    // Initialize plates
    const initialPlates = Array.from({length: num}).map((_, i) => ({
      id: `plate-${Date.now()}-${i}`,
      numCarnes: 1, // Default 1 meat
      carnes: [],
      guarnicion: null
    }));
    setPlates(initialPlates);
    setActivePlate(0);
  }

  function getPlatePrice(plate) {
    let price = 0;
    
    // Suma el precio de cada carne seleccionada
    if (plate.carnes?.length > 0) {
      price += plate.carnes.reduce((acc, carne) => acc + (carne.basePrice || 0), 0);
    }
    
    // Suma el precio de la guarnición seleccionada
    if (plate.guarnicion) {
      price += (plate.guarnicion.basePrice || 0);
    }
    
    return price;
  }

  function handleMeatSelection(item) {
    setPlates(prev => {
      const newPlates = [...prev];
      const plate = { ...newPlates[activePlate] };
      plate.carnes = [...plate.carnes];
      
      const alreadySelected = plate.carnes.find(c => c._id === item._id);
      
      if (alreadySelected) {
        plate.carnes = plate.carnes.filter(c => c._id !== item._id);
      } else {
        if (plate.carnes.length < plate.numCarnes) {
          plate.carnes.push(item);
        } else {
          toast.error(`Solo puedes seleccionar ${plate.numCarnes} carne(s) para este plato.`);
        }
      }
      newPlates[activePlate] = plate;
      return newPlates;
    });
  }

  function handleSideSelection(item) {
    setPlates(prev => {
      const newPlates = [...prev];
      const plate = { ...newPlates[activePlate] };
      plate.guarnicion = item;
      newPlates[activePlate] = plate;
      return newPlates;
    });
  }

  function handleNumCarnesChange(num) {
    setPlates(prev => {
      const newPlates = [...prev];
      const plate = { ...newPlates[activePlate] };
      plate.numCarnes = num;
      // Trim selected meats if needed
      if (plate.carnes.length > num) {
        plate.carnes = plate.carnes.slice(0, num);
      }
      newPlates[activePlate] = plate;
      return newPlates;
    });
  }

  function isPlateComplete(plate) {
    return plate.carnes.length === plate.numCarnes && plate.guarnicion !== null;
  }

  function allPlatesComplete() {
    if (!plates || plates.length === 0) return false;
    return plates.every(isPlateComplete);
  }

  function handleCheckout() {
    if (!allPlatesComplete()) {
      toast.error('Por favor, completa la configuración de todos los platos.');
      return;
    }

    // Add each plate to cart
    plates.forEach((plate, index) => {
      const product = {
        _id: plate.id,
        name: `Plato ${plate.numCarnes} Carne(s)`,
        basePrice: getPlatePrice(plate),
        image: '/carne.png', // Default image
        description: `Carnes: ${plate.carnes.map(c => c.name).join(', ')} | Guarnición: ${plate.guarnicion.name}`,
        isPlate: true,
        plateConfig: plate
      };
      addToCart(product);
    });

    toast.success('Platos añadidos al carrito');
    router.push('/cart');
  }

  if (loading) {
    return <div className="text-center mt-24">Cargando menú...</div>;
  }

  const mainCategoriesIds = categories.filter(c => c.type === 'main' || !c.type).map(c => c._id);
  const sideCategoriesIds = categories.filter(c => c.type === 'side').map(c => c._id);

  const carnes = menuItems.filter(i => mainCategoriesIds.includes(i.category));
  const guarniciones = menuItems.filter(i => sideCategoriesIds.includes(i.category));

  if (totalPlates === null) {
    return (
      <section className="mt-16 mb-24 max-w-2xl mx-auto text-center">
        <SectionHeaders mainHeader="Arma tu Pedido" subHeader="Paso 1" />
        <h3 className="text-2xl font-bold text-primary-950 mb-8">¿Cuántos platos deseas preparar?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <button
              key={num}
              onClick={() => handleTotalPlatesChange(num)}
              className="bg-white border-2 border-gray-100 hover:border-primary-400 p-8 rounded-2xl text-3xl font-black text-primary-600 transition-all hover:scale-105 hover:shadow-lg"
            >
              {num}
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 mb-24 max-w-7xl mx-auto">
      <SectionHeaders mainHeader="Configura tus Platos" subHeader="Paso 2" />
      
      <div className="grid md:grid-cols-[1fr_350px] gap-8 mt-12">
        {/* Left: Wizard */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-2 border-gray-50">
          
          {/* Plate Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
            {plates.map((plate, index) => (
              <button
                key={plate.id}
                onClick={() => setActivePlate(index)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all ${
                  activePlate === index 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                    : isPlateComplete(plate) 
                      ? 'bg-bambu-50 text-primary-700 border-2 border-primary-200'
                      : 'bg-gray-100 text-gray-500 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Plato {index + 1}
                {isPlateComplete(plate) && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary-950 mb-4">1. Elige el tamaño del plato</h4>
            <div className="flex gap-4">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumCarnesChange(num)}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${
                    plates[activePlate].numCarnes === num
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-primary-300'
                  }`}
                >
                  {num} {num === 1 ? 'Carne' : 'Carnes'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-bold text-primary-950 mb-4">
              2. Selecciona {plates[activePlate].numCarnes} carne(s)
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({plates[activePlate].carnes.length}/{plates[activePlate].numCarnes})
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {carnes.map(item => {
                const isSelected = plates[activePlate].carnes.some(c => c._id === item._id);
                return (
                  <div 
                    key={item._id}
                    onClick={() => handleMeatSelection(item)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all text-center ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                        : 'border-gray-100 hover:border-primary-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="h-20 relative mb-2">
                      <Image src={item.image || '/carne.png'} layout="fill" objectFit="contain" alt={item.name} />
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-primary-800' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-primary-950 mb-4">3. Elige 1 guarnición</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {guarniciones.map(item => {
                const isSelected = plates[activePlate].guarnicion?._id === item._id;
                return (
                  <div 
                    key={item._id}
                    onClick={() => handleSideSelection(item)}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all text-center ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                        : 'border-gray-100 hover:border-primary-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="h-20 relative mb-2">
                      <Image src={item.image || '/sallad1.png'} layout="fill" objectFit="contain" alt={item.name} />
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? 'text-primary-800' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Ticket Summary */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="bg-bambu-950 rounded-[2rem] p-6 text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-6 tracking-tight text-primary-100">Resumen del Pedido</h3>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-dark">
              {plates.map((plate, index) => (
                <div key={plate.id} className="border-b border-primary-800/50 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">
                      Plato {index + 1}
                      {!isPlateComplete(plate) && <span className="ml-2 text-[10px] uppercase font-bold bg-accent-fire/20 text-accent-fire px-2 py-0.5 rounded-full">Incompleto</span>}
                    </span>
                    <span className="font-medium text-primary-300">Bs {getPlatePrice(plate)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-300 space-y-1">
                    {plate.carnes.length > 0 ? (
                      <p><span className="text-primary-400">Carnes:</span> {plate.carnes.map(c => c.name).join(', ')}</p>
                    ) : (
                      <p className="text-gray-500 italic">Sin carnes seleccionadas</p>
                    )}
                    {plate.guarnicion ? (
                      <p><span className="text-primary-400">Guarnición:</span> {plate.guarnicion.name}</p>
                    ) : (
                      <p className="text-gray-500 italic">Sin guarnición seleccionada</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-primary-700">
              <div className="flex justify-between items-center text-xl font-bold mb-6">
                <span>Total Estimado</span>
                <span>Bs {plates.reduce((acc, p) => acc + getPlatePrice(p), 0)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={!allPlatesComplete()}
                className="w-full bg-primary-500 hover:bg-primary-400 disabled:bg-gray-600 disabled:text-gray-400 text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-primary-900/50 active:scale-95"
              >
                IR A PAGAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
