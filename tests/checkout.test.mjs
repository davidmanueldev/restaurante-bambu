import test from 'node:test';
import assert from 'node:assert/strict';
import {loadModule, errors} from './helpers.mjs';
import {priceCart, CartValidationError} from '../src/libs/cartPricing.mjs';

const menu = [{_id: 'meat', name: 'Carne', basePrice: 20, category: 'main'}];
const categories = [{_id: 'main', type: 'main'}];
async function checkout() {
  return loadModule('src/libs/checkout.js', {
    '@/libs/db': {connectDB: async () => {}},
    '@/libs/httpError': errors,
    '@/libs/cartPricing.mjs': {priceCart, CartValidationError},
    '@/models/MenuItem': {MenuItem: {find: () => ({lean: async () => menu})}},
    '@/models/Category': {Category: {find: () => ({lean: async () => categories})}},
  });
}
test('checkout ignora isLargeOrder y campos protegidos de dirección', async () => {
  const module = await checkout();
  const result = await module.prepareCheckout({
    cartProducts: [{_id: 'meat', basePrice: 1}], paymentMethod: 'cash', selectedTime: '12:30',
    isLargeOrder: true, address: {phone: '123', userEmail: 'intruso@test', paid: true, advanceAmount: 0},
  }, 'customer@test', true);
  assert.equal(result.total, 2000);
  assert.equal(result.orderData.userEmail, 'customer@test');
  assert.equal(result.orderData.paid, false);
  assert.equal(result.orderData.advanceAmount, undefined);
});
test('checkout no permite saltarse el adelanto obligatorio ni solicitar adelanto para pedido pequeño', async () => {
  const module = await checkout();
  await assert.rejects(() => module.prepareCheckout({
    cartProducts: [{_id: 'meat'}, {_id: 'meat'}, {_id: 'meat'}], paymentMethod: 'cash', selectedTime: '12:30', isLargeOrder: false,
  }, 'customer@test', true), error => error.status === 400);
  await assert.rejects(() => module.prepareCheckout({
    cartProducts: [{_id: 'meat'}], paymentMethod: 'advance', selectedTime: '12:30', isLargeOrder: true,
  }, 'customer@test'), error => error.status === 400);
});
test('checkout rechaza horarios inválidos y métodos de pago ajenos al endpoint', async () => {
  const module = await checkout();
  for (const data of [
    {selectedTime: 'Cerrado por hoy', paymentMethod: 'total'},
    {selectedTime: '99:99', paymentMethod: 'total'},
    {selectedTime: '12:30', paymentMethod: 'cash'},
  ]) await assert.rejects(() => module.prepareCheckout({...data, cartProducts: [{_id: 'meat'}]}, 'customer@test'), error => error.status === 400);
});
