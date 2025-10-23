"use client";

import { getToken } from "@/lib/clientAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function ViewProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.log("Unauthorized");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Your Projects
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track all your ongoing projects efficiently.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg animate-pulse">
            Loading projects...
          </div>
        ) : projects.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/viewProjects/${project.id}`}
                className="block bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                )}
                <div className="text-right">
                  <span className="text-blue-600 font-medium hover:text-blue-800 transition">
                    View Tasks →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-24">
            <p className="text-gray-500 mb-6 text-lg">
              You dont have any projects yet.
            </p>
            <Link
              href="/createProject"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              + Create New Project
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
