import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request){
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if(!user || !user.passwordHash) return new Response("Invalid credentials", { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return new Response("Invalid credentials", { status: 401 });
  const token = signToken(user._id.toString());
  return Response.json({ token, balance: user.balance, lastClaimAt: user.lastClaimAt });
}
