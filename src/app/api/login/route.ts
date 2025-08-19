import { NextResponse } from "next/server";
import { secureWordStore } from "@/lib/secureStore";
import { mfaStore } from "@/lib/mfaStore";

const mockUsers = {
  kaDum: {
    // original password: 123456
    passwordHash:
      "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  },
};

export async function POST(req: Request) {
  const { username, hashedPassword, secureWord } = await req.json();

  const stored = secureWordStore[username];
  if (!stored || stored.secureWord !== secureWord) {
    return NextResponse.json({ error: "Invalid secure word" }, { status: 401 });
  }
  if (Date.now() > stored.expiresAt) {
    return NextResponse.json({ error: "Secure word expired" }, { status: 401 });
  }

  const user = mockUsers[username as keyof typeof mockUsers];
  if (!user || user.passwordHash !== hashedPassword) {
    return NextResponse.json({ error: "username or password invalid" }, { status: 401 });
  }

  if (mfaStore[username]?.secret) {
    return NextResponse.json({ success: true, mfaRequired: true });
  }

  return NextResponse.json({ success: true, mfaSetupRequired: true });
}
