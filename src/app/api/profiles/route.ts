import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prisma"

export const POST = async(req: NextRequest) => {
  const data = await req.json();

  await prisma.profile.create({
    data: data,
  });

  return new NextResponse(null, {
    status: 200,
  });    
};

export const GET = async () => {
  const profiles = await prisma.profile.findMany();

  return new NextResponse(JSON.stringify(profiles), {
    status: 200,
  });
}
