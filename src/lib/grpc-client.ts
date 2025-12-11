import * as grpc from '@grpc/grpc-js';
import { PingServiceClient } from '@/generated/proto/ping';

const GRPC_HOST = process.env.GRPC_HOST || 'localhost:9090';

// Singleton
let client: PingServiceClient | null = null;

export const getGrpcClient = (): PingServiceClient => {
  if (!client) {
    client = new PingServiceClient(
      GRPC_HOST,
      grpc.credentials.createInsecure()
    );
  }
  return client;
};

// Re-export types for convenience
export type { PingRequest, PingReply, PingServiceClient } from '@/generated/proto/ping';
