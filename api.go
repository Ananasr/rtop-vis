package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var tmpl *template.Template

func startApi() {
	r := mux.NewRouter()
	r.HandleFunc("/ui", webServer)
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	tmpl, _ = template.ParseFiles("tmpl/ui.html")
	log.Fatal(http.ListenAndServe(DEFAULT_WEB_ADDR, r))
}

func webServer(w http.ResponseWriter, r *http.Request) {
	if err := tmpl.Execute(w, allStats); err != nil {
		log.Print(err)
	}
	//fmt.Fprintf(w, "hello")
}
