"use client"

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import { getToken, setToken } from "@/lib/clientAuth";

export default function LoginPage()
{
    const router = useRouter();
    useEffect(() => {
        const token = getToken();
        if(token)
        {
            router.push("/");
        }
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function handleLogin(e: React.FormEvent)
    {
        e.preventDefault();
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });
        const data = await res.json();
        if(res.ok)
        {
            
            const token = data.token;
            setToken(token);
            router.push("/dashboard");
        }
        else
        {
            alert(data.error || "Login Failed");
        }
    }
    return(
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
            <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('/bg-image.jpg')" }}
            ></div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-md w-full p-10 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h2>
                <p className="text-center text-gray-500 mb-8">Just one step before your task manager is ready</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input type="email"
                    className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Email"
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)}/>
                    <input type="password"
                    className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button className="bg-green-500 text-white font-semibold rounded-xl py-3 hover:bg-green-600 transition">Login</button>
                </form>
                <p className="text-center text-gray-400 mt-6">New User?{" "}
                <a href="/signup" className="text-purple-500 font-semibold hover:underline">Sign Up</a></p>
            </div>
        </div>
    );
}

