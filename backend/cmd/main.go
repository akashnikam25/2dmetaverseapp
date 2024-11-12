package main

import (
	"2dvideoapp/internal/server"
	"fmt"
	"log"
	"net/http"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	fmt.Println("hello world")
	str := "inside from handlerequest"
	w.Write([]byte(str))

}
func main() {
	if err := server.Run(); err != nil {
		log.Fatalln(err.Error())
	}
}
