"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        className="border p-2 mb-2 w-64"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-2 w-64"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      <a href="/register" className="mt-4 text-blue-600">
        Create account
      </a>
    </div>
  );
}
