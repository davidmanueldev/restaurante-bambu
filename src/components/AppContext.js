'use client';
import {SessionProvider} from "next-auth/react";
import {createContext, useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  if (cartProduct.isPlate) {
    return cartProduct.basePrice || 0;
  }
  
  let price = cartProduct.basePrice || 0;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

export function AppProvider({children}) {
  const [cartProducts,setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts( JSON.parse( ls.getItem('cart') ) );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartProducts([]);
    window.localStorage.setItem('cart', '[]');
  }, []);

  function removeCartProduct(indexToRemove) {
    setCartProducts(prevCartProducts => {
      const newCartProducts = prevCartProducts
        .filter((v,index) => index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Se ha eliminado el producto del carrito');
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size=null, extras=[]) {
    setCartProducts(prevProducts => {
      const cartProduct = product.isPlate ? {...product} : {...product, size, extras};
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}