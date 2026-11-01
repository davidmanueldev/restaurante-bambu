import fs from 'node:fs/promises';
import vm from 'node:vm';

export async function loadModule(path, mocks) {
  const root = new vm.SourceTextModule(await fs.readFile(new URL('../' + path, import.meta.url), 'utf8'));
  await root.link((specifier) => {
    if (!(specifier in mocks)) throw new Error('Falta mock para ' + specifier);
    const values = mocks[specifier];
    return new vm.SyntheticModule(Object.keys(values), function () {
      for (const [name, value] of Object.entries(values)) this.setExport(name, value);
    });
  });
  await root.evaluate();
  return root.namespace;
}
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const errors = {
  HttpError,
  errorResponse: error => Response.json({error: error.message}, {status: error.status || 500}),
};
export const objectIds = {isValidObjectId: value => typeof value === 'string' && /^[a-f0-9]{24}$/.test(value)};
