import {createServer, CallContext} from 'nice-grpc';
import { prisma } from "@ararog/microblog-profiles-api-db";
import {DeepPartial, 
  CreateProfileRequest, 
  CreateProfileResponse, 
  GetProfileByUserIdRequest,
  GetProfileByUserIdResponse,
  ProfileServiceDefinition, 
  ProfileServiceImplementation 
} from '@ararog/microblog-rpc';

const profileServiceImpl: ProfileServiceImplementation = {
  async createProfile(
    request: CreateProfileRequest,
    context: CallContext
  ): Promise<DeepPartial<CreateProfileResponse>> {
    
    if (!request.userId) {
      throw new Error('User ID is required');
    }
    const profile = await prisma.profile.create({
      data: {
        userId: request.userId,
        name: request.name,
        birthDate: new Date(request.dateOfBirth)
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
    const userId = context.metadata.get('x-user-id');
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
      id: profile?.id,
      name: profile?.name
    };
  },
};

const startServer = async () => {
  console.log('Starting server');
  const server = createServer();

  server.add(ProfileServiceDefinition, profileServiceImpl);

  console.log('Server listening on', process.env.GRPC_HOST || '0.0.0.0:8080');
  await server.listen(process.env.GRPC_HOST || '0.0.0.0:8080');
}

startServer();