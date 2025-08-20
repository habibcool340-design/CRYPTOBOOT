import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(){
  await dbConnect();
  const users = await User.find({}, { email: 1, referrals: 1 }).lean();
  const data = users.map((u:any) => ({ email: u.email, referrals: (u.referrals || []).length }))
                   .sort((a,b)=> b.referrals - a.referrals).slice(0,50);
  return Response.json({ leaderboard: data });
}
