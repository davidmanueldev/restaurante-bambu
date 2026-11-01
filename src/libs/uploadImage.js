import sharp from 'sharp';
import {HttpError} from '@/libs/httpError';

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export async function prepareImage(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new HttpError(400, 'Selecciona una imagen');
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new HttpError(400, 'La imagen debe pesar como máximo 3 MB');
  const formats = {'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif'};
  const format = formats[file.type];
  if (!format) throw new HttpError(400, 'Usa una imagen JPG, PNG, WebP o GIF');
  try {
    // Decode and encode the image to validate its content and discard metadata.
    const body = await sharp(Buffer.from(await file.arrayBuffer()), {limitInputPixels: 20000000})
      .rotate().toFormat(format).toBuffer();
    if (body.length > MAX_IMAGE_BYTES) throw new HttpError(400, 'La imagen debe pesar como máximo 3 MB');
    return {body, extension: format === 'jpeg' ? 'jpg' : format, contentType: file.type};
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'El archivo no es una imagen válida o supera el tamaño permitido');
  }
}
