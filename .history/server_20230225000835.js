const websocket = require('ws');
const server = new websocket.Server({ port: 8080 });
server.on('connection', (ws) => {
    console.log('new client connected');
    ws.send('Welcome to server!');

    ws.on("message",(msg)=>{
        ws.send(`your message is ${msg}`);
    })
     
});