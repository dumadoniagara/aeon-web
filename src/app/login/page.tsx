"use client"

import { useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"username" | "secureWord" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureWord, setSecureWord] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  

  // countdown timer
  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    try {
      const res = await fetch("/api/getSecureWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get secure word");

      setSecureWord(data.secureWord);
      setExpiresAt(data.expiresAt);
      setStep("secureWord");
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const hashedPassword = SHA256(password).toString();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          hashedPassword,
          secureWord,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push(`/mfa?username=${encodeURIComponent(username)}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Step 1: Username */}
        {step === "username" && (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your username"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Secure Word */}
        {step === "secureWord" && (
          <div className="space-y-4 text-center">
            <p className="text-lg">
              Your Secure Word:{" "}
              <span className="font-mono font-bold">{secureWord}</span>
            </p>
            <p className="text-sm text-gray-500">
              Expires in {countdown} second{countdown !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setStep("username")}
                className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={() => setStep("password")}
                disabled={countdown === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Password */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setStep("secureWord")}
                className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
