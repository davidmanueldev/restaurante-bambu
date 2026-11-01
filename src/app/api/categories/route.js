import {connectDB} from "@/libs/db";
import {isAdmin} from "@/libs/auth";
import {Category} from "@/models/Category";

export async function POST(req) {
  await connectDB();
  const {name, type} = await req.json();
  if (await isAdmin()) {
    const categoryDoc = await Category.create({name, type});
    return Response.json(categoryDoc);
  } else {
    return Response.json({});
  }
}

export async function PUT(req) {
  await connectDB();
  const {_id, name, type} = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({_id}, {name, type});
  }
  return Response.json(true);
}

export async function GET() {
  await connectDB();
  return Response.json(
    await Category.find()
  );
}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({_id});
  }
  return Response.json(true);
}