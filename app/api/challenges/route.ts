import dbConnect from "@/lib/dbConnect";
import Challenge from "@/models/Challenge";

export async function GET(){
  await dbConnect();
  const items = await Challenge.find({ active: true }).lean();
  return Response.json({ items });
}
