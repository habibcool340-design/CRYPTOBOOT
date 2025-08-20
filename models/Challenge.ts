import { Schema, model, models } from "mongoose";
const ChallengeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  reward: { type: Number, required: true },
  type: { type: String, enum: ["daily", "weekly"], default: "daily" },
  completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  active: { type: Boolean, default: true },
}, { timestamps: true });
export default models.Challenge || model("Challenge", ChallengeSchema);
