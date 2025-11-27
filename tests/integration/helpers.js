const mongoose = require('mongoose');
const { User } = require('../../src/models/User'); // Ajustar path según estructura real
const { UserInfo } = require('../../src/models/UserInfo');

/**
 * Crea un usuario de prueba en la BD
 */
async function createTestUser(email = 'test@example.com', isAdmin = false) {
  const user = await User.create({
    name: 'Test User',
    email,
    password: '$2b$10$EpIq...hashedpassword...', // Hash pre-calculado
    image: 'test.jpg',
    admin: isAdmin
  });
  return user;
}

/**
 * Simula una cookie de sesión autenticada (Mock)
 * Nota: En un entorno real con NextAuth, esto es complejo.
 * Para integración pura API, a veces es mejor mockear el middleware de sesión.
 */
function getMockSessionCookie(email) {
  // Retorna un objeto o string que tu middleware de test acepte
  // O si usas supertest con una app que tiene auth deshabilitado para tests
  return `next-auth.session-token=mock-token-${email}`;
}

module.exports = {
  createTestUser,
  getMockSessionCookie
};
