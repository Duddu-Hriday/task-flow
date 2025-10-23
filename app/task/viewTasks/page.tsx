"use client";

import { getToken } from "@/lib/clientAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Task {
  id: string;
  title: string;
  description: string;
}

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.log("Unauthorized");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Your Tasks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize, track, and manage all your ongoing tasks efficiently.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg animate-pulse">
            Loading tasks...
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/task/viewTasks/${task.id}`}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 truncate">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {task.description || "No description provided."}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-blue-600 font-medium hover:text-blue-800 transition">
                    More Info →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-24">
            <svg
              className="mx-auto w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
              />
            </svg>
            <p className="text-gray-500 mt-6 text-lg mb-4">
              No tasks available yet.
            </p>
            <Link
              href="/createTask"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              + Create New Task
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
