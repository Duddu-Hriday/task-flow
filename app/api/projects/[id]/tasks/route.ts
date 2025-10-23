import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// POST handler
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, status } = await req.json();

    // Extract projectId from URL
    const projectId = req.nextUrl.pathname.split("/")[3]; // /api/projects/[id]/tasks → index 3 is id
    if (!projectId)
      return NextResponse.json({ error: "Project Id required for task" }, { status: 400 });

    if (!title)
      return NextResponse.json({ error: "Title required for task" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
      return NextResponse.json({ error: "Invalid Project Id" }, { status: 400 });

    const task = await prisma.task.create({
      data: { title, description, status, projectId },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET handler
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projectId = req.nextUrl.pathname.split("/")[3];
    if (!projectId)
      return NextResponse.json({ error: "Invalid Project Id" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
      return NextResponse.json({ error: "Invalid Project Id" }, { status: 400 });

    const tasks = await prisma.task.findMany({ where: { projectId } });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
