import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request){
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

  const populated = await User.findById(user._id).populate("referrals", "email createdAt");
  return Response.json({
    referralCode: populated.referralCode,
    referrals: (populated.referrals || []).map((r:any)=>({ email: r.email, joinedAt: r.createdAt }))
  });
}
