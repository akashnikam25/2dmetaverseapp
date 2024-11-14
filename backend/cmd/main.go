package main

import (
	"2dvideoapp/internal/server"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	if err := server.Run(); err != nil {
		log.Fatalln(err.Error())
	}
}
