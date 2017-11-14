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
	r.HandleFunc("/host/{hostname}/stats", getHost)
	r.HandleFunc("/hosts", getAllHosts)
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

// GET /host/<hostname>/stats : get all stats for one host
func getHost(w http.ResponseWriter, r *http.Request) {
	//log.Print("getHost")
	//vars := mux.Vars(r)
	//hostname := vars["hostname"]

	//if _, ok := allStats.Map[hostname]; ok {
	//	w.WriteHeader(http.StatusOK)
	//	sr := allStats.GetRing(hostname)
	//	json.NewEncoder(w).Encode(sr.Entries())
	//} else {
	//	w.WriteHeader(http.StatusNotFound)
	//	fmt.Fprintf(w, "Not existing host\n")
	//}
}

// GET /hosts : return all hosts names
func getAllHosts(w http.ResponseWriter, r *http.Request) {
	//log.Print("getAllHosts")

	w.WriteHeader(http.StatusOK)
	//json.NewEncoder(w).Encode(allStats.Keys())
}
