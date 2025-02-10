import 'dotenv/config';
import {createServer, CallContext} from 'nice-grpc';
import { prisma } from "@ararog/microblog-profiles-api-db";
import { 
  DeepPartial, 
  ProfilesServiceDefinition,
  ProfilesServiceImplementation, 
  CreateProfileRequest, 
  CreateProfileResponse,
  GetProfileByUserIdRequest,
  GetProfileByUserIdResponse
} from '@ararog/microblog-rpc';

const profilesServiceImpl: ProfilesServiceImplementation = {
  async createProfile(
    request: CreateProfileRequest,
    context: CallContext
  ): Promise<DeepPartial<CreateProfileResponse>> {
    const userId = context.metadata.get('x-user-id');
    if (!userId) {
      throw new Error('User ID is required');
    }
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        name: request.name,
        birthDate: new Date(request.birthDate)
      }
    });
    return {
      id: profile.id
    };
  },
  async getProfileByUserId(
    request: GetProfileByUserIdRequest,
    context: CallContext
  ): Promise<DeepPartial<GetProfileByUserIdResponse>> {
    const userId = request.id;
    if (!userId) {
      throw new Error('User ID is required');
    }
    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId
      }
    });

    // ... method logic
    return {
      profile: {
        id: profile?.id,
        name: profile?.name
      }
    };
  },
};

const startServer = async () => {
  console.log('Starting gRPC server...');
  const server = createServer();

  server.add(ProfilesServiceDefinition, profilesServiceImpl);

  console.log('gRPC server listening at ', process.env.GRPC_HOST || '0.0.0.0:8080');
  await server.listen(process.env.GRPC_HOST || '0.0.0.0:8080');
}

startServer();