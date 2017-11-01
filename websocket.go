package main

import (
	"fmt"
	"io/ioutil"

	"github.com/gorilla/websocket"
	//"io"
	"net/http"
)

type msg struct {
	Num int
}

func startWS() {
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/", rootHandler)

	panic(http.ListenAndServe(":8080", nil))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	content, err := ioutil.ReadFile("index.html")
	if err != nil {
		fmt.Println("Could not open file.", err)
	}
	fmt.Fprintf(w, "%s", content)
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("connected")

	conn, err := websocket.Upgrade(w, r, w.Header(), 1024, 1024)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
	}

	go writeStats(conn)
}

func writeStats(conn *websocket.Conn) {
	for stats := range allStats {
		fmt.Println(stats)
		if err := conn.WriteJSON(stats); err != nil {
			fmt.Println(err)
		}
	}
	//for {
	//	m := msg{}

	//	err := conn.ReadJSON(&m)
	//	if err != nil {
	//		if websocket.IsCloseError(err, websocket.CloseGoingAway) || err == io.EOF {
	//			fmt.Println("Websocket closed!")
	//			break
	//		}
	//		fmt.Println("Error reading json.", err)
	//	}

	//	fmt.Printf("Got message: %#v\n", m)

	//
	//}
}
