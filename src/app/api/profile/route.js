import {authOptions, isAdmin} from '@/libs/auth';
import {connectDB} from '@/libs/db';
import {errorResponse, HttpError} from '@/libs/httpError';
import {User} from '@/models/User';
import {UserInfo} from '@/models/UserInfo';
import {isValidObjectId} from 'mongoose';
import {getServerSession} from 'next-auth';

async function profileAccess(id) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new HttpError(401, 'Inicia sesión');
  if (id && (typeof id !== 'string' || !isValidObjectId(id))) throw new HttpError(400, 'Usuario inválido');
  await connectDB();
  const admin = await isAdmin();
  const user = await User.findOne(id ? {_id: id} : {email: session.user.email}).select('-password').lean();
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  if (!admin && user.email !== session.user.email) throw new HttpError(403, 'No autorizado');
  return {user, admin};
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const {user, admin} = await profileAccess(data?._id);
    const userFields = {};
    const infoFields = {};
    for (const key of ['name', 'image', 'phone', 'streetAddress', 'postalCode', 'city', 'country']) {
      if (data[key] === undefined) continue;
      if (typeof data[key] !== 'string' || data[key].length > 2048) throw new HttpError(400, 'Datos de perfil inválidos');
      (['name', 'image'].includes(key) ? userFields : infoFields)[key] = data[key];
    }
    // The regular form includes admin=false; non-admin requests cannot change permissions.
    if (admin && data.admin !== undefined) {
      if (typeof data.admin !== 'boolean') throw new HttpError(400, 'Permiso inválido');
      infoFields.admin = data.admin;
    }
    await User.updateOne({_id: user._id}, {$set: userFields});
    await UserInfo.updateOne({email: user.email}, {$set: infoFields}, {upsert: true});
    return Response.json(true);
  } catch (error) { return errorResponse(error); }
}

export async function GET(req) {
  try {
    const {user} = await profileAccess(new URL(req.url).searchParams.get('_id'));
    const info = await UserInfo.findOne({email: user.email}).lean();
    return Response.json({...user, ...info});
  } catch (error) { return errorResponse(error); }
}
