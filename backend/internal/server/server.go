package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)

func Run() error {
	router := mux.NewRouter()

	router.HandleFunc("/publiclobby", createOrjoinPublicLobby).Methods(http.MethodGet)
	log.Println("Starting server on :8000...")
	return http.ListenAndServe(":8000", router)
}

func createOrjoinPublicLobby(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)

	//name := r.Header.Get("name")

	clients[conn] = true

	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			delete(clients, conn)
			return
		}
		clients[conn] = false
		for clientConn, flag := range clients {
			if flag {
				clientConn.WriteMessage(msgType, data)
			}
		}
		clients[conn] = true
	}
}
