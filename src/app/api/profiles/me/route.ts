import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prisma"

export const GET = async (req: NextRequest) => {
  const userId = req.headers.get("user");
  if (!userId) {
    return new NextResponse(null, {
      status: 401,
    });  
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return new NextResponse(JSON.stringify(profile), {
    status: 200,
  });
}
