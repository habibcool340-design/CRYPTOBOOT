"use client";
import { useEffect, useState } from "react";
import { Wallet, Flame, Pickaxe, Users, User } from "lucide-react";

type Tab = "wallet"|"challenge"|"mining"|"friends"|"profile";

export default function Dashboard(){
  const [tab, setTab] = useState<Tab>("mining");
  const [balance, setBalance] = useState<number>(0);
  const [nextAt, setNextAt] = useState<Date | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralsCount, setReferralsCount] = useState<number>(0);

  async function fetchBalance(){
    const token = (typeof window !== "undefined") ? localStorage.getItem("roar_token") : null;
    const r = await fetch("/api/balance", { headers: token ? { "Authorization": "Bearer "+token } : {} });
    if(r.ok){
      const d = await r.json();
      setBalance(d.balance);
      setReferralCode(d.referralCode || "");
      setReferralsCount(d.referralsCount || 0);
      if(d.lastClaimAt){
        const last = new Date(d.lastClaimAt);
        const next = new Date(last.getTime() + 4*3600000);
        setNextAt(next);
      }
    }
  }
  useEffect(()=>{ fetchBalance(); }, []);

  const [now, setNow] = useState<Date>(new Date());
  useEffect(()=>{ const t = setInterval(()=>setNow(new Date()), 1000); return ()=>clearInterval(t); }, []);

  const remainingMs = nextAt ? nextAt.getTime() - now.getTime() : 0;
  const canClaim = remainingMs <= 0;

  async function claim(){
    const token = localStorage.getItem("roar_token");
    const r = await fetch("/api/claim", { method: "POST", headers: token ? { "Authorization": "Bearer "+token } : {} });
    if(r.ok){
      const d = await r.json();
      setBalance(d.balance);
      setNextAt(new Date(Date.now() + 4*3600000));
    } else {
      alert(await r.text());
    }
  }

  function fmt(ms:number){
    const s = Math.max(0, Math.floor(ms/1000));
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  }

  // Friends / leaderboard data
  const [leaderboard, setLeaderboard] = useState<{email:string,referrals:number}[]>([]);
  const [myRefs, setMyRefs] = useState<{email:string,joinedAt:string}[]>([]);
  useEffect(()=>{
    fetch("/api/friends/leaderboard").then(r=>r.json()).then(d=>setLeaderboard(d.leaderboard||[]));
    const token = localStorage.getItem("roar_token");
    fetch("/api/friends/me", { headers: token ? { "Authorization":"Bearer "+token } : {} })
      .then(r=>r.ok?r.json():{referrals:[]})
      .then(d=>setMyRefs(d.referrals||[]));
  },[]);

  // Challenges
  const [challenges,setChallenges] = useState<any[]>([]);
  useEffect(()=>{ fetch("/api/challenges").then(r=>r.json()).then(d=>setChallenges(d.items||[])); },[]);
  async function claimChallenge(id:string){
    const token = localStorage.getItem("roar_token");
    const r = await fetch("/api/challenges/claim", { method:"POST", headers: { "Content-Type":"application/json", ...(token?{"Authorization":"Bearer "+token}:{}) }, body: JSON.stringify({ challengeId: id }) });
    if(r.ok){ const d=await r.json(); setBalance(d.balance); alert("Challenge reward added!"); }
    else alert(await r.text());
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0e0f13] to-[#0a0b0f]">
      <section className="relative rounded-[2.25rem] overflow-hidden shadow-glass border border-white/10 bg-gradient-to-b from-[#0e0f13] to-[#0a0b0f] p-4 aspect-[9/19.5] w-[380px] max-w-full">
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="text-white/60 text-sm">ROAR</div>
          <div className="text-white/40 text-xs">bot</div>
          <div className="w-8 h-8 rounded-full glass grid place-items-center">⋯</div>
        </div>

        <div className="mt-4 px-1">
          {tab==="mining" && (
            <div>
              <div className="relative mt-6 flex items-center justify-center">
                <div className="relative grid place-items-center rounded-full w-64 h-64 border border-white/10">
                  <div className="text-center">
                    <div className="text-white/50 text-sm">In storage:</div>
                    <div className="text-3xl font-extrabold tracking-widest">{balance.toFixed(6)}</div>
                    <div className="mt-3 text-xs text-white/60">Balance: <span className="font-semibold text-white">{balance.toFixed(2)} ROAR</span></div>
                    <div className="mt-1 text-[11px] text-white/50">Next Claim: {canClaim? "Ready" : fmt(remainingMs)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button disabled={!canClaim} onClick={claim} className={"w-full py-3 rounded-xl transition font-semibold "+(canClaim? "bg-sky-600 hover:bg-sky-500":"bg-white/10 text-white/40 cursor-not-allowed")}>
                  {canClaim? "Claim +8 ROAR" : "Claim disabled"}
                </button>
              </div>
            </div>
          )}

          {tab==="wallet" && (
            <div className="space-y-4">
              <div>
                <div className="text-white/50 text-xs">TOTAL BALANCE:</div>
                <div className="text-3xl font-extrabold tracking-wider">{balance.toFixed(6)} <span className="text-sky-400">ROAR</span></div>
              </div>
              <div className="glass rounded-2xl p-3">
                <div className="text-white/70 text-sm">Recent transactions</div>
                <div className="mt-3 text-white/40 text-sm">Claim and challenge rewards will show here after you earn them.</div>
              </div>
            </div>
          )}

          {tab==="friends" && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-3">
                <div className="text-sm">Your Referral Code</div>
                <div className="mt-1 text-xl font-bold">{referralCode || "Generating..."}</div>
                <div className="mt-2 text-xs text-white/60 break-all">Invite Link: {typeof window!=="undefined" ? `${window.location.origin}/auth/login?ref=${referralCode}` : ""}</div>
                <div className="mt-2 text-xs text-white/60">Total referrals: {referralsCount}</div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="font-semibold mb-2">Leaderboard (by referrals)</div>
                <div className="space-y-2 max-h-52 overflow-auto pr-1">
                  {leaderboard.map((x,i)=>(
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="text-white/70">{i+1}. {x.email}</div>
                      <div className="text-white/50">{x.referrals}</div>
                    </div>
                  ))}
                  {leaderboard.length===0 && <div className="text-white/40 text-sm">No data yet.</div>}
                </div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="font-semibold mb-2">Your Referred Friends</div>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {myRefs.map((x,i)=>(
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="text-white/70">{x.email}</div>
                      <div className="text-white/50">{new Date(x.joinedAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {myRefs.length===0 && <div className="text-white/40 text-sm">Nobody yet. Share your link!</div>}
                </div>
              </div>
            </div>
          )}

          {tab==="challenge" && (
            <div className="space-y-3">
              {challenges.length===0 && <div className="text-white/40 text-sm">No active challenges yet.</div>}
              {challenges.map((c:any)=>(
                <div key={c._id} className="glass rounded-xl p-3">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-white/60 text-sm">{c.description}</div>
                  <div className="text-xs text-white/40 mt-1">{c.type.toUpperCase()} • Reward: {c.reward} ROAR</div>
                  <button onClick={()=>claimChallenge(c._id)} className="mt-2 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500">Claim</button>
                </div>
              ))}
            </div>
          )}

          {tab==="profile" && (
            <div className="space-y-3">
              <div className="glass rounded-xl p-3">
                <div className="text-sm">Logged in to ROAR</div>
                <div className="text-xs text-white/50">Use logout from your auth provider or clear token.</div>
              </div>
              <button onClick={()=>{ localStorage.removeItem("roar_token"); location.href="/auth/login"; }} className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20">Logout</button>
            </div>
          )}
        </div>

        <nav className="absolute inset-x-0 bottom-2 px-4">
          <div className="glass rounded-2xl p-2 grid grid-cols-5 text-center text-[11px] gap-1">
            <a onClick={()=>setTab("wallet")} className={"py-2 rounded-xl hover:bg-white/5 cursor-pointer "+(tab==="wallet"?"bg-white/5":"")}>
              <div className="grid place-items-center"><Wallet className="w-5 h-5"/></div> Wallet
            </a>
            <a onClick={()=>setTab("challenge")} className={"py-2 rounded-xl hover:bg-white/5 cursor-pointer "+(tab==="challenge"?"bg-white/5":"")}>
              <div className="grid place-items-center"><Flame className="w-5 h-5"/></div> Challenge
            </a>
            <a onClick={()=>setTab("mining")} className={"py-2 rounded-xl bg-sky-500/10 ring-1 ring-sky-500/30 cursor-pointer "+(tab==="mining"?"":"")}>
              <div className="grid place-items-center"><Pickaxe className="w-5 h-5"/></div> Mining
            </a>
            <a onClick={()=>setTab("friends")} className={"py-2 rounded-xl hover:bg-white/5 cursor-pointer "+(tab==="friends"?"bg-white/5":"")}>
              <div className="grid place-items-center"><Users className="w-5 h-5"/></div> Friends
            </a>
            <a onClick={()=>setTab("profile")} className={"py-2 rounded-xl hover:bg-white/5 cursor-pointer "+(tab==="profile"?"bg-white/5":"")}>
              <div className="grid place-items-center"><User className="w-5 h-5"/></div> Profile
            </a>
          </div>
        </nav>
      </section>
    </main>
  )
}
