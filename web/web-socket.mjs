import WebSocket from 'ws';

const cacheWS = {single: null};

export const client = (url) => {
    // Create a WebSocket client
    const ws = new WebSocket('ws://' + url);
    // Handle messages from the server
    ws.on('message', function incoming(message) {
        console.log('Received from server: %s', message);
    });

    // Send a message to the server
    ws.send('Hello, server!');

    return ws;
}

export const server = ({ onmessage, onclose, ...serverOptions } = {}, name = 'single') => {
    if (cacheWS[name]) {
        return cacheWS[name];
    }

    const wss = new WebSocket.Server({port: 3006, serverOptions});
    cacheWS[name] = wss;
    
    const promise = new Promise((resolve, reject) => {
        wss.on('connection', function connection(ws, socket, request) {
            console.log('Client connected: %s', name);
            if (typeof onmessage === 'function') {
                ws.on("message", (message) => {
                    onmessage(message, ws);
                });
            }
            if (typeof onclose === 'function') {
                ws.on("close", (...params) => {
                    console.log("socket: client disconnected:", params);
                    onclose(message, ws);
                });
            }
            resolve(ws);
        });
        wss.on('error', (ws, error) => {
            console.error('wesocket error: %s', error.message);
            reject(error.message);
        });
        wss.on('close', (ws) => {
            delete promise.wss;
            delete cacheWS[name];
            console.log('wesocket close: %s', name);
        });
    });

    promise.wss = wss;

    return promise;
}

export default {
    client,
    server
}

// exports.createWS = (port = 3006) => {
//     const wss = new WebSocket.Server({ port });
//     return new Promise((resolve) => {
//         wss.on('connection', function connection(ws) {
//             console.log('Client connected');
//             resolve(ws);
//             // ws.on('message', function incoming(message) {
//             //   console.log('received: %s', message);
//             // });
          
//             // ws.send('Hello, client! Welcome to WebSocket server!');
//           });
//     });
// }

// exports.websockt = async (port) => {
//     const ws = await this.createWS(port);
//     return {
//         send: (data) => ws.send(data || 'Hello, client! Welcome to WebSocket server!'),
//         receive: (callback) =>  ws.on('message', function incoming(message) {
//             console.log('received: %s', message);
//             callback(message);
//         }) 
//     }
// }

