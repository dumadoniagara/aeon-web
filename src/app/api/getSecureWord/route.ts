import { NextResponse } from "next/server";
import crypto from "crypto";
import { secureWordStore } from "@/lib/secureStore";

const userRateLimit: Record<string, number> = {};

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const now = Date.now();

    if (userRateLimit[username] && now - userRateLimit[username] < 10_000) {
      return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
    }

    userRateLimit[username] = now;

    const timestamp = Math.floor(Date.now() / 1000); // seconds
    const secret = "my_super_secret"; // put here instead of env for simplify 
    const secureWord = crypto
      .createHmac("sha256", secret)
      .update(username + timestamp)
      .digest("hex")
      .slice(0, 8);

    const expiresAt = now + 60_000;

    secureWordStore[username] = { secureWord, expiresAt };

    setTimeout(()=>{
        console.log('secureWordStore ==', secureWordStore)
    },1000)

    return NextResponse.json({
      username,
      secureWord,
      expiresAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
