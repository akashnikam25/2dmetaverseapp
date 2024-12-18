package server

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"time"

	"2dvideoapp/pkg/room"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

const proximityRadius = 50

type player struct {
	Type  string `json:"type"`
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Id    string `json:"id"`
	Anims string `json:"anims"`
}

type Meeting struct {
	Id           string
	Participants []string
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]player)
var meetings = make(map[string]*Meeting)

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

func calculateDistance(x1, y1, x2, y2 int) float64 {
	return math.Sqrt(math.Pow(float64(x2-x1), 2) + math.Pow(float64(y2-y1), 2))
}

func manageProximity(conn *websocket.Conn, res player) {
	playerId := res.Id
	updatedMeeting := false

	for _, meeting := range meetings {
		for _, participantID := range meeting.Participants {
			otherplayer := findPlayerByID(participantID)

			if otherplayer != nil && calculateDistance(res.X, res.Y, otherplayer.X, otherplayer.Y) > float64(proximityRadius) {
				meeting.Participants, updatedMeeting = removeParticipants(meeting.Participants, playerId)

				if len(meeting.Participants) == 1 {
					delete(meetings, meeting.Id)
				}
			}
		}
	}

	if !updatedMeeting {
		for client, otherPlayer := range clients {
			if client != conn && calculateDistance(res.X, res.Y, otherPlayer.X, otherPlayer.Y) <= float64(proximityRadius) {
				existingMeeting := findMeetingByParticipant(otherPlayer.Id)
				if existingMeeting != nil {
					for _, participant := range existingMeeting.Participants {
						if participant == playerId {
							return
						}
					}
					existingMeeting.Participants = append(existingMeeting.Participants, playerId)
				} else {
					meetingID := generateMeetingID()
					meetings[meetingID] = &Meeting{
						Id:           meetingID,
						Participants: []string{playerId, otherPlayer.Id},
					}
				}
				break
			}
		}
	}
	broadcastMeetings()
}

func findPlayerByID(id string) *player {
	for _, p := range clients {
		if p.Id == id {
			return &p
		}
	}
	return nil
}

func findMeetingByParticipant(playerId string) *Meeting {
	for _, meeting := range meetings {
		for _, participant := range meeting.Participants {
			if participant == playerId {
				return meeting
			}
		}
	}
	return nil
}

func removeParticipants(participants []string, playerId string) ([]string, bool) {
	for i, id := range participants {
		if id == playerId {
			return append(participants[:i], participants[i+1:]...), true
		}
	}
	return participants, false
}

func generateMeetingID() string {
	return fmt.Sprintf("meeting-%d", time.Now().UnixNano())
}

func broadcastMeetings() {
	for client := range clients {
		client.WriteJSON(map[string]interface{}{
			"type":     "meeting_update",
			"meetings": meetings,
		})
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
	res := player{}
	clients[conn] = res
	defer delete(clients, conn)

	// joinMessage := []byte(name + " has joined")
	// broadcastMessage(websocket.TextMessage, joinMessage)
	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			// leaveMessage := []byte(name + " has left")
			// broadcastMessage(websocket.TextMessage, leaveMessage)
			removeRsp := player{
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
			go manageProximity(conn, res)
		}

		if res.Type == "chat" {
			msg := name + ":" + string(data)
			go broadcastMessage(msgType, []byte(msg))
		}

	}
}
