"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
  iss?: string;
  aud?: string;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt.decode(token) as JwtPayload | null;
      if (decoded && decoded.exp * 1000 > Date.now()) {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, [router]);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-6xl text-black mt-12">Welcome</div>
    </div>
  );
}
