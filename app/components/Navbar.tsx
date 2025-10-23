"use client";
import { getToken, logout } from "@/lib/clientAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavLinks = () => (
    <>
      {!isLoggedIn ? (
        <>
          <Link
            href="/login"
            className="text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/project/viewProjects"
            className="text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
          >
            View Projects
          </Link>
          <Link
            href="/task/viewTasks"
            className="text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
          >
            View Tasks
          </Link>
          <Link
            href="/project/createProject"
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Create Project
          </Link>
          <Link
            href="/task/createTask"
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Create Task
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold text-blue-600">TaskFlow</div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold text-blue-600">TaskFlow</span>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <div
          className="flex flex-col gap-4 p-4"
          onClick={() => setIsSidebarOpen(false)} // close sidebar when link clicked
        >
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}
