const WebSocket = require('ws');


exports.createWS = (port = 3006) => {
    const wss = new WebSocket.Server({ port });
    return new Promise((resolve) => {
        wss.on('connection', function connection(ws) {
            console.log('Client connected');
            resolve(ws);
            // ws.on('message', function incoming(message) {
            //   console.log('received: %s', message);
            // });
          
            // ws.send('Hello, client! Welcome to WebSocket server!');
          });
    });
}

exports.websockt = async (port) => {
    const ws = await this.createWS(port);
    return {
        send: (data) => ws.send(data || 'Hello, client! Welcome to WebSocket server!'),
        receive: (callback) =>  ws.on('message', function incoming(message) {
            console.log('received: %s', message);
            callback(message);
        }) 
    }
}

