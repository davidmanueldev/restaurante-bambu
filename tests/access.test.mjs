import test from 'node:test';
import assert from 'node:assert/strict';
import {loadModule, errors, objectIds} from './helpers.mjs';

const ownId = '111111111111111111111111';
const otherId = '222222222222222222222222';
const own = {_id: ownId, email: 'customer@example.test', name: 'Cliente'};
const other = {_id: otherId, email: 'other@example.test', name: 'Otro'};

async function profile({session = {user: {email: own.email}}, admin = false} = {}) {
  const writes = [];
  const module = await loadModule('src/app/api/profile/route.js', {
    '@/libs/auth': {authOptions: {}, isAdmin: async () => admin},
    '@/libs/db': {connectDB: async () => {}},
    '@/libs/httpError': errors,
    '@/models/User': {User: {
      findOne: query => ({select: fields => {
        assert.equal(fields, '-password');
        return {lean: async () => query._id === otherId ? other : own};
      }}),
      updateOne: async (filter, update) => writes.push({model: 'user', filter, update}),
    }},
    '@/models/UserInfo': {UserInfo: {
      findOne: () => ({lean: async () => ({admin: false})}),
      updateOne: async (filter, update) => writes.push({model: 'info', filter, update}),
    }},
    mongoose: objectIds,
    'next-auth': {getServerSession: async () => session},
  });
  return {module, writes};
}

test('perfil requiere sesión para lectura y escritura', async () => {
  const {module, writes} = await profile({session: null});
  assert.equal((await module.GET(new Request('http://local/api/profile'))).status, 401);
  assert.equal((await module.PUT(new Request('http://local/api/profile', {method: 'PUT', body: JSON.stringify({name: 'x'})}))).status, 401);
  assert.equal(writes.length, 0);
});
test('cliente no puede leer ni modificar el perfil ajeno', async () => {
  const {module, writes} = await profile();
  assert.equal((await module.GET(new Request('http://local/api/profile?_id=' + otherId))).status, 403);
  assert.equal((await module.PUT(new Request('http://local/api/profile', {method: 'PUT', body: JSON.stringify({_id: otherId, name: 'Intruso'})}))).status, 403);
  assert.equal(writes.length, 0);
});
test('cliente puede guardar su perfil pero no permisos, puntos ni email', async () => {
  const {module, writes} = await profile();
  const response = await module.PUT(new Request('http://local/api/profile', {method: 'PUT', body: JSON.stringify({name: 'Nuevo', admin: true, points: 100000, email: 'other@example.test'})}));
  assert.equal(response.status, 200);
  assert.equal(writes[0].update.$set.name, 'Nuevo');
  assert.equal(writes[1].filter.email, own.email);
  assert.equal(writes[1].update.$set.admin, undefined);
  assert.equal(writes[1].update.$set.points, undefined);
  assert.equal(writes[1].update.$set.email, undefined);
});
test('administrador puede gestionar permisos de otro usuario', async () => {
  const {module, writes} = await profile({admin: true});
  assert.equal((await module.PUT(new Request('http://local/api/profile', {method: 'PUT', body: JSON.stringify({_id: otherId, name: 'Otro', admin: true})}))).status, 200);
  assert.equal(writes[1].filter.email, other.email);
  assert.equal(writes[1].update.$set.admin, true);
});

test('pedidos filtra por propietario incluso al consultar por ID', async () => {
  let session = {user: {email: own.email}};
  let admin = false;
  const seen = [];
  const module = await loadModule('src/app/api/orders/route.js', {
    '@/libs/auth': {authOptions: {}, isAdmin: async () => admin},
    '@/libs/db': {connectDB: async () => {}},
    '@/libs/httpError': errors,
    '@/models/Order': {Order: {findOne: async filter => {seen.push(filter); return null;}, find: async filter => {seen.push(filter); return [];}}},
    mongoose: objectIds,
    'next-auth': {getServerSession: async () => session},
  });
  assert.equal((await module.GET(new Request('http://local/api/orders?_id=' + otherId))).status, 404);
  assert.deepEqual(seen[0], {_id: otherId, userEmail: own.email});
  assert.equal((await module.GET(new Request('http://local/api/orders'))).status, 200);
  assert.deepEqual(seen[1], {userEmail: own.email});
  admin = true;
  await module.GET(new Request('http://local/api/orders'));
  assert.deepEqual(seen[2], {});
  session = null;
  assert.equal((await module.GET(new Request('http://local/api/orders'))).status, 401);
  assert.equal(seen.length, 3);
});

test('upload rechaza peticiones anónimas antes de leer archivo o acceder a AWS', async () => {
  const module = await loadModule('src/app/api/upload/route.js', {
    '@aws-sdk/client-s3': {PutObjectCommand: class {}, S3Client: class {constructor() {throw Error('No debería acceder a AWS');}}},
    'node:crypto': {randomUUID: () => 'test'},
    'next-auth': {getServerSession: async () => null},
    '@/libs/auth': {authOptions: {}},
    '@/libs/uploadImage': {prepareImage: () => {throw Error('No debería leer imagen');}, MAX_IMAGE_BYTES: 3 * 1024 * 1024},
    '@/libs/httpError': errors,
  });
  assert.equal((await module.POST(new Request('http://local/api/upload', {method: 'POST'}))).status, 401);
});
