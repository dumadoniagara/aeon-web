import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { mfaStore } from "@/lib/mfaStore";

export async function POST(req: Request) {
  const { username } = await req.json();

  if (!globalThis.mfaSecrets) {
    globalThis.mfaSecrets = {};
  }

  const secret = speakeasy.generateSecret({
    name: `aeonApp (${username})`,
    length: 20,
  });

    mfaStore[username] = {
        secret: secret.base32,
        attempts: 0,
      };

  globalThis.mfaSecrets[username] = secret.base32;

  const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

  return NextResponse.json({
    secret: secret.base32,
    qrCode,
  });
}
