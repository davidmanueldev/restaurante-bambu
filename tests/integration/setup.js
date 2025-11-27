const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Configuración Global para Tests de Integración

beforeAll(async () => {
  // 1. Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // 2. Conectar Mongoose a la instancia en memoria
  await mongoose.connect(mongoUri);

  // 3. Mockear variables de entorno si es necesario
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
});

afterAll(async () => {
  // 1. Desconectar Mongoose
  await mongoose.disconnect();
  
  // 2. Detener servidor MongoDB
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Limpiar base de datos entre tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
