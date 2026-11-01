import test from 'node:test';
import assert from 'node:assert/strict';
import {priceCart} from '../src/libs/cartPricing.mjs';

const categories = [{_id: 'main', type: 'main'}, {_id: 'side', type: 'side'}];
const menu = [
  {_id: 'meat', name: 'Carne', category: 'main', basePrice: 20.25, sizes: [{_id: 'big', name: 'Grande', price: 5}], extraIngredientPrices: [{_id: 'extra', name: 'Extra', price: 2.5}]},
  {_id: 'side', name: 'Arroz', category: 'side', basePrice: 5},
];
const plate = {isPlate: true, basePrice: 0.01, name: 'Precio falso', plateConfig: {numCarnes: 1, carnes: [{_id: 'meat', basePrice: 0}], guarnicion: {_id: 'side', basePrice: 0}}};

test('recalcula platos e ignora precios y nombres enviados por el cliente', () => {
  const result = priceCart([plate], menu, categories);
  assert.equal(result.total, 2525);
  assert.equal(result.products[0].basePrice, 25.25);
  assert.equal(result.products[0].plateConfig.carnes[0].basePrice, 20.25);
  assert.equal(result.products[0].name, 'Plato 1 Carne(s)');
});
test('recalcula tamaños y extras usando el menú', () => {
  const result = priceCart([{_id: 'meat', basePrice: 0, size: {_id: 'big', price: -1}, extras: [{_id: 'extra', price: -1}]}], menu, categories);
  assert.equal(result.total, 2775);
  assert.equal(result.products[0].extras[0].price, 2.5);
});
test('rechaza carritos vacíos, productos eliminados, extras falsos y duplicados', () => {
  for (const cart of [[], [{_id: 'missing'}], [{_id: 'meat', extras: [{_id: 'fake'}]}], [{_id: 'meat', extras: [{_id: 'extra'}, {_id: 'extra'}]}]]) {
    assert.throws(() => priceCart(cart, menu, categories));
  }
});
test('rechaza carnes duplicadas, platos incompletos y categorías manipuladas', () => {
  for (const config of [
    {...plate.plateConfig, numCarnes: 2, carnes: [{_id: 'meat'}, {_id: 'meat'}]},
    {...plate.plateConfig, numCarnes: 2},
    {...plate.plateConfig, carnes: [{_id: 'side'}]},
    {...plate.plateConfig, guarnicion: {_id: 'meat'}},
  ]) assert.throws(() => priceCart([{...plate, plateConfig: config}], menu, categories));
});
test('mantiene importes en centavos y cada unidad del carrito', () => {
  const result = priceCart([{_id: 'meat'}, {_id: 'meat'}], menu, categories);
  assert.equal(result.total, 4050);
  assert.equal(result.products.length, 2);
});
