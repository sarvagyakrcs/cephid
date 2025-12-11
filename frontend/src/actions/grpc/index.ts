'use server';

import type { ServiceError } from '@grpc/grpc-js';
import { getGrpcClient, getOnboardingClient } from '@/lib/grpc-client';
import type { RegisterResponse } from '@/generated/onboarding';
import type { PingReply } from '@/generated/ping';

export async function pingServer(message: string) {
  const client = getGrpcClient();

  // We must wrap the callback in a Promise to await it
  return new Promise<string>((resolve, reject) => {
    client.ping({ message }, (err: ServiceError | null, response: PingReply) => {
      if (err) {
        console.error('gRPC Error:', err);
        reject(err.message || 'Failed to connect to gRPC server');
      } else {
        resolve(response.message);
      }
    });
  });
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const client = getOnboardingClient();

  return new Promise<RegisterResponse>((resolve, reject) => {
    client.registerUser({ username, email, password }, (err, response) => {
      if (err) {
        console.error('gRPC Error:', err);
        reject(err.message || 'Failed to connect to gRPC server');
      } else {
        resolve(response);
      }
    });
  });
}