package org.example.cephid

import com.example.cephid.grpc.OnboardingServiceGrpcKt
import com.example.cephid.grpc.RegisterRequest
import com.example.cephid.grpc.RegisterResponse
import com.example.cephid.grpc.UserRegisteredEvent
import kotlinx.coroutines.future.await
import net.devh.boot.grpc.server.service.GrpcService
import org.springframework.kafka.core.KafkaTemplate
import javax.inject.Named
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Named
@GrpcService
class RegistrationService(
    private val kafkaTemplate: KafkaTemplate<String, ByteArray>
) : OnboardingServiceGrpcKt.OnboardingServiceCoroutineImplBase() {

    private val userDb = ConcurrentHashMap<String, RegisterRequest>()
        // constant lookup

    override suspend fun registerUser(request: RegisterRequest): RegisterResponse {
        println("Backend: Received registration request for ${request.email}")

        if (userDb.containsKey(request.email)) {
            return RegisterResponse.newBuilder()
                .setSuccess(false)
                .setMessage("Email already exists!")
                .build()
        }


        val existing = userDb.putIfAbsent(request.email, request)
        if (existing != null) {
            return RegisterResponse.newBuilder()
                .setSuccess(false)
                .setMessage("Email already exists!")
                .build()
        }

        val newUserId = UUID.randomUUID().toString()
        println("Backend: User saved successfully. ID: $newUserId")

        val event = UserRegisteredEvent.newBuilder()
            .setUserId(newUserId)
            .setEmail(request.email)
            .setTimestamp(System.currentTimeMillis())
            .build()

        try {
            kafkaTemplate.send("user_registered", newUserId, event.toByteArray()).await()
            println("Backend: Published UserRegisteredEvent to Kafka for user $newUserId")
        } catch (e: Exception) {
            userDb.remove(request.email)
            println("Backend: Failed to publish to Kafka, rolling back user $newUserId")
            return RegisterResponse.newBuilder()
                .setSuccess(false)
                .setMessage("Registration failed: unable to process event")
                .build()
        }

        return RegisterResponse.newBuilder()
            .setSuccess(true)
            .setMessage("User registered successfully")
            .setUserId(newUserId)
            .build()
    }
}