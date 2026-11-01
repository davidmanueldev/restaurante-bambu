import {connectDB} from '@/libs/db';
import {HttpError} from '@/libs/httpError';
import {priceCart, CartValidationError} from '@/libs/cartPricing.mjs';
import {MenuItem} from '@/models/MenuItem';
import {Category} from '@/models/Category';

export async function prepareCheckout(data, userEmail, cashOnly = false) {
  const {cartProducts, paymentMethod, selectedTime} = data || {};
  if (!(cashOnly ? ['cash'] : ['total', 'advance']).includes(paymentMethod)) throw new HttpError(400, 'Método de pago inválido');
  if (typeof selectedTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(selectedTime)) throw new HttpError(400, 'Selecciona un horario válido');
  if (!Array.isArray(cartProducts) || !cartProducts.length || cartProducts.length > 100) throw new HttpError(400, 'Carrito inválido');
  const largeOrder = cartProducts.length >= 3;
  if ((paymentMethod === 'advance' && !largeOrder) || (cashOnly && largeOrder)) {
    throw new HttpError(400, 'El adelanto es obligatorio para pedidos de 3 o más platos pagados al recoger');
  }
  const address = {};
  for (const key of ['phone', 'streetAddress', 'postalCode', 'city', 'country']) {
    const value = data.address?.[key];
    if (value !== undefined && (typeof value !== 'string' || value.length > 500)) throw new HttpError(400, 'Dirección inválida');
    if (value !== undefined) address[key] = value;
  }
  await connectDB();
  const [menu, categories] = await Promise.all([MenuItem.find().lean(), Category.find().lean()]);
  let priced;
  try { priced = priceCart(cartProducts, menu, categories); }
  catch (error) {
    if (error instanceof CartValidationError) throw new HttpError(400, error.message);
    throw error;
  }
  return {...priced, orderData: {userEmail, ...address, selectedTime, paymentMethod, cartProducts: priced.products, paid: false}};
}
