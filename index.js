var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/lobby.html');
});

io.on('connection', function(socket){
  console.log('A client connected');
  socket.on("")
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});
