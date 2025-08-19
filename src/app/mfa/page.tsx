"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function MfaPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!username || fetchedRef.current) return;

    const fetchQr = async () => {
      try {
        const res = await fetch("/api/setupMfa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to setup MFA");

        setQrCode(data.qrCode);
        fetchedRef.current = true; 
      } catch (err: any) {
        setError(err.message);
        fetchedRef.current = true;
      }
    };

    fetchQr();
  }, [username]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/verifyMfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setSuccess(true);
      localStorage.setItem("token", data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded shadow w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">🎉 Success!</h1>
          <p>You are logged in with MFA ✅</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">MFA Setup & Verification</h1>

        {/* Show QRCode for setup */}
        {qrCode && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Scan this QR code with Google Authenticator / Authy
            </p>
            <img src={qrCode} alt="MFA QR Code" className="mx-auto" />
          </div>
        )}

        {/* Verification form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm mb-1">
              Enter 6-digit code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="123456"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
