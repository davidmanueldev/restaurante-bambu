import { Order } from '../../../src/models/Order';

describe('Unit Tests - Order Model', () => {
  
  // CU-ORDER-01
  test('Paid es false por defecto', () => {
    const orderData = {
      userEmail: 'user@test.com',
      cartProducts: {items: []}
      // paid omitido
    };
    
    const order = new Order(orderData);
    
    expect(order.paid).toBe(false);
  });

  // CU-ORDER-02
  test('CartProducts acepta tipo Object', () => {
    const orderData = {
      userEmail: 'test@test.com',
      cartProducts: {
        items: [
          {name: 'Pizza', price: 50}
        ]
      }
    };
    
    const order = new Order(orderData);
    const validationError = order.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(order.cartProducts).toBeDefined();
    expect(order.cartProducts.items).toHaveLength(1);
  });

  test('Todos los campos de dirección se almacenan', () => {
    const orderData = {
      userEmail: 'user@test.com',
      phone: '+591 77788899',
      streetAddress: 'Calle Test 123',
      postalCode: '0000',
      city: 'Santa Cruz',
      country: 'Bolivia',
      cartProducts: {}
    };
    
    const order = new Order(orderData);
    
    expect(order.phone).toBe('+591 77788899');
    expect(order.city).toBe('Santa Cruz');
    expect(order.country).toBe('Bolivia');
  });

});
