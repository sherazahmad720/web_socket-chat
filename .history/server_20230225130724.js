const io =reqire('socket.io')(8000)
const users={};
 io.on('connection',socket=>{
socket.on('new-user-Joined',name=>{
    users[socket.id]=name;
    socket.broadcast.emit('user-joined')
});
 });
