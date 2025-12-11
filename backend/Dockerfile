FROM gradle:8.11-jdk17 AS builder
WORKDIR /app
COPY backend/ .
COPY proto/ ../proto/
RUN gradle build -x test --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
