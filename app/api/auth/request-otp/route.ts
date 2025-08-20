import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import nodemailer from "nodemailer";
import { generateReferralCode } from "@/lib/referral";

export async function POST(req: Request){
  await dbConnect();
  const { email, ref } = await req.json();
  if(!email) return new Response("Email required", { status: 400 });

  const otp = Math.floor(100000 + Math.random()*900000).toString();
  const expires = new Date(Date.now() + 5*60*1000);

  let user = await User.findOne({ email });
  if(!user){
    user = await User.create({ email, referralCode: generateReferralCode(email) });
    if(ref){
      const referrer = await User.findOne({ referralCode: ref });
      if(referrer){
        user.referrerId = referrer._id;
        await user.save();
      }
    }
  }

  user.otpCode = otp;
  user.otpExpires = expires;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: `ROAR <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your ROAR OTP Code",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  });

  return Response.json({ ok: true });
}
