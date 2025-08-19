import { NextResponse } from "next/server";
import { mfaStore } from "@/lib/mfaStore";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

export async function POST(req: Request) {
  const { username, code } = await req.json();

  console.log("username ==", username);

  const mfa = mfaStore[username];
  if (!mfa) {
    return NextResponse.json(
      { error: "MFA not initialized" },
      { status: 400 }
    );
  }

  if (mfa.attempts >= 3) {
    return NextResponse.json(
      { error: "Too many attempts. Locked out." },
      { status: 403 }
    );
  }
  
  console.log("username ==", username);
console.log("secret ==", mfa.secret);
console.log("input code ==", code);

  const verified = speakeasy.totp.verify({
    secret: mfa.secret, 
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!verified) {
    mfa.attempts += 1;
    return NextResponse.json(
      { error: "Invalid MFA code" },
      { status: 401 }
    );
  }

  mfa.attempts = 0;

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || "super_secret",
    { expiresIn: "1h" }
  );

  return NextResponse.json({ success: true, token });
}
