'use client';
import {CartContext, cartProductPrice} from "@/components/AppContext";
import Trash from "@/components/icons/Trash";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import {useProfile} from "@/components/UseProfile";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {cartProducts, removeCartProduct} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const {data:profileData} = useProfile();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('total'); // 'total', 'advance', 'cash'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.href.includes('canceled=1')) {
        toast.error('El pago falló 😔');
      }
    }
    
    // Generate time slots (every 15 mins)
    const slots = [];
    let d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15 + 30); // At least 30 mins from now
    const end = new Date();
    end.setHours(22, 0, 0, 0); // Close at 22:00
    
    // If it's before opening, set to opening time
    if (d.getHours() < 11) {
      d.setHours(11, 30, 0, 0);
    }

    while (d <= end) {
      slots.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      d.setMinutes(d.getMinutes() + 15);
    }
    setTimeSlots(slots.length > 0 ? slots : ['Cerrado por hoy']);
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const {phone, streetAddress, city, postalCode, country} = profileData;
      setAddress({phone, streetAddress, city, postalCode, country});
    }
  }, [profileData]);

  let subtotal = 0;
  for (const p of cartProducts) {
    subtotal += cartProductPrice(p);
  }
  
  const isLargeOrder = cartProducts.length >= 3;
  const advanceAmount = Math.round(subtotal * 0.3);
  const amountToPay = paymentMethod === 'advance' ? advanceAmount : subtotal;

  // Auto-switch payment method if logic dictates
  useEffect(() => {
    if (isLargeOrder && paymentMethod === 'cash') {
      setPaymentMethod('advance');
    }
  }, [isLargeOrder, paymentMethod]);

  function handleAddressChange(propName, value) {
    setAddress(prevAddress => ({...prevAddress, [propName]:value}));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (!selectedTime || selectedTime === 'Cerrado por hoy') {
      toast.error('Por favor, selecciona un horario de entrega/recogida válido.');
      return;
    }

    if (paymentMethod === 'cash') {
      const promise = new Promise((resolve, reject) => {
        fetch('/api/orders/checkout', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            address,
            cartProducts,
            selectedTime,
            paymentMethod,
            isLargeOrder
          }),
        }).then(async (response) => {
          if (response.ok) {
            const order = await response.json();
            resolve();
            window.location = `/orders/${order._id}?clear-cart=1`;
          } else {
            reject();
          }
        });
      });

      await toast.promise(promise, {
        loading: 'Registrando tu pedido...',
        success: '¡Pedido confirmado!',
        error: 'Error al registrar pedido.',
      });
      return;
    }

    const promise = new Promise((resolve, reject) => {
      fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          address,
          cartProducts,
          selectedTime,
          paymentMethod,
          isLargeOrder
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: 'Preparando tu pedido...',
      success: 'Redirigiendo al pago...',
      error: 'Algo salió mal... Por favor, intenta de nuevo.',
    });
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-16 mb-24 text-center">
        <SectionHeaders mainHeader="Carrito de Compras" subHeader="Tu Pedido" />
        <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto mt-8 border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-lg mb-6">Tu carrito está vacío 😔</p>
          <a href="/menu" className="inline-block bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 py-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary-200">
            Explorar Menú
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 mb-24 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <SectionHeaders mainHeader="Revisa tu Pedido" subHeader="Checkout" />
      </div>
      
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
        {/* Left Column: Cart Items */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50 space-y-6">
          <h2 className="text-2xl font-black text-primary-950 mb-6">Platos Seleccionados</h2>
          {cartProducts.map((product, index) => (
            <div key={index} className="flex gap-4 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 shrink-0 border border-gray-100">
                <Image width={100} height={100} src={product.image} alt={product.name} className="w-full h-full object-contain"/>
              </div>
              <div className="grow">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                )}
                {product.size && (
                  <div className="text-sm text-primary-600 font-medium mt-1">
                    Tamaño: {product.size.name}
                  </div>
                )}
                {product.extras?.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {product.extras.map(e => <span key={e._id} className="mr-2 px-2 py-0.5 bg-gray-100 rounded-md text-xs">{e.name}</span>)}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-xl text-primary-700 mb-2">Bs {cartProductPrice(product)}</div>
                <button
                  type="button"
                  onClick={() => removeCartProduct(index)}
                  className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="pt-6 border-t-2 border-gray-50 flex justify-between items-center bg-gray-50 rounded-2xl p-6">
            <div className="text-gray-500 font-medium space-y-1">
              <p>Subtotal de productos:</p>
              <p>Costo de preparación/envío:</p>
            </div>
            <div className="font-bold text-right text-gray-800 space-y-1">
              <p>Bs {subtotal}</p>
              <p>Bs 5</p>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="bg-bambu-950 p-8 rounded-[2.5rem] shadow-2xl text-white">
          <h2 className="text-2xl font-black mb-8 text-primary-100">Detalles de Entrega</h2>
          
          <form onSubmit={proceedToCheckout} className="space-y-6">
            
            {/* Time Slot Selector */}
            <div className="bg-bambu-900/50 p-4 rounded-2xl border border-primary-800/50">
              <label className="text-primary-300 font-semibold mb-2 block ml-1 text-sm uppercase tracking-wider">Horario de Recogida</label>
              <select 
                value={selectedTime} 
                onChange={ev => setSelectedTime(ev.target.value)}
                className="w-full bg-white text-gray-800 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                required
              >
                <option value="" disabled>Selecciona una hora</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="bg-bambu-900/50 p-4 rounded-2xl border border-primary-800/50">
              <label className="text-primary-300 font-semibold mb-3 block ml-1 text-sm uppercase tracking-wider">Información de Contacto</label>
              <AddressInputs
                addressProps={address}
                setAddressProp={handleAddressChange}
              />
            </div>

            {/* Payment Method Logic */}
            <div className="bg-bambu-900/50 p-5 rounded-2xl border border-primary-800/50">
              <label className="text-primary-300 font-semibold mb-4 block ml-1 text-sm uppercase tracking-wider">Método de Pago</label>
              
              {isLargeOrder && (
                <div className="mb-4 bg-accent-fire/20 border border-accent-fire/50 text-orange-200 p-3 rounded-xl text-sm font-medium">
                  ⚠️ Por ser un pedido grande ({cartProducts.length} platos), requerimos un pago o adelanto con tarjeta.
                </div>
              )}

              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'total' ? 'border-primary-400 bg-primary-900/30' : 'border-transparent hover:bg-bambu-800/50'}`}>
                  <input type="radio" name="payment" value="total" checked={paymentMethod === 'total'} onChange={() => setPaymentMethod('total')} className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold">Pago Total con Tarjeta</span>
                </label>
                
                {isLargeOrder && (
                  <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'advance' ? 'border-primary-400 bg-primary-900/30' : 'border-transparent hover:bg-bambu-800/50'}`}>
                    <input type="radio" name="payment" value="advance" checked={paymentMethod === 'advance'} onChange={() => setPaymentMethod('advance')} className="w-4 h-4 text-primary-500" />
                    <span className="font-semibold">Adelanto 30% (Paga el resto al recoger)</span>
                  </label>
                )}

                {!isLargeOrder && (
                  <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-primary-400 bg-primary-900/30' : 'border-transparent hover:bg-bambu-800/50'}`}>
                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4 text-primary-500" />
                    <span className="font-semibold">Efectivo al Recoger</span>
                  </label>
                )}
              </div>
            </div>
            
            <div className="pt-6 border-t border-primary-800/50">
              <div className="flex justify-between items-end mb-6">
                <span className="text-lg text-primary-200 font-medium">Monto a Pagar Ahora</span>
                <span className="text-4xl font-black text-white">Bs {amountToPay + (paymentMethod !== 'cash' ? 5 : 0)}</span>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary-500 hover:bg-primary-400 text-white font-black text-lg py-5 rounded-full shadow-xl shadow-primary-900/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                CONFIRMAR PEDIDO
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}