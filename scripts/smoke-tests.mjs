#!/usr/bin/env node
// Smoke tests for Next.js app routes by direct handler invocation with mocks
// Run with: node --loader ./scripts/mock-loader.mjs ./scripts/smoke-tests.mjs

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

// Polyfill Response.json (Next-style)
if (!('json' in globalThis.Response)) {
  const NativeResponse = globalThis.Response;
  globalThis.Response = Object.assign(NativeResponse, {
    json: (data, init = {}) => new NativeResponse(JSON.stringify(data), {
      headers: { 'content-type': 'application/json', ...(init.headers||{}) },
      ...init,
    }),
  });
}

// Shim CommonJS require for 'stripe' used in checkout/webhook routes
if (!globalThis.require) {
  globalThis.require = (mod) => {
    if (mod === 'stripe') {
      return () => ({
        checkout: { sessions: { create: async () => ({ url: 'https://stripe.test/session' }) } },
        webhooks: { constructEvent: () => ({ type: 'checkout.session.completed', data: { object: { metadata: { orderId: 'o1' }, payment_status: 'paid' } } }) },
      });
    }
    throw new Error(`Unsupported require mock: ${mod}`);
  };
}

function makeJsonRequest(url, method, body) {
  return new Request(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function makeFormDataRequest(url, method) {
  // Minimal FormData-less request; route reads req.formData(); we won't call it here
  return new Request(url, { method });
}

async function runHandler(modPath, exportName, req) {
  const mod = await import(modPath);
  const handler = mod[exportName];
  if (typeof handler !== 'function') throw new Error(`Missing handler ${exportName} in ${modPath}`);
  const res = await handler(req);
  // Normalize to status code
  const status = res?.status || 200;
  return { status, ok: status >= 200 && status < 400, res };
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  const results = [];

  // API: Auth/Register
  results.push({ cat: 'Autenticación', name: 'POST /api/register', ...(await runHandler(path.join(root, 'src/app/api/register/route.js'), 'POST', makeJsonRequest('http://local/api/register', 'POST', { email: 'new@example.com', password: 'abcde' }))) });
  // API: Profile GET
  results.push({ cat: 'Autenticación', name: 'GET /api/profile', ...(await runHandler(path.join(root, 'src/app/api/profile/route.js'), 'GET', new Request('http://local/api/profile', { method: 'GET' }))) });

  // API: Categories
  results.push({ cat: 'Contenidos', name: 'GET /api/categories', ...(await runHandler(path.join(root, 'src/app/api/categories/route.js'), 'GET', new Request('http://local/api/categories', { method: 'GET' }))) });
  // API: Menu Items
  results.push({ cat: 'Contenidos', name: 'GET /api/menu-items', ...(await runHandler(path.join(root, 'src/app/api/menu-items/route.js'), 'GET', new Request('http://local/api/menu-items', { method: 'GET' }))) });

  // API: Users (admin)
  results.push({ cat: 'Usuarios', name: 'GET /api/users', ...(await runHandler(path.join(root, 'src/app/api/users/route.js'), 'GET', new Request('http://local/api/users', { method: 'GET' }))) });

  // API: Orders
  results.push({ cat: 'Dashboard', name: 'GET /api/orders', ...(await runHandler(path.join(root, 'src/app/api/orders/route.js'), 'GET', new Request('http://local/api/orders', { method: 'GET' }))) });

  // API: Checkout
  results.push({ cat: 'Carrito/Checkout', name: 'POST /api/checkout', ...(await runHandler(path.join(root, 'src/app/api/checkout/route.js'), 'POST', makeJsonRequest('http://local/api/checkout', 'POST', { cartProducts: [{ _id: 'm1', name: 'Pizza' }], address: {} }))) });

  // API: Webhook
  const webhookReq = new Request('http://local/api/webhook', { method: 'POST', headers: { 'stripe-signature': 'test' }, body: 'raw' });
  results.push({ cat: 'Carrito/Checkout', name: 'POST /api/webhook', ...(await runHandler(path.join(root, 'src/app/api/webhook/route.js'), 'POST', webhookReq)) });

  // Subidas: marcar como pendiente (requiere multipart/form-data). Se testea manualmente.
  results.push({ cat: 'Subidas', name: 'POST /api/upload', status: 102, ok: false, pending: true });

  // Pages presence (static check instead of HTTP)
  const pages = [
    { cat: 'Dashboard', file: 'src/app/page.js', name: 'Page /' },
    { cat: 'Dashboard', file: 'src/app/orders/page.js', name: 'Page /orders' },
    { cat: 'Dashboard', file: 'src/app/orders/[id]/page.js', name: 'Page /orders/[id]' },
    { cat: 'Contenidos', file: 'src/app/menu/page.js', name: 'Page /menu' },
    { cat: 'Contenidos', file: 'src/app/menu-items/page.js', name: 'Page /menu-items' },
    { cat: 'Contenidos', file: 'src/app/categories/page.js', name: 'Page /categories' },
    { cat: 'Usuarios', file: 'src/app/users/page.js', name: 'Page /users' },
    { cat: 'Usuarios', file: 'src/app/users/[id]/page.js', name: 'Page /users/[id]' },
    { cat: 'Autenticación', file: 'src/app/login/page.js', name: 'Page /login' },
    { cat: 'Autenticación', file: 'src/app/register/page.js', name: 'Page /register' },
    { cat: 'Carrito/Checkout', file: 'src/app/cart/page.js', name: 'Page /cart' },
    { cat: 'Autenticación', file: 'src/app/profile/page.js', name: 'Page /profile' },
  ];
  for (const p of pages) {
    const ok = await exists(path.join(root, p.file));
    results.push({ cat: p.cat, name: p.name, status: ok ? 299 : 404, ok });
  }

  // Seguridad heurística (estática): comprobar guardas isAdmin/getServerSession en APIs
  const securityChecks = [
    { cat: 'Seguridad', name: 'isAdmin en categories', file: 'src/app/api/categories/route.js', mustInclude: 'isAdmin' },
    { cat: 'Seguridad', name: 'isAdmin en menu-items', file: 'src/app/api/menu-items/route.js', mustInclude: 'isAdmin' },
    { cat: 'Seguridad', name: 'getServerSession en profile', file: 'src/app/api/profile/route.js', mustInclude: 'getServerSession' },
  ];
  for (const s of securityChecks) {
    const content = await fs.readFile(path.join(root, s.file), 'utf-8');
    const ok = content.includes(s.mustInclude);
    results.push({ cat: s.cat, name: s.name, status: ok ? 299 : 500, ok });
  }

  // Usabilidad (pendiente manual): dejar como pendientes
  const usability = [ 'Navegación', 'Claridad visual', 'Feedback', 'Consistencia' ];
  for (const u of usability) {
    results.push({ cat: 'Usabilidad', name: u, status: 102, ok: false, pending: true });
  }

  // Aggregate per category
  const categories = new Map();
  for (const r of results) {
    if (!categories.has(r.cat)) categories.set(r.cat, { total: 0, pass: 0, fail: 0, pending: 0 });
    const c = categories.get(r.cat);
    c.total += 1;
    if (r.pending) c.pending += 1; else if (r.ok) c.pass += 1; else c.fail += 1;
  }
  // Load and update markdown
  const mdPath = path.join(root, 'resumen_ejecución_pruebas.md');
  let md = await fs.readFile(mdPath, 'utf-8');

  const desiredCats = [
    'Autenticación', 'Dashboard', 'Contenidos', 'Usuarios', 'Carrito/Checkout', 'Subidas', 'Usabilidad', 'Seguridad'
  ];

  let total = 0, totalPass = 0, totalFail = 0, totalPend = 0;
  for (const cat of desiredCats) {
    const c = categories.get(cat) || { total: 0, pass: 0, fail: 0, pending: 0 };
    total += c.total; totalPass += c.pass; totalFail += c.fail; totalPend += c.pending;
    const pattern = `\\|\\s*${escapeRegex(cat)}\\s*\\|[\\s\\S]*?\\n`;
    const rowRe = new RegExp(pattern);
    const newRow = `| ${cat.padEnd(cat.length)} |  ${String(c.total).padStart(2)}  |   ${String(c.pass).padStart(3)}   |   ${String(c.fail).padStart(3)}    |    ${String(c.pending).padStart(3)}     |\n`;
    md = md.replace(rowRe, newRow);
  }

  // Update TOTAL row
  md = md.replace(/\| TOTAL\s*\|\s*\d+\s*\|[\s\S]*?\n/, `| TOTAL          |  ${String(total).padStart(2)}  |   ${String(totalPass).padStart(3)}   |   ${String(totalFail).padStart(3)}    |    ${String(totalPend).padStart(3)}     |\n`);

  // Update metric formula line
  md = md.replace(/Tasa de Éxito = \(___ \/ \d+\) × 100% = ___%/, `Tasa de Éxito = (${totalPass} / ${total}) × 100% = ${((totalPass/Math.max(total,1))*100).toFixed(0)}%`);

  await fs.writeFile(mdPath, md, 'utf-8');

  // Print a concise report to console
  console.log('Smoke results by category:');
  for (const cat of desiredCats) {
    const c = categories.get(cat) || { total: 0, pass: 0, fail: 0, pending: 0 };
    console.log(`${cat}: total=${c.total}, pass=${c.pass}, fail=${c.fail}, pend=${c.pending}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
