FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install protoc and protoc-gen-go
RUN apk add --no-cache protobuf protobuf-dev
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# Copy proto files
COPY proto/ /proto/

# Copy go module files and download dependencies
COPY notification-service/go.mod notification-service/go.sum* ./
RUN go mod download

# Copy source code
COPY notification-service/ .

# Generate protobuf code
RUN mkdir -p pb && protoc --go_out=pb --go_opt=paths=source_relative \
    -I /proto /proto/onboarding.proto

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-service .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /app/notification-service .

CMD ["./notification-service"]
