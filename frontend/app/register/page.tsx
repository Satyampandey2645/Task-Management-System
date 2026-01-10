"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await api.post("/auth/register", { name, email, password });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Register</h1>

      <input className="border p-2 mb-2 w-64" placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input className="border p-2 mb-2 w-64" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 mb-2 w-64" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

      <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">
        Register
      </button>
    </div>
  );
}
