package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"cephid/notification-service/pb"

	"github.com/resend/resend-go/v3"
	"github.com/segmentio/kafka-go"
	"google.golang.org/protobuf/proto"
)

func main() {
	kafkaBroker := getEnv("KAFKA_BOOTSTRAP_SERVERS", "localhost:29094")
	resendAPIKey := os.Getenv("RESEND_API_KEY")

	if resendAPIKey == "" {
		log.Fatal("RESEND_API_KEY environment variable is required")
	}

	resendClient := resend.NewClient(resendAPIKey)

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{kafkaBroker},
		Topic:    "user_registered",
		GroupID:  "notification-service",
		MinBytes: 1,
		MaxBytes: 10e6,
	})
	defer reader.Close()

	log.Printf("Notification service started, consuming from %s", kafkaBroker)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigChan
		log.Println("Shutting down...")
		cancel()
	}()

	for {
		msg, err := reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				break
			}
			log.Printf("Error reading message: %v", err)
			continue
		}

		event := &pb.UserRegisteredEvent{}
		if err := proto.Unmarshal(msg.Value, event); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		log.Printf("Received event: userId=%s, email=%s", event.GetUserId(), event.GetEmail())

		err = sendWelcomeEmail(resendClient, event.GetEmail(), event.GetUserId())
		if err != nil {
			log.Printf("Error sending email: %v", err)
			continue
		}

		log.Printf("Welcome email sent to %s", event.Email)
	}
}

func sendWelcomeEmail(client *resend.Client, toEmail, userId string) error {
	params := &resend.SendEmailRequest{
		From:    "Cephid <onboarding@resend.dev>",
		To:      []string{toEmail},
		Subject: "Welcome to Cephid!",
		Html: fmt.Sprintf(`
			<h1>Welcome to Cephid!</h1>
			<p>Thank you for registering. Your user ID is: <strong>%s</strong></p>
			<p>We're excited to have you on board!</p>
		`, userId),
	}

	_, err := client.Emails.Send(params)
	return err
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
