import test from 'node:test';
import assert from 'node:assert/strict';
import {loadModule, errors, objectIds} from './helpers.mjs';
import sharp from 'sharp';

test('valida contenido de imágenes y rechaza SVG, archivos falsos y tamaño excesivo', async () => {
  const module = await loadModule('src/libs/uploadImage.js', {sharp: {default: sharp}, '@/libs/httpError': errors});
  for (const file of [
    new File(['<svg/>'], 'image.svg', {type: 'image/svg+xml'}),
    new File(['not a png'], 'fake.png', {type: 'image/png'}),
    new File([Buffer.alloc(module.MAX_IMAGE_BYTES + 1)], 'big.png', {type: 'image/png'}),
  ]) await assert.rejects(() => module.prepareImage(file), error => error.status === 400);
  const png = await sharp({create: {width: 2, height: 2, channels: 3, background: '#ffffff'}}).png().toBuffer();
  const result = await module.prepareImage(new File([png], 'real.png', {type: 'image/png'}));
  assert.equal(result.extension, 'png');
  assert.equal((await sharp(result.body).metadata()).width, 2);
});

test('webhook verifica firma, conecta a MongoDB y exige sesión e importe del pedido; admite reintentos', async () => {
  const original = {key: process.env.STRIPE_SK, secret: process.env.STRIPE_SIGN_SECRET};
  process.env.STRIPE_SK = 'sk_test_mock';
  process.env.STRIPE_SIGN_SECRET = 'whsec_mock';
  try {
    let connected = false;
    let updated = 0;
    let invalidSignature = false;
    let amount = 3000;
    const id = '111111111111111111111111';
    const module = await loadModule('src/app/api/webhook/route.js', {
      '@/libs/db': {connectDB: async () => {connected = true;}},
      '@/libs/httpError': errors,
      '@/models/Order': {Order: {
        findOne: async query => {assert.equal(connected, true); assert.equal(query.stripeSessionId, 'cs_mock'); return {_id: id, expectedPaymentAmount: 3000};},
        updateOne: async (query, update) => {assert.equal(query.paid, false); assert.equal(update.$set.paid, true); updated++;},
      }},
      mongoose: objectIds,
      stripe: {default: class {webhooks = {constructEvent() {
        if (invalidSignature) throw Error('invalid');
        return {type: 'checkout.session.completed', data: {object: {id: 'cs_mock', currency: 'bob', amount_total: amount, payment_status: 'paid', metadata: {orderId: id}}}};
      }};}},
    });
    const request = () => new Request('http://local/api/webhook', {method: 'POST', body: '{}'});
    invalidSignature = true;
    assert.equal((await module.POST(request())).status, 400);
    assert.equal(connected, false);
    invalidSignature = false;
    amount = 1;
    assert.equal((await module.POST(request())).status, 400);
    assert.equal(updated, 0);
    amount = 3000;
    assert.equal((await module.POST(request())).status, 200);
    assert.equal((await module.POST(request())).status, 200);
    assert.equal(updated, 2);
  } finally {
    for (const [key, value] of [['STRIPE_SK', original.key], ['STRIPE_SIGN_SECRET', original.secret]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('checkout crea redirecciones correctas sin barra final y cobra los precios del servidor', async () => {
  const previous = {url: process.env.NEXTAUTH_URL, key: process.env.STRIPE_SK};
  process.env.NEXTAUTH_URL = 'https://example.vercel.app';
  process.env.STRIPE_SK = 'sk_test_mock';
  let options;
  let saved;
  try {
    const module = await loadModule('src/app/api/checkout/route.js', {
      '@/libs/auth': {authOptions: {}},
      '@/libs/checkout': {prepareCheckout: async () => ({
        total: 2525, lines: [{name: 'Producto real', amount: 2525}],
        orderData: {userEmail: 'customer@example.test', paymentMethod: 'total'},
      })},
      '@/libs/httpError': errors,
      '@/models/Order': {Order: class {constructor(data) {Object.assign(this, data); this._id = 'order1';} async save() {saved = this;}}},
      'next-auth': {getServerSession: async () => ({user: {email: 'customer@example.test'}})},
      stripe: {default: class {checkout = {sessions: {
        create: async data => {options = data; return {id: 'cs_mock', url: 'https://checkout.stripe.com/mock'};},
        expire: async () => {},
      }};}},
    });
    const response = await module.POST(new Request('http://local/api/checkout', {method: 'POST', body: JSON.stringify({paymentMethod: 'total'})}));
    assert.equal(response.status, 200);
    assert.equal(options.success_url, 'https://example.vercel.app/orders/order1?clear-cart=1');
    assert.equal(options.cancel_url, 'https://example.vercel.app/cart?canceled=1');
    assert.equal(options.line_items[0].price_data.unit_amount, 2525);
    assert.equal(saved.expectedPaymentAmount, 3025);
    assert.equal(saved.stripeSessionId, 'cs_mock');
  } finally {
    for (const [key, value] of [['NEXTAUTH_URL', previous.url], ['STRIPE_SK', previous.key]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
