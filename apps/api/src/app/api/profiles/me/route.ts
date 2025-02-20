import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@ararog/microblog-profiles-api-db";

export const GET = async () => {
  const authHeaders = await headers();
  const userId = authHeaders.get("user");

  if (!userId) {
    console.error("Invalid user ID");
    return new NextResponse(JSON.stringify({ errors: { user: ["Invalid user ID"] } }), {
      status: 400,
    });  
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!profile) {
    console.error("Profile not found");
    return new NextResponse(JSON.stringify({ errors: { profile: ["Profile not found"] } }), {
      status: 404,
    });  
  }

  return new NextResponse(JSON.stringify(profile), {
    status: 200,
  });
}
