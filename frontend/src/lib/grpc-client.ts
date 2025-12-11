import * as grpc from '@grpc/grpc-js';
import { PingServiceClient } from '@/generated/ping';
import { OnboardingServiceClient } from '@/generated/onboarding';

const GRPC_HOST = process.env.GRPC_HOST || 'localhost:9090';

// Singletons
let pingClient: PingServiceClient | null = null;
let onboardingClient: OnboardingServiceClient | null = null;

export const getGrpcClient = (): PingServiceClient => {
  if (!pingClient) {
    pingClient = new PingServiceClient(
      GRPC_HOST,
      grpc.credentials.createInsecure()
    );
  }
  return pingClient;
};

export const getOnboardingClient = (): OnboardingServiceClient => {
  if (!onboardingClient) {
    onboardingClient = new OnboardingServiceClient(
      GRPC_HOST,
      grpc.credentials.createInsecure()
    );
  }
  return onboardingClient;
};

// Re-export types for convenience
export type { PingRequest, PingReply, PingServiceClient } from '@/generated/ping';
export type { RegisterRequest, RegisterResponse, OnboardingServiceClient } from '@/generated/onboarding';
