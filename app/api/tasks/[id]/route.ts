import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, {params}: Params)
{
  try{
    const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const task = await prisma.task.findUnique({where: {id: params.id}});
    const projectId = task?.projectId;
    const project = await prisma.project.findUnique({where: {id: projectId}});
    const ownerId = project?.ownerId;
    if(ownerId != user.id)
    {
      return NextResponse.json(
        {error: "Forbidden"},
        {status: 403}
      )
    }

    return NextResponse.json({task});
  }
  catch(error)
  {
    return NextResponse.json(
      {error: "Something went wrong"}),
      {status: 403}
  }
}
export async function PUT(req: Request, {params}: Params)
{
    try{
        const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const taskId = params.id;
    const {title, description, status} = await req.json();
    const task = await prisma.task.findUnique({where: {id: taskId}});
    if(!task)
    {
      return NextResponse.json(
        {error: "No task found"},
        {status: 400}
      );
    }
    const project = await prisma.project.findUnique({where: {id: task.projectId}});
    if(project?.ownerId != user.id)
    {
      return NextResponse.json(
        {error: "Forbidden"},
        {status: 403}
      );
    }

    const updatedTask = await prisma.task.update({
      where: {id: params.id},
      data: {title, description, status},
    });
    return NextResponse.json({task: updatedTask});

    }
    catch(error)
    {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function DELETE(req: Request, {params}: Params)
{
    try{
        const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const taskId = params.id;
    const task = await prisma.task.findUnique({where: {id: taskId}});
    if(!task)
    {
      return NextResponse.json(
        {error: "No task found"},
        {status: 400}
      );
    }
    const project = await prisma.project.findUnique({where: {id: task.projectId}});
    if(project?.ownerId != user.id)
    {
      return NextResponse.json(
        {error: "Forbidden"},
        {status: 403}
      );
    }

    const updatedTask = await prisma.task.delete({where: {id: taskId}});
    return NextResponse.json({task: updatedTask});

    }
    catch(error)
    {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}