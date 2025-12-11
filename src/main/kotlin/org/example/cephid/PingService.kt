package org.example.cephid

// These imports come from the code Gradle generated from your proto file
import com.example.grpc.PingReply
import com.example.grpc.PingRequest
import com.example.grpc.PingServiceGrpcKt

// This import is for the gRPC Server annotation
import net.devh.boot.grpc.server.service.GrpcService

// These are the JSR-330 requirements your boss asked for
import javax.inject.Inject
import javax.inject.Named

@Named // JSR-330: Tells Spring this is a managed bean (like @Service)
@GrpcService // Tells the gRPC library to expose this class as a server
class PingService : PingServiceGrpcKt.PingServiceCoroutineImplBase() {

    override suspend fun ping(request: PingRequest): PingReply {
        // Log to console so we know it worked
        println("Received ping request: ${request.message}")

        // Build the response
        return PingReply.newBuilder()
            .setMessage("Pong! Server received: ${request.message}")
            .build()
    }
}