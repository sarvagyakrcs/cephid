## cephid

### Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend (gRPC) | 9090 | localhost:9090 |
| Kafka (host) | 29094 | localhost:29094 |
| Kafka (internal) | 9094 | cephid-kafka:9094 |
| Kafka UI | 8080 | http://localhost:8080 |
| Notification Service | - | (Kafka consumer, no exposed port) |

### Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `RESEND_API_KEY` | notification-service | Resend API key for sending emails |

### Running

```bash
# Set your Resend API key
export RESEND_API_KEY=re_xxxxxxxxx

# Start all services
docker-compose up --build
```
