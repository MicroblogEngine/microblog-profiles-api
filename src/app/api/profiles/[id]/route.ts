import { NextResponse } from "next/server";
import { RequestPathProps } from "@ararog/microblog-types";
import { prisma } from "@/helpers/prisma"

export const GET = async(req: Request, props: RequestPathProps ) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
  const post = await prisma.profile.findUnique({
    where: {
      id: id,
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
};

export const PUT = async(req: Request, props: RequestPathProps  ) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
  const data = await req.json();

  await prisma.profile.update({
    where: {
      id: id,
    },
    data: data
  })

  return new NextResponse(null, {
    status: 200,
  });        
};

export const DELETE = async(req: Request, props: RequestPathProps) => {
  if (!props.params)
    return new NextResponse(null, {
      status: 400,
    });

  const id = (await props.params).id;
  await prisma.profile.delete({
    where: {
      id: id,
    },
  })

  return new NextResponse(null, {
    status: 200,
  });         
};
