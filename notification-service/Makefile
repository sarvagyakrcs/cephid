.PHONY: proto build clean

# Generate Go code from proto files
proto:
	@mkdir -p pb
	protoc --go_out=pb --go_opt=paths=source_relative \
		-I ../proto ../proto/onboarding.proto

# Build the binary (regenerates proto first)
build: proto
	go build -o notification-service .

clean:
	rm -f notification-service
	rm -f pb/*.pb.go
