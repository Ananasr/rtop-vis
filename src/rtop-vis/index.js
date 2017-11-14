document.addEventListener('DOMContentLoaded', function() {
             var ws;
             var stats = {};

             if (window.WebSocket === undefined) {
                 console.log("Your browser does not support WebSockets");
                 return;
             } else {
                 ws = initWS();
             }

             function initWS() {
                 var socket = new WebSocket("ws://localhost:8080/ws");
                 socket.onopen = function() {
                     console.log("Socket is open");
                 };
                 socket.onmessage = function (e) {
                     var data = JSON.parse(e.data);
                     process(data);
                     updateView();
                 };
                 socket.onclose = function () {
                     console.log("Socket closed");
                 };

                 return socket;
             }

             //
             function process(data) {
                 var hostname = data.Hostname;

                 if (!stats[hostname]) {
                    // create a new div
                    var div = document.createElement("div");
                    // set id attribute
                    div.setAttribute("id", "id-" + hostname);
                    // append the div to the body
                    document.body.appendChild(div);
                    // create a new Load Average graph for this div
                    var graph = new Dygraph(document.getElementById("id-" + hostname), [[ new Date(data.At), Number(data.Load1)]], {
                        title: hostname + "-graph",
                        axisLabelFontSize: 10,
                        axes: { y: { axisLabelWidth: 30 } },
                        labels: [ "X", "Load Average" ],
                        gridLineColor: 'rgb(200,200,200)',
                    });
                    // create a new entry HOST(GRAPH, DIV, STATS)
                    stats[hostname] = { "graph": graph, "div": div, "stats": [data] };
                 } else {
                    // push last stats for the host
                    stats[hostname].stats.push(data);
                 }
             };

             //
             function updateView() {
                // for each host
                Object.keys(stats).forEach(function(key) {
                        // get the stats array
                        var val = stats[key];
                        // get the last stats
                        var lastStats = val.stats[val.stats.length - 1];
                        // get the div
                        var div = document.getElementById(val.div.id);
                        // update graph value
                        var test = val.stats.map(function(e) {
                                return [new Date(e.At), Number(e.Load1)];
                        });
                        val.graph.updateOptions( { 'file': test } );
                });
             };
         });
