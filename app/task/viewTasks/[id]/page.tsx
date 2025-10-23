"use client";

import { useParams } from "next/navigation";
import { getToken } from "@/lib/clientAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Task {
  title: string;
  description: string;
  status: "todo" | "inprogress" | "completed";
  projectId: string;
  createdAt: string;
}

export default function TaskDetail() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchTask = async () => {
      const token = getToken();
      if (!token) {
        setError("Unauthorized. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tasks/${id}`, {
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
        setTask(data.task || null);
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

    fetchTask();
  }, [id]);

  const renderStatusBadge = (status: Task["status"]) => {
    let color = "";
    switch (status) {
      case "todo":
        color = "bg-yellow-100 text-yellow-800";
        break;
      case "inprogress":
        color = "bg-blue-100 text-blue-800";
        break;
      case "completed":
        color = "bg-green-100 text-green-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {status.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Details</h1>
          <Link
            href="/task/viewTasks"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Tasks
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 lg:p-12">
          {loading && (
            <div className="text-center text-gray-500 py-12 animate-pulse text-lg">
              Loading task...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 font-medium py-8 text-lg">
              {error}
            </div>
          )}

          {!loading && !error && task && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{task.title}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{task.description}</p>

              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  {renderStatusBadge(task.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Project ID:</span>
                  <span className="text-gray-600 font-mono">{task.projectId}</span>
                </div>
              </div>

              <div className="text-gray-500 text-sm">
                Created on: <time dateTime={task.createdAt}>{new Date(task.createdAt).toLocaleString()}</time>
              </div>
            </div>
          )}

          {!loading && !error && !task && (
            <div className="text-center text-gray-500 py-12 text-lg">Task not found</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
