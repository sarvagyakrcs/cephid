package org.example.cephid

import com.example.cephid.grpc.OnboardingServiceGrpcKt
import com.example.cephid.grpc.RegisterRequest
import com.example.cephid.grpc.RegisterResponse
import com.example.cephid.grpc.UserRegisteredEvent
import net.devh.boot.grpc.server.service.GrpcService
import org.springframework.kafka.core.KafkaTemplate
import javax.inject.Named
import java.util.UUID

@Named
@GrpcService
class RegistrationService(
    private val kafkaTemplate: KafkaTemplate<String, ByteArray>
) : OnboardingServiceGrpcKt.OnboardingServiceCoroutineImplBase() {

    // in memory list to track users
    private val userDb = mutableListOf<RegisterRequest>()

    override suspend fun registerUser(request: RegisterRequest): RegisterResponse {
        println("Backend: Received registration request for ${request.email}")

        if (userDb.any { it.email == request.email }) {
            return RegisterResponse.newBuilder()
                .setSuccess(false)
                .setMessage("Email already exists!")
                .build()
        }

        userDb.add(request)
        val newUserId = UUID.randomUUID().toString()

        println("Backend: User saved successfully. ID: $newUserId")

        // Publish to Kafka
        val event = UserRegisteredEvent.newBuilder()
            .setUserId(newUserId)
            .setEmail(request.email)
            .setTimestamp(System.currentTimeMillis())
            .build()

        kafkaTemplate.send("user_registered", newUserId, event.toByteArray())
        println("Backend: Published UserRegisteredEvent to Kafka for user $newUserId")

        // Return Success
        return RegisterResponse.newBuilder()
            .setSuccess(true)
            .setMessage("User registered successfully")
            .setUserId(newUserId)
            .build()
    }
}