package org.example.cephid

import com.example.grpc.PingReply
import com.example.grpc.PingRequest
import com.example.grpc.PingServiceGrpcKt

import net.devh.boot.grpc.server.service.GrpcService

import javax.inject.Inject
import javax.inject.Named

@Named
@GrpcService
class PingService : PingServiceGrpcKt.PingServiceCoroutineImplBase() {

    override suspend fun ping(request: PingRequest): PingReply {
        println("Received ping request: ${request.message}")

        return PingReply.newBuilder()
            .setMessage("Pong! Server received: ${request.message}")
            .build()
    }
}