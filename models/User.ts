import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String },
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  telegramId: { type: String, unique: true, sparse: true },
  balance: { type: Number, default: 0 },
  lastClaimAt: { type: Date, default: Date.now },

  referralCode: { type: String, unique: true, sparse: true },
  referrerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  referrals: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default models.User || model("User", UserSchema);
