var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
app.set('views', __dirname + '/html');

const njk = expressNunjucks(app, {
    watch: true,
    noCache: true
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/lobby.html');
});

app.get("/master/", function (req, res) {
  res.render("master.html", {publicpin: 123456})
})
app.get("/slave/", function (req, res) {
  res.render("slave.html", {publicpin: 123456})
})
app.use(require("express").static('static'))

io.on('connection', function(socket){
  console.log('A client connected');
  socket.on("")
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});
