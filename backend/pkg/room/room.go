package room

import (
	"2dvideoapp/auth"
	"encoding/json"
	"net/http"
)

type response struct {
	Token string `json:"token,omitempty"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	name := r.URL.Query().Get("name")
	token := auth.GenerateJwt(name)
	res, err := json.Marshal(response{Token: token})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
	w.Write(res)

}
