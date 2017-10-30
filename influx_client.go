package main

import (
	"log"

	"github.com/influxdata/influxdb/client/v2"
)

func ExampleNewClient() {
	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr: "http://influxdb:8086",
		//Username: username,
		//Password: password,
	})
	if err != nil {
		log.Fatal("err", err)
	}

	// Create a new point batch
	bp, err := client.NewBatchPoints(client.BatchPointsConfig{
		Database:  "rtop",
		Precision: "s",
	})
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		log.Println("toto")
		for stat := range allStats {
			host := stat.Hostname
			log.Println(host)
			// Create a point and add to batch
			tags := map[string]string{
				"cpu":  "cpu-total",
				"host": host,
			}

			fields := map[string]interface{}{
				"idle":   stat.CPU.Idle,
				"system": stat.CPU.System,
				"user":   stat.CPU.User,
			}

			pt, err := client.NewPoint("cpu_usage", tags, fields, stat.At)
			if err != nil {
				log.Fatal(err)
			}
			bp.AddPoint(pt)

			// Write the batch
			if err := c.Write(bp); err != nil {
				log.Fatal("err::", err)
			}
		}
	}()
}
