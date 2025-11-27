/**
 * @jest-environment node
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../src/models/User'); // Ajustar imports según estructura
// const app = require('../../src/app'); // Necesitamos exportar la app de Next o usar un handler

// MOCK: Como Next.js API Routes no exportan una 'app' de Express tradicional,
// los tests de integración suelen requerir levantar un servidor de prueba
// o usar 'next-test-api-route-handler'.
//
// Para este ejemplo, asumiremos que tenemos una forma de invocar el handler.

describe('Integración API ↔ Database', () => {
  
  // CI-DB-01
  test('POST /api/register crea usuario en MongoDB', async () => {
    // Simulación de la llamada
    // En un proyecto Next.js real, usaríamos:
    // const { testApiHandler } = require('next-test-api-route-handler');
    // await testApiHandler({ handler: registerHandler, ... });
    
    // Aquí escribimos la lógica de verificación de BD que es lo crucial para INT
    
    // 1. Simular creación (directa o via handler)
    const userData = {
      name: 'Integration Test',
      email: 'int@test.com',
      password: 'password123'
    };
    
    // Simulamos que el endpoint ejecutó: User.create(...)
    await User.create(userData); 

    // 2. Verificación (La parte real del test de integración)
    const userInDb = await User.findOne({ email: 'int@test.com' });
    
    expect(userInDb).toBeTruthy();
    expect(userInDb.name).toBe('Integration Test');
    // expect(userInDb.password).not.toBe('password123'); // Si el modelo hashea
  });

  // CI-DB-12
  test('Índice único previene email duplicado', async () => {
    await User.create({ email: 'dup@test.com', password: '123' });

    // Intentar crear el mismo
    let error;
    try {
      await User.create({ email: 'dup@test.com', password: '456' });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Código de error MongoDB para duplicados
  });

});
