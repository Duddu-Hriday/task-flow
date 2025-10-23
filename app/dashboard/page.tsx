"use client"

import { getToken } from "@/lib/clientAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
export default function Dashboard() {
    const router= useRouter();
    useEffect(() => {
        const token = getToken();
    if(!token)
    {
        router.push("/login");
    }
    }, [router])
    
    const features = [
        {
            title: "Create Projects",
            description: "Set up your projects easily and keep everything organized.",
            buttonText: "Create Project",
            buttonLink: "/project/createProject",
            bgClass: "bg-blue-600 hover:bg-blue-700",
            image: "/images/createProject.jpg",
        },
        {
            title: "Add Tasks",
            description: "Add tasks to each project and manage them efficiently.",
            buttonText: "Add Task",
            buttonLink: "/task/createTask",
            bgClass: "bg-green-600 hover:bg-green-700",
            image: "/images/createTask.jpg",
        },
        {
            title: "View Projects",
            description: "See all your projects and the tasks inside them at a glance.",
            buttonText: "View Projects",
            buttonLink: "/project/viewProjects",
            bgClass: "bg-purple-600 hover:bg-purple-700",
            image: "/images/viewProject.jpg",
        },
        {
            title: "View Tasks",
            description: "Check your tasks, mark them done, and track your progress.",
            buttonText: "View Tasks",
            buttonLink: "/task/viewTasks",
            bgClass: "bg-cyan-600 hover:bg-cyan-700",
            image: "/images/viewTasks.jpg",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-6 py-12 pt-20">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Welcome to TaskFlow!
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                        Easily create projects and manage tasks to stay organized and productive.
                    </p>
                </section>

                {/* Features Section */}
                <section className="flex flex-col gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-center"
                        >
                            <div className="md:w-1/3 mb-4 md:mb-0">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    width={150}
                                    height={150}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="md:w-2/3 md:pl-6 flex flex-col items-start">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h2>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <Link
                                    href={feature.buttonLink}
                                    className={`${feature.bgClass} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300`}
                                >
                                    {feature.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            <Footer />
        </div>
    )
}
