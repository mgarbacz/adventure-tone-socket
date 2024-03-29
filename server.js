let app = require('http').createServer();

let io = require('socket.io')(app, {
  cors: {
    origin: ['http://localhost', 'http://10.0.0.239']
  }
});

let clicks = [];

let tones = io.of('/tones').on('connection', function(socket) {
  socket.on('greeting', function(data) {
    console.log(data);
    return socket.emit('greeting', {
      greeting: 'Hello client!'
    });
  });
  socket.emit('grid status', {
    clicks: clicks
  });
  return socket.on('grid click', function(data) {
    console.log(data);
    clicks.push(data);
    return socket.broadcast.emit('grid click', {
      element: data.element,
      sender: data.sender
    });
  });
});

app.listen(process.env.PORT || 8888);
