// ESM Loader to mock external deps and project aliases for smoke tests
// Usage: node --loader ./scripts/mock-loader.mjs ./scripts/smoke-tests.mjs

import {fileURLToPath, pathToFileURL} from 'url';
import path from 'path';

const root = path.dirname(fileURLToPath(new URL('..', import.meta.url)));

const aliasMap = new Map([
  ['@/models/User', path.join(root, 'src/models/User.js')],
  ['@/models/UserInfo', path.join(root, 'src/models/UserInfo.js')],
  ['@/models/Category', path.join(root, 'src/models/Category.js')],
  ['@/models/MenuItem', path.join(root, 'src/models/MenuItem.js')],
  ['@/models/Order', path.join(root, 'src/models/Order.js')],
  ['@/app/api/auth/[...nextauth]/route', 'virtual:nextauth-route'],
]);

// In-memory stores
const store = {
  users: [{ _id: 'u1', email: 'test@example.com', name: 'Tester', image: ''}],
  userInfos: [{ email: 'test@example.com', phone: '77777777'}],
  categories: [{ _id: 'c1', name: 'Comidas'}],
  menuItems: [{ _id: 'm1', name: 'Pizza', basePrice: 30, sizes: [], extraIngredientPrices: []}],
  orders: [{ _id: 'o1', userEmail: 'test@example.com', paid: false, cartProducts: [] }],
};

// Helper: identity (Node loader expects a string in `source`)
function createModule(source) {
  return source;
}

export async function resolve(specifier, context, defaultResolve) {
  if (aliasMap.has(specifier)) {
    const target = aliasMap.get(specifier);
    if (target.startsWith('virtual:')) {
      return { url: target, shortCircuit: true };
    }
    return { url: pathToFileURL(target).href, shortCircuit: true };
  }
  if (specifier === 'mongoose') {
    return { url: 'virtual:mongoose', shortCircuit: true };
  }
  if (specifier === 'next-auth') {
    return { url: 'virtual:next-auth', shortCircuit: true };
  }
  if (specifier === '@aws-sdk/client-s3') {
    return { url: 'virtual:aws-s3', shortCircuit: true };
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
    const src = `
      export default {};
      export const connection = {};
      export function connect() { return Promise.resolve(); }
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url === 'virtual:next-auth') {
    const src = `
      export function getServerSession() { return Promise.resolve({ user: { email: 'test@example.com' } }); }
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url === 'virtual:aws-s3') {
    const src = `
      export class S3Client { constructor(){ } async send(){ return; } }
      export class PutObjectCommand { constructor(){ } }
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url === 'virtual:nextauth-route') {
    const src = `
      export async function isAdmin(){ return true; }
      export const authOptions = {};
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  // Mock models by overriding mongoose methods used
  if (url.endsWith('/src/models/User.js')) {
    const src = `
      export const User = {
        async create(doc){ return { _id: 'u2', ...doc }; },
        async findOne(filter){ return { _id: 'u1', ...(JSON.parse('${JSON.stringify(JSON.stringify(store))}')).users[0] }; },
        async updateOne(filter, data){ return true; },
        async find(){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).users; }
      };
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url.endsWith('/src/models/UserInfo.js')) {
    const src = `
      export const UserInfo = {
        async findOne(filter){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).userInfos[0]; },
        async findOneAndUpdate(filter, doc){ return true; }
      };
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url.endsWith('/src/models/Category.js')) {
    const src = `
      export const Category = {
        async create(doc){ return { _id: 'c2', ...doc }; },
        async updateOne(filter, data){ return true; },
        async find(){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).categories; },
        async deleteOne(filter){ return true; }
      };
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url.endsWith('/src/models/MenuItem.js')) {
    const src = `
      export const MenuItem = {
        async create(doc){ return { _id: 'm2', ...doc }; },
        async find(){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).menuItems; },
        async findByIdAndUpdate(id, data){ return true; },
        async deleteOne(filter){ return true; },
        async findById(id){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).menuItems[0]; }
      };
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (url.endsWith('/src/models/Order.js')) {
    const src = `
      export const Order = {
        async create(doc){ return { _id: 'o2', ...doc }; },
        async find(){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).orders; },
        async findById(id){ return (JSON.parse('${JSON.stringify(JSON.stringify(store))}')).orders[0]; },
        async updateOne(filter, data){ return true; }
      };
    `;
    return { format: 'module', source: src, shortCircuit: true };
  }
  return defaultLoad(url, context, defaultLoad);
}
