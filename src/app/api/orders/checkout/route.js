import {authOptions} from '@/libs/auth';
import {prepareCheckout} from '@/libs/checkout';
import {errorResponse, HttpError} from '@/libs/httpError';
import {Order} from '@/models/Order';
import {getServerSession} from 'next-auth';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new HttpError(401, 'Inicia sesión');
    const {orderData} = await prepareCheckout(await req.json(), session.user.email, true);
    return Response.json(await Order.create(orderData));
  } catch (error) { return errorResponse(error); }
}
