import dbConnect from "@/lib/dbConnect";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request){
  await dbConnect();
  const { challengeId } = await req.json();
  let user: any = null;

  const auth = req.headers.get("authorization");
  if(auth){
    const token = auth.split(" ")[1];
    const payload = verifyToken(token);
    if(payload) user = await User.findById(payload.id);
  }
  if(!user){
    const session = await getServerSession(authOptions as any);
    if(session?.user?.email) user = await User.findOne({ email: session.user.email });
  }
  if(!user) return new Response("Unauthorized", { status: 401 });

  const ch: any = await Challenge.findById(challengeId);
  if(!ch || !ch.active) return new Response("Challenge not found", { status: 404 });
  const already = ch.completedBy?.some((id:any)=> String(id) === String(user._id));
  if(already) return new Response("Already claimed", { status: 400 });

  ch.completedBy.push(user._id);
  await ch.save();

  user.balance += ch.reward;
  await user.save();
  await Transaction.create({ userId: user._id, type: "CHALLENGE", amount: ch.reward });

  return Response.json({ balance: user.balance });
}
