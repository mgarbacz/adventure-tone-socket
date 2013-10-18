// Generated by CoffeeScript 1.6.3
(function() {
  var app, clicks, io, tones;

  app = require('http').createServer();

  io = require('socket.io').listen(app);

  clicks = [];

  tones = io.of('/tones').on('connection', function(socket) {
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

}).call(this);
