import { NextRequest, NextResponse } from "next/server";
import { RequestPathProps } from "@ararog/microblog-types";
import { prisma } from "@ararog/microblog-profiles-api-db";

export const GET = async(req: NextRequest, { params }: { params: RequestPathProps }) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  const post = await prisma.profile.findUnique({
    where: {
      id,
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export const PUT = async(req: NextRequest, { params }: { params: RequestPathProps }) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  const data = await req.json();

  await prisma.profile.update({
    where: {
      id,
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
};

export const DELETE = async(req: NextRequest, { params }: { params: RequestPathProps }) => {
  const { id } = await params;
  if (!id)
    return new NextResponse(null, {
      status: 400,
    });

  await prisma.profile.delete({
    where: {
      id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });
};
