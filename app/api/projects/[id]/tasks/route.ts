import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function POST(req: Request, { params }: RouteContext)
{
    try{
        const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
        if(!user) return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        )

        const {title, description, status} = await req.json();
        // if(status == null)
        // {
        //     status = "";
        // }
        const projectId = params.id;
        if(!title)
        {
            return NextResponse.json(
                {error: "Title required for task"},
                {status: 400}
            )
        }

        if(!projectId)
        {
            return NextResponse.json(
                 {error: "Project Id required for task"},
                {status: 400}
            )
        }

        const project  = await prisma.project.findUnique({where: {id: projectId}});

        if(!project)
        {
            return NextResponse.json(
                  {error: "Invalid Project Id"},
                {status: 400}
            )
        }

        const task = await prisma.task.create({
            data:{
                title,
                description,
                status,
                projectId
            }
        });

        return NextResponse.json({task});
    }
    catch(error)
    {
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        );
    }
}

export async function GET(req: Request, { params }: RouteContext)
{
    try{
        const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
        if(!user) return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        );
        const projectId = params.id;
         const project  = await prisma.project.findUnique({where: {id: projectId}});

        if(!project)
        {
            return NextResponse.json(
                  {error: "Invalid Project Id"},
                {status: 400}
            )
        }

        const tasks = await prisma.task.findMany({
            where: {projectId}
        });

        return NextResponse.json({tasks});

    }
    catch(error)
    {
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        );
    }
}