var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var $ = require("jquery");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/redirect.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('move', function(data){
    console.log(data);
    io.emit('move', data);
  });
  console.log('a user connected: ' + socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
