import {authOptions, isAdmin} from '@/libs/auth';
import {connectDB} from '@/libs/db';
import {errorResponse, HttpError} from '@/libs/httpError';
import {Order} from '@/models/Order';
import {isValidObjectId} from 'mongoose';
import {getServerSession} from 'next-auth';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new HttpError(401, 'Inicia sesión');
    await connectDB();
    const admin = await isAdmin();
    const id = new URL(req.url).searchParams.get('_id');
    const filter = admin ? {} : {userEmail: session.user.email};
    if (id) {
      if (!isValidObjectId(id)) throw new HttpError(400, 'Pedido inválido');
      const order = await Order.findOne({...filter, _id: id});
      if (!order) throw new HttpError(404, 'Pedido no encontrado');
      return Response.json(order);
    }
    return Response.json(await Order.find(filter));
  } catch (error) { return errorResponse(error); }
}
