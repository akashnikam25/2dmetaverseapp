package server

import (
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

func broadcastMessage(sender *websocket.Conn, msgType int, message []byte) {
	for client := range clients {
		if client != sender {
			client.WriteMessage(msgType, message)
		}
	}
}

func createOrjoinPublicLobby(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	clients[conn] = true
	defer delete(clients, conn)

	joinMessage := []byte(name + " has joined")
	broadcastMessage(conn, websocket.TextMessage, joinMessage)

	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			leaveMessage := []byte(name + " has left")
			broadcastMessage(conn, websocket.TextMessage, leaveMessage)
			return
		}

		broadcastMessage(conn, msgType, data)
	}
}
