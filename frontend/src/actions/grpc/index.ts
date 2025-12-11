'use server';

import { getGrpcClient } from '@/lib/grpc-client';

export async function pingServer(message: string) {
  const client = getGrpcClient();

  // We must wrap the callback in a Promise to await it
  return new Promise<string>((resolve, reject) => {
    client.ping({ message }, (err, response) => {
      if (err) {
        console.error('gRPC Error:', err);
        reject(err.message || 'Failed to connect to gRPC server');
      } else {
        resolve(response.message);
      }
    });
  });
}