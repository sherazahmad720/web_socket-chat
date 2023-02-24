const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (ws) => {
  console.log('new client connected');

  ws.send('Welcome to the chat app! Please enter your name:');

  let username;
  ws.on('message', (message) => {
    if (!username) {
      // If the user hasn't entered their name yet, set it and add them to the client set
      username = message;
      clients.add(ws);
      console.log(`User ${username} joined the chat.`);
      ws.send(`Welcome to the chat, ${username}!`);
    } else {
      // Broadcast the message to all connected clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${username}: ${message}`);
        }
      });
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    clients.forEach((client)=>{
        ws.send(`${username} left the chat`)
    })
    console.log(`User ${username} left the chat.`);
  });
});
