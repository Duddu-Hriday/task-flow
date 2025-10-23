"use client";

import { useParams } from "next/navigation";
import { getToken } from "@/lib/clientAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "completed";
}

export default function ProjectDetailPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchTasks = async () => {
      const token = getToken();
      if (!token) {
        setError("Unauthorized. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${id}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }

        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong while loading tasks.");
        }
      }


      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  const renderStatusBadge = (status: Task["status"]) => {
    const colors =
      status === "todo"
        ? "bg-red-100 text-red-700"
        : status === "inprogress"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";

    return (
      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${colors}`}>
        {status.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pg-40">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Tasks</h1>
          <Link
            href="/viewProjects"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-12 animate-pulse text-lg">
            Loading tasks...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8 font-medium text-lg">{error}</div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="text-center text-gray-500 py-12 text-lg">
            No tasks found for this project.
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {task.description || "No description provided."}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  {renderStatusBadge(task.status)}
                  <Link
                    href={`/task/viewTasks/${task.id}`}
                    className="text-blue-600 font-medium hover:text-blue-800 transition"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
