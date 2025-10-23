// app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { getToken } from "@/lib/clientAuth";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  useEffect(()=> {
    const token = getToken();
    if(token)
    {
      router.push("/dashboard");
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-blue-50 py-20 px-6 md:px-20 pt-20">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Organize Your Projects Effortlessly
          </h1>
          <p className="text-gray-600 mb-6">
            TaskFlow helps you manage your projects and tasks in one place. Track progress, collaborate with your team, and stay productive.
          </p>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="/thumbnail.jpg"
            alt="TaskFlow illustration"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose TaskFlow?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Organize Tasks</h3>
            <p className="text-gray-600">
              Keep all your tasks in one place with clear status and deadlines.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Visualize project progress and stay on top of your work easily.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Manage Projects</h3>
            <p className="text-gray-600">
              Create multiple projects and manage tasks efficiently in one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="py-16 px-6 md:px-20 bg-blue-600 text-white text-center rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Boost Your Productivity?
        </h2>
        <p className="mb-6">
          Join TaskFlow today and take control of your projects like never before.
        </p>
        <Link
          href="/signup"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
