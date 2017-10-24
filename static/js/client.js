$(function() {
    var laDictGraph = {}; // Dict. of Load Average graphs
    var memDictGraph = {}; // Dict. of Memory graphs
    var cpuDictGraph = {}; // Ditc. of CPU graphs

    // let's get first the hosts list
    $.ajax({
        url: 'http://localhost:8080/hosts',
        type: 'GET',
        data: {},
        dataType: 'json'
    }) // when it's done, get hosts's stats
        .done(function(data) {
            var hosts = data;

            for (var i = 0; i < hosts.length; i++) {
                var host = hosts[i];
                getStats(host, function(data) {
                    var loadAverageGraph = new Dygraph(
			                  document.getElementById("id-" + data[0].Hostname),
			                  getLoadAverage(data),
			                  {
				                    title: data[0].Hostname,
				                    axisLabelFontSize: 10,
				                    axes: { y: { axisLabelWidth: 30 } },
				                    labels: [ "X", "Load Average" ],
          		              gridLineColor: 'rgb(200,200,200)'
			                  });

                    var memGraph = new Dygraph(
			                  document.getElementById("mid-" + data[0].Hostname),
			                  getMemory(data),
			                  {
				                    title: data[0].Hostname,
				                    axisLabelFontSize: 10,
				                    axes: { y: { axisLabelWidth: 30 } },
				                    labels: [ "X", "cached", "buffers", "free", "used" ],
          		              labelsKMG2: true,
				                    stackedGraph: true,
          		              gridLineColor: 'rgb(200,200,200)'
			                  });

                    var cpuGraph = new Dygraph(
			                  document.getElementById("cpu-" + data[0].Hostname),
			                  getCPU(data),
			                  {
				                    title: data[0].Hostname,
				                    axisLabelFontSize: 10,
				                    axes: { y: { axisLabelWidth: 30 } },
				                    labels: [ "X", "user", "nice", "system", "idle", "iowait", "irq", "softir", "steal", "guest" ],
				                    stackedGraph: true,
          		              gridLineColor: 'rgb(200,200,200)'
			                  });

                    laDictGraph[data[0].Hostname] = loadAverageGraph;
                    memDictGraph[data[0].Hostname] = memGraph;
                    cpuDictGraph[data[0].Hostname] = cpuGraph;
                });
            }

            window.intervalId = setInterval(function() {
                for (var i = 0; i < hosts.length; i++) {
                    var host = hosts[i];
                    getStats(host, function(data) {
                        laDictGraph[data[0].Hostname].updateOptions({'file': getLoadAverage(data)});
                        memDictGraph[data[0].Hostname].updateOptions({'file': getMemory(data)});
                        cpuDictGraph[data[0].Hostname].updateOptions({'file': getCPU(data)});
                    });
                }
            }, 1000);
        })
        .fail(function(xhr) {
            console.log('error', xhr);
        });

    function getStats(hostId, onSuccess) {
        $.ajax({
            url: 'http://localhost:8080/host/' + hostId + '/stats',
            type: 'GET',
            data: {},
            dataType: 'json',
            success: onSuccess,
            error: function(err) { console.log(err); }
        });
    }

    function getLoadAverage(stats) {
        var loadAverage = [];

        for (var i = 0; i < stats.length; i++) {
            date = new Date(stats[i].At);
            loadAverage.push([date, stats[i].Load1]);
        }

        return loadAverage;
    }

    function getMemory(stats) {
        var memory = [];

        for (var i = 0; i < stats.length; i++) {
            date = new Date(stats[i].At);
            memory.push([date,
                         stats[i].MemCached,
                         stats[i].MemBuffers,
                         stats[i].MemFree,
                         stats[i].MemUsed]);
        }

        return memory;
    }

    function getCPU(stats) {
        var cpu = [];

        for (var i = 0; i < stats.length; i++) {
            date = new Date(stats[i].At);
            cpu.push([date,
                      stats[i].CPU.User,
                      stats[i].CPU.Nice,
                      stats[i].CPU.System,
                      stats[i].CPU.Idle,
                      stats[i].CPU.Iowait,
                      stats[i].CPU.Irq,
                      stats[i].CPU.SoftIrq,
                      stats[i].CPU.Steal,
                      stats[i].CPU.Guest]);
        }

        return cpu;
    }
});
