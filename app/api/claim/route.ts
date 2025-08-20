import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const CLAIM_REWARD = 8; // 8 ROAR per claim
const CLAIM_INTERVAL = Number(process.env.CLAIM_INTERVAL || 4*3600); // seconds

export async function POST(req: Request){
  await dbConnect();
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

  const now = new Date();
  const elapsedSeconds = (now.getTime() - new Date(user.lastClaimAt).getTime()) / 1000;
  if(elapsedSeconds < CLAIM_INTERVAL) return new Response("Too early", { status: 400 });

  user.balance += CLAIM_REWARD;
  user.lastClaimAt = now;
  await user.save();
  await Transaction.create({ userId: user._id, type: "CLAIM", amount: CLAIM_REWARD });

  return Response.json({ balance: user.balance, claimed: CLAIM_REWARD });
}
