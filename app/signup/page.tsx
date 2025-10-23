"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/clientAuth";
export default function SignupPage() {
    const router = useRouter();
    useEffect(() => {
      const token = getToken();
      if(token)
      {
        router.push("/");
      }
    }, []);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function handleSignup(e: React.FormEvent)
    {
        e.preventDefault();
        const res = await fetch("/api/register",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if(res.ok)
        {
            alert("Sign up Successful");
            router.push("/login");
        }
        else
        {
            const data = await res.json();
            alert(data.error || "Signup Failed");
        }
    }
      return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      ></div>

      {/* Overlay to darken the image for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Form container */}
      <div className="relative bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-md w-full p-10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join us and start managing your tasks effortlessly!
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-purple-500 text-white font-semibold rounded-xl py-3 hover:bg-purple-600 transition">
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-500 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}