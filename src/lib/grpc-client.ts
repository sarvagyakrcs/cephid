import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(process.cwd(), 'proto/ping.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as grpc.GrpcObject & {
  com: { example: { grpc: { PingService: grpc.ServiceClientConstructor } } };
};
const pingPackage = grpcObject.com.example.grpc;

// Singleton
let client: grpc.Client | null = null;

export const getGrpcClient = () => {
  if (!client) {
    client = new pingPackage.PingService(
      'localhost:9090', // Docker port
      grpc.credentials.createInsecure()
    );
  }
  return client;
};