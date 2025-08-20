import { Schema, model, models } from "mongoose";
const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["CLAIM", "TRANSFER", "CHALLENGE", "REFERRAL"], required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
export default models.Transaction || model("Transaction", TransactionSchema);
