"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.ok) {
      setEmail("");
      setPassword("");
      onClose();
      if (result.isModel) {
        router.push("/model/profile");
      } else if (result.isInfluencer) {
        router.push("/influencer/profile");
      } else {
        router.push("/models");
      }
    } else {
      setError(result.message ?? "Invalid email or password.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close login modal"
      />
      <div className="relative w-full max-w-md bg-white border border-[#E0E0E0] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <h2 className="font-ui text-[11px] font-light tracking-[0.25em] uppercase mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-[#E0E0E0] px-4 py-3 font-ui text-[11px] tracking-[0.1em] outline-none focus:border-[#C8A97A]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border border-[#E0E0E0] px-4 py-3 font-ui text-[11px] tracking-[0.1em] outline-none focus:border-[#C8A97A]"
          />
          {error && (
            <p className="font-ui text-[10px] text-red-600">{error}</p>
          )}
          <button
            type="submit"
            data-cursor="button"
            className="w-full font-ui text-[10px] font-light tracking-[0.25em] uppercase px-6 py-3 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 font-ui text-[10px] text-[#6B6B6B] text-center leading-relaxed">
          New here?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent("walk:open-apply"));
            }}
            className="text-[#9A7329] underline underline-offset-2"
          >
            Apply to join
          </button>
          {" · "}
          <Link
            href="/register/client"
            onClick={onClose}
            className="text-[#9A7329] underline underline-offset-2"
          >
            Register as client
          </Link>
        </p>
      </div>
    </div>
  );
}
