package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"2dvideoapp/pkg/room"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type wsData struct {
	Type         string   `json:"type"`
	X            int      `json:"x"`
	Y            int      `json:"y"`
	Id           string   `json:"id"`
	Anims        string   `json:"anims"`
	Participants []string `json:"participants"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]wsData)

func Run() error {
	router := mux.NewRouter()
	router.HandleFunc("/publiclobby", createOrjoinPublicLobby).Methods(http.MethodGet)
	router.HandleFunc("/room", room.JoinRoom).Methods(http.MethodGet)
	log.Println("Starting server on :8000...")
	return http.ListenAndServe(":8000", router)
}

func broadcastMessage(msgType int, message []byte) {

	for client := range clients {
		client.WriteMessage(msgType, message)
	}
}

func addNewUser(msgType int, message []byte, conn *websocket.Conn) {

	for client, res := range clients {
		if client != conn {
			res.Type = "add"
			jsonRsp, err := json.Marshal(res)
			if err != nil {
				log.Panic(err)
			}
			fmt.Println("json rsp", string(jsonRsp))
			err = conn.WriteMessage(msgType, jsonRsp)
			if err != nil {
				fmt.Println("errr ", err)
			}
		}
	}

	for client := range clients {
		if client != conn {
			client.WriteMessage(msgType, message)
		}
	}
}

func meeting(msgType int, message []byte, conn *websocket.Conn) {
	for client := range clients {
		if client != conn {
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
	res := wsData{}
	clients[conn] = res
	defer delete(clients, conn)

	// joinMessage := []byte(name + " has joined")
	// broadcastMessage(websocket.TextMessage, joinMessage)
	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			// leaveMessage := []byte(name + " has left")
			// broadcastMessage(websocket.TextMessage, leaveMessage)
			removeRsp := wsData{
				Type: "remove",
				X:    clients[conn].X,
				Y:    clients[conn].Y,
			}

			jsonRsp, err := json.Marshal(removeRsp)
			if err != nil {
				log.Panic(err)
			}

			for client := range clients {
				if client != conn {
					err = client.WriteMessage(websocket.TextMessage, jsonRsp)
					if err != nil {
						log.Panic(err)
					}
				}
			}
			return
		}
		res = clients[conn]
		err = json.Unmarshal(data, &res)
		if err != nil {
			log.Panic(err)
		}
		clients[conn] = res

		fmt.Println("response ", res)

		if res.Type == "add" {
			go addNewUser(msgType, data, conn)
		}

		if res.Type == "move" {
			broadcastMessage(msgType, data)
		}

		if res.Type == "chat" {
			msg := name + ":" + string(data)
			broadcastMessage(msgType, []byte(msg))
		}
		if res.Type == "CreateMeeting" || res.Type == "AddParticipantInMeeting" || res.Type == "RemoveParticipantFromMeeting" {
			meeting(msgType, data, conn)
		}

	}
}
