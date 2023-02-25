const io = require('socket.io')(8000);

const rooms = {
    general:[],
    coding:[],
    issues:[]
}; // initialize rooms object

io.on('connection', (socket) => {
  console.log('new user connected');

  // send list of rooms to user
  socket.emit('roomList', Object.keys(rooms));

  // add user to room
  socket.on('joinRoom', (roomName, userName) => {
    // create room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }
    // add user to room
    rooms[roomName].push(socket.id);
    socket.join(roomName);
    console.log(`${userName} joined room ${roomName}`);
    socket.emit('joinedRoom', roomName);
    io.in(roomName).emit('userJoined', userName);
  });

  // remove user from room
  socket.on('leaveRoom', (roomName, userName) => {
    // remove user from room
    rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
    socket.leave(roomName);
    console.log(`${userName} left room ${roomName}`);
    io.in(roomName).emit('userLeft', userName);
  });

  // send message to room
  socket.on('sendMessage', (roomName, message, userName) => {
    console.log(`${userName} sent message to room ${roomName}: ${message}`);
    io.in(roomName).emit('message', { userName, message });
  });

  // disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    // remove user from all rooms
    Object.keys(rooms).forEach((roomName) => {
      rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
      io.in(roomName).emit('userLeft', users[socket.id]);
    });
  });
});

