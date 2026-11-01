import {User} from '@/models/User';
import {connectDB} from '@/libs/db';
import {errorResponse, HttpError} from '@/libs/httpError';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const {name, email, password} = await req.json();
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== 'string' || password.length < 5 || password.length > 128 ||
        (name !== undefined && (typeof name !== 'string' || name.length > 200))) {
      throw new HttpError(400, 'Email, nombre o contraseña inválidos (mínimo 5 caracteres)');
    }
    await connectDB();
    const user = await User.create({name, email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 10)});
    return Response.json({_id: user._id, email: user.email, name: user.name});
  } catch (error) {
    if (error.code === 11000) return Response.json({error: 'El email ya está registrado'}, {status: 409});
    return errorResponse(error);
  }
}
