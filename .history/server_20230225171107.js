const io = require('socket.io')(8000);

const rooms = {
    general: [],
    coding: [],
    issues: []
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
        rooms[roomName].push({ id: socket.id, name: userName });
        socket.join(roomName);
        console.log(`${userName} joined room ${roomName}`);
        socket.emit('joinedRoom', roomName);
        io.in(roomName).emit('userJoined', userName);
    });

    // remove user from room
    socket.on('leaveRoom', (roomName) => {
        // get user name from rooms object
        const userName = rooms[roomName].find((user) => user.id === socket.id).name;
        // remove user from room
        rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
        socket.leave(roomName);
        console.log(`${userName} left room ${roomName}`);
        io.in(roomName).emit('userLeft', userName);
    });

    // send message to room
    socket.on('sendMessage', (message) => {
        // get room name where user is present
        const roomName = Object.keys(rooms).find((room) => rooms[room].find((user) => user.id === socket.id));
        // get user name from rooms object
        const userName = rooms[roomName].find((user) => user.id === socket.id).name;
        console.log(`${userName} sent message to room ${roomName}: ${message}`);
        io.in(roomName).emit('message', { userName, message });
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // const roomName = Object.keys(rooms).find((room) => rooms[room].find((user) => user.id === socket.id));
        // // get user name from rooms object
        // const userName = rooms[roomName].find((user) => user.id === socket.id).name;
        // remove user from all rooms
        Object.keys(rooms).forEach((roomKey) => {
            let userName = '';
            const user = rooms[roomKey].find((user) => user.id === socket.id);
            if (!user) {
                return;
            }
            rooms[roomKey] = rooms[roomKey].filter((id) => id !== socket.id);
            //get user name from rooms object
            io.in(roomKey).emit('userLeft', userName.name);
        });
    });
});

