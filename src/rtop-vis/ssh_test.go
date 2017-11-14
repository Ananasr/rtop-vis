package main_test

import (
	"log"
	"testing"
	r "rtop-vis"
)

func TestSshConnection(t *testing.T) {
	client := r.SshConnect("root", "10.5.2.117:22", "")
	if client == nil {

		log.Print("client is nil")
		return
	}

	stdout, err := r.RunCommand(client, "ls -l")
	if err != nil {
		log.Print(err)
	}

	log.Print(stdout)
}
