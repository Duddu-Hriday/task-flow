import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

// Use NextRequest for better type safety
export async function PUT(req: NextRequest) {
  try {
    // Extract the dynamic param from the URL
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Project ID missing" }, { status: 400 });

    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Project name is required" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.ownerId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Project ID missing" }, { status: 400 });

    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (project.ownerId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
