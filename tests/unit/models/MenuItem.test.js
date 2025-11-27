import mongoose from 'mongoose';
import { MenuItem } from '../../../src/models/MenuItem';

describe('Unit Tests - MenuItem Model', () => {
  
  // CU-MENU-01
  test('Sizes acepta array de objetos con estructura correcta', () => {
    const menuData = {
      name: 'Pizza Margherita',
      basePrice: 50,
      sizes: [
        {name: 'Normal', price: 0},
        {name: 'Grande', price: 20}
      ]
    };
    
    const menuItem = new MenuItem(menuData);
    const validationError = menuItem.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(menuItem.sizes).toHaveLength(2);
    expect(menuItem.sizes[0].name).toBe('Normal');
  });

  // CU-MENU-03
  test('Category acepta ObjectId de Mongoose', () => {
    const categoryId = new mongoose.Types.ObjectId();
    
    const menuData = {
      name: 'Hamburguesa',
      category: categoryId
    };
    
    const menuItem = new MenuItem(menuData);
    
    expect(menuItem.category).toEqual(categoryId);
  });

  test('ExtraIngredientPrices acepta array', () => {
    const menuData = {
      name: 'Hamburguesa',
      extraIngredientPrices: [
        {name: 'Queso Extra', price: 5},
        {name: 'Bacon', price: 10}
      ]
    };
    
    const menuItem = new MenuItem(menuData);
    const validationError = menuItem.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(menuItem.extraIngredientPrices).toHaveLength(2);
  });

});
