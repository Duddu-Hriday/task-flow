import { getUserFromToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request)
{
    try{
        const user = getUserFromToken(req.headers.get("Authorization") ?? undefined);
        if(!user)
        {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }
        const projects = await prisma.project.findMany({where: {ownerId: user.id}});
        const projectIds = projects.map((p: { id: string }) => p.id);

        
            const tasks = await prisma.task.findMany({where: {projectId: {in: projectIds}}});
            

        return NextResponse.json(tasks);
    }
    catch(error)
    {
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}