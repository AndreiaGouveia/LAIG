class Server {

    constructor(port) {
        this.defaultPort = 8081;
        this.port = port || this.defaultPort;
    }

    getPrologRequest(requestString, onSuccess, onError) {

        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);

        request.onload = onSuccess || function(data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function() { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}