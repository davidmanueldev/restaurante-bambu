export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error) {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return Response.json({ error: 'Petición inválida' }, { status: 400 });
  }
  console.error('Error procesando la petición:', error.name);
  return Response.json({ error: 'No se pudo completar la operación' }, { status: 500 });
}
