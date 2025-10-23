"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/clientAuth";
import { getUserFromToken } from "@/lib/auth";
export default function createTask() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/home");
        }
        else {
            const fetchTask = async () => {
                const token = getToken();
                if (!token) {
                    // setError("Unauthorized. Please log in first.");
                    // setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`/api/projects`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch task.");
                    }

                    const data = await response.json();
                    setProjects(data.projects || null);
                } catch (err: any) {
                    // setError(err.message || "Something went wrong while loading the task.");
                } finally {
                    // setLoading(false);
                }
            };

            fetchTask();
        }

    }, []);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("todo");
    const [projectId, setProjectId] = useState("");
    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("No User!!! Login First");
            return;
        }
        const res = await fetch(`/api/projects/${projectId}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, status, projectId }),
        });

        if (res.ok) {
            alert("Task Created");
            router.push("/task/viewTasks");
        }
        else {
            const data = await res.json();
            alert(data.error || "Adding Task failed");
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
                    Create Your Task
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Give a title to the task
                </p>

                <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                    <input
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects?.map((project: any) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {/* <option value="todo">Select Status</option> */}
                        <option value="todo">Todo</option>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="bg-purple-500 text-white font-semibold rounded-xl py-3 hover:bg-purple-600 transition">
                        Create Project
                    </button>
                </form>
            </div>
        </div>
    );
}