"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Splash(){
  const router = useRouter();
  useEffect(()=>{
    const t = setTimeout(()=>router.push("/auth/login"), 2200);
    return ()=>clearTimeout(t);
  },[router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .8 }}>
        <Image src="/logo.png" alt="ROAR" width={220} height={220} priority className="drop-shadow-[0_0_40px_rgba(14,139,255,.7)]"/>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-6 text-5xl font-extrabold tracking-widest">
        ROAR
      </motion.div>
    </div>
  )
}
