import jwt from "jsonwebtoken";
export function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}
export function verifyToken(token: string): { id: string } | null {
  try { return jwt.verify(token, process.env.JWT_SECRET as string) as any; }
  catch { return null; }
}
