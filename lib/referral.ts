export function generateReferralCode(seed: string){
  const base = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0,4).toUpperCase() || "USER";
  const rand = Math.random().toString(36).slice(2,6).toUpperCase();
  return `ROAR${base}${rand}`;
}
