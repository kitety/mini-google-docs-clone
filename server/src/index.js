var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

app.get('/', (req, res) => {
  res.sendFile('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  socket.on('new-operations', (data) => {
    io.emit('new-remote-operations', data);
  });
});

http.listen(4000, () => {
  console.log('listening on *:4000');
});
