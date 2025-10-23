"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/clientAuth";
import { getUserFromToken } from "@/lib/auth";
export default function createProject() {
    const router = useRouter();
    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/home");
        }
        else {
            const userId = getUserFromToken(token);
        }
    }, []);
    const [name, setName] = useState("");

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("No User!!! Login First");
            return;
        }
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
        },
            body: JSON.stringify({ name }), 
        });

        if (res.ok) {
            alert("Project Added");
            router.push("/project/viewProjects");
        }
        else {
            const data = await res.json();
            alert(data.error || "Adding Project failed");
        }
    }
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('/bg-image-1.jpg')" }}
            ></div>

            {/* Overlay to darken the image for readability */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Form container */}
            <div className="relative bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-md w-full p-10 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Create Your Project
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Name the project please
                </p>

                <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                    <input
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button className="bg-purple-500 text-white font-semibold rounded-xl py-3 hover:bg-purple-600 transition">
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
}