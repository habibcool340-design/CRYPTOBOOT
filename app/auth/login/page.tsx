"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login(){
  const [step, setStep] = useState<"email"|"otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref") || "";

  async function requestOtp(){
    setLoading(true);
    const r = await fetch("/api/auth/request-otp", { method:"POST", body: JSON.stringify({ email, ref }) });
    setLoading(false);
    if(r.ok) setStep("otp");
    else alert(await r.text());
  }

  async function verifyOtp(){
    setLoading(true);
    const r = await fetch("/api/auth/verify-otp", { method:"POST", body: JSON.stringify({ email, otp, password }) });
    setLoading(false);
    if(r.ok){ alert("Email verified. You can login now!"); }
    else alert(await r.text());
  }

  async function loginEmail(){
    setLoading(true);
    const r = await fetch("/api/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
    setLoading(false);
    if(r.ok){
      const data = await r.json();
      localStorage.setItem("roar_token", data.token);
      router.push("/dashboard");
    } else {
      alert(await r.text());
    }
  }

  async function loginGoogle(){
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e0f13] to-[#0a0b0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass rounded-2xl p-5 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login to <span className="text-sky-400">ROAR</span></h1>
        <button onClick={loginGoogle} className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20">Continue with Google</button>
        <div className="text-center text-white/40 text-sm">or</div>
        {step==="email" ? (
          <div className="space-y-2">
            <input className="w-full p-3 rounded-xl bg-white/10 outline-none" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <button disabled={loading} onClick={requestOtp} className="py-2 rounded-xl bg-sky-600 hover:bg-sky-500">Send OTP</button>
              <button disabled={loading} onClick={loginEmail} className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500">Login</button>
            </div>
            <p className="text-xs text-white/50">First time? Press <b>Send OTP</b>, verify and set password, then use <b>Login</b>.</p>
            {ref ? <p className="text-[11px] text-white/40">Joining via referral: <b>{ref}</b></p> : null}
          </div>
        ) : (
          <div className="space-y-2">
            <input className="w-full p-3 rounded-xl bg-white/10 outline-none" placeholder="OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
            <input className="w-full p-3 rounded-xl bg-white/10 outline-none" placeholder="Set Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button disabled={loading} onClick={verifyOtp} className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500">Verify & Save Password</button>
          </div>
        )}
      </div>
    </div>
  )
}
