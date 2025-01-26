import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prisma"
import { SignupDetailsFormSchema } from "@ararog/microblog-validation";

export const POST = async(req: NextRequest) => {
  const profilePayload = await req.json();

  const {success, data, error} = await SignupDetailsFormSchema.safeParse(profilePayload);

  if (!success) {
    return new NextResponse(JSON.stringify({ errors: error?.formErrors.fieldErrors }), {
      status: 400,
    });
  }

  await prisma.profile.create({
    data: {
      name: data.name,
      birthDate: data.birthDate,
      userId: req.headers.get("user") as string,
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
