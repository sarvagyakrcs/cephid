package org.example.cephid

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder

@Configuration
class KafkaConfig {

    @Bean
    fun userRegisteredTopic(): NewTopic {
        return TopicBuilder.name("user_registered")
            .partitions(1)
            .replicas(1)
            .build()
    }
}
