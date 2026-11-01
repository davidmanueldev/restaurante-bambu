import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {randomUUID} from 'node:crypto';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/libs/auth';
import {prepareImage, MAX_IMAGE_BYTES} from '@/libs/uploadImage';
import {errorResponse, HttpError} from '@/libs/httpError';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new HttpError(401, 'Inicia sesión');
    if (Number(req.headers.get('content-length')) > MAX_IMAGE_BYTES + 65536) {
      throw new HttpError(413, 'La imagen debe pesar como máximo 3 MB');
    }
    const data = await req.formData();
    const {body, extension, contentType} = await prepareImage(data.get('file'));
    const bucket = process.env.AWS_S3_BUCKET || 'restaurante-bambu';
    const name = randomUUID() + '.' + extension;
    const client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_KEY,
      },
    });
    await client.send(new PutObjectCommand({
      Bucket: bucket, Key: name, ACL: 'public-read', ContentType: contentType, Body: body,
    }));
    return Response.json('https://' + bucket + '.s3.amazonaws.com/' + name);
  } catch (error) { return errorResponse(error); }
}
