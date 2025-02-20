import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@ararog/microblog-profiles-api-db";
import { SignupDetailsFormSchema } from "@ararog/microblog-validation";

export const POST = async(req: NextRequest) => {
  const authHeaders = await headers();
  const userId = authHeaders.get("user");

  if (!userId) {
    return new NextResponse(JSON.stringify({ errors: { user: ["Invalid user ID"] } }), {
      status: 400,
    });  
  }

  const profilePayload = await req.json();

  const {success, data, error} = SignupDetailsFormSchema.safeParse(profilePayload);

  if (!success) {
    return new NextResponse(JSON.stringify({ errors: error?.formErrors.fieldErrors }), {
      status: 400,
    });
  }

  await prisma.profile.create({
    data: {
      name: data.name,
      birthDate: data.birthDate,
      userId: userId,
    }
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
