import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET handler
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const taskId = req.nextUrl.pathname.split("/").pop(); // /api/tasks/[id]
    if (!taskId) return NextResponse.json({ error: "Task ID missing" }, { status: 400 });

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: "No task found" }, { status: 404 });

    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    if (project?.ownerId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PUT handler
export async function PUT(req: NextRequest) {
  try {
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const taskId = req.nextUrl.pathname.split("/").pop();
    if (!taskId) return NextResponse.json({ error: "Task ID missing" }, { status: 400 });

    const { title, description, status } = await req.json();

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: "No task found" }, { status: 404 });

    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    if (project?.ownerId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, status },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const taskId = req.nextUrl.pathname.split("/").pop();
    if (!taskId) return NextResponse.json({ error: "Task ID missing" }, { status: 400 });

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: "No task found" }, { status: 404 });

    const project = await prisma.project.findUnique({ where: { id: task.projectId } });
    if (project?.ownerId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    return NextResponse.json({ task: deletedTask });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
