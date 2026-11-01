import {connectDB} from "@/libs/db";
import {isAdmin} from "@/libs/auth";
import {User} from "@/models/User";

export async function GET() {
  await connectDB();
  if (await isAdmin()) {
    const users = await User.find().select('-password');
    return Response.json(users);
  } else {
    return Response.json([]);
  }
}