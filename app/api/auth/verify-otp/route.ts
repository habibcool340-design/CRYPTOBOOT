import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import bcrypt from "bcryptjs";

const REFERRAL_BONUS = 4; // 4 ROAR

export async function POST(req: Request){
  await dbConnect();
  const { email, otp, password } = await req.json();
  const user = await User.findOne({ email });
  if(!user || !user.otpCode || !user.otpExpires) return new Response("No OTP found", { status: 400 });
  if(user.otpCode !== otp) return new Response("Invalid OTP", { status: 400 });
  if(user.otpExpires < new Date()) return new Response("OTP expired", { status: 400 });

  user.passwordHash = await bcrypt.hash(password, 10);
  user.otpCode = null;
  user.otpExpires = null;

  if(user.referrerId){
    const referrer: any = await User.findById(user.referrerId);
    if(referrer && !referrer.referrals.includes(user._id)){
      referrer.referrals.push(user._id);
      referrer.balance += REFERRAL_BONUS;
      await referrer.save();
      await Transaction.create({ userId: referrer._id, type: "REFERRAL", amount: REFERRAL_BONUS });
    }
  }

  await user.save();
  return Response.json({ ok: true });
}
