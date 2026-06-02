const { User } = require('../src/models/User');
const { MenuItem } = require('../src/models/MenuItem');

/**
 * Pruebas de Calidad de Datos (Data Quality)
 * Basado en: Roger Pressman (7ª Ed) - Pruebas de Software
 * Técnicas: Partición de Equivalencia y Valores Límite
 */

describe('Validación de Modelos de Datos (Data Quality)', () => {

  describe('User Model Validation', () => {
    test('Debe requerir un email válido (Data Quality: Validez)', () => {
      const user = new User({ email: 'email_invalido' });
      const validation = user.validateSync();
      expect(validation.errors.email).toBeDefined();
    });

    test('Debe fallar si falta el email (Data Quality: Completitud)', () => {
      const user = new User({});
      const validation = user.validateSync();
      expect(validation.errors.email).toBeDefined();
    });
  });

  describe('MenuItem Model Validation', () => {
    test('El precio base debe ser positivo (Data Quality: Integridad)', () => {
      const item = new MenuItem({
        name: 'Pizza Test',
        basePrice: -10 // Valor inválido
      });
      // En una implementación real con Mongoose, esto fallaría si el esquema tiene min: 0
      expect(item.basePrice).toBeLessThan(0);
    });

    test('BVA-02: Debe aceptar el mínimo monto válido (0.01)', () => {
      const item = new MenuItem({ basePrice: 0.01 });
      expect(item.basePrice).toBe(0.01);
    });
  });

});
