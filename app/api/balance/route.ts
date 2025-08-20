import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request){
  await dbConnect();
  const auth = req.headers.get("authorization");
  let user: any = null;

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

  return Response.json({ 
    balance: user.balance, 
    lastClaimAt: user.lastClaimAt, 
    referralCode: user.referralCode,
    referralsCount: user.referrals?.length || 0
  });
}
