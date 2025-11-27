import { User } from '../../../src/models/User';

describe('Unit Tests - User Model', () => {
  
  // CU-USER-01
  test('Email es campo requerido', () => {
    const userData = {
      name: 'Test User',
      password: 'hash123'
      // email omitido
    };
    
    const user = new User(userData);
    const validationError = user.validateSync();
    
    expect(validationError).toBeDefined();
    expect(validationError.errors.email).toBeDefined();
    expect(validationError.errors.email.message).toMatch(/required/i);
  });

  // CU-USER-03
  test('Timestamps se generan automáticamente', () => {
    const userData = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'hash123'
    };
    
    const user = new User(userData);
    
    // Los timestamps se generan al guardar, pero el schema los define
    expect(user.schema.path('createdAt')).toBeDefined();
    expect(user.schema.path('updatedAt')).toBeDefined();
  });

  test('Email acepta valor válido', () => {
    const userData = {
      name: 'Test User',
      email: 'valid@example.com',
      password: 'hash123'
    };
    
    const user = new User(userData);
    const validationError = user.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(user.email).toBe('valid@example.com');
  });

});
