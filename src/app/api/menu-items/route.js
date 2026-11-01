import {connectDB} from "@/libs/db";
import {isAdmin} from "@/libs/auth";
import {MenuItem} from "@/models/MenuItem";

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  if (await isAdmin()) {
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  await connectDB();
  if (await isAdmin()) {
    const {_id, ...data} = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
  }
  return Response.json(true);
}

export async function GET() {
  await connectDB();
  return Response.json(
    await MenuItem.find()
  );
}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await MenuItem.deleteOne({_id});
  }
  return Response.json(true);
}