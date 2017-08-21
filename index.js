var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ private_keys: [] })
  .write()

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
function genPrivateKey() {
  return Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0];
}
function genPubKey() {
  return Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0] + Math.round(Math.random() * 10).toString().split("")[0];
}
io.on('connection', function(socket){
  console.log('A client connected');
  socket.on("connect-as-master", function (params) {
    if (params.key == undefined) {
      params.key = genPrivateKey();
      db.get("private_keys").push({
        priv: params.key,
        pub: genPubKey()
      }).write()
    }
    console.log(db.get("private_keys").find({priv: params.key}).value())
  })
  socket.on("connect-as-slave", function (params) {
    if (db.get("private_keys").find({pub: params.key}).value() === undefined) {
      socket.emit("invalid-public-key", ":-(")
      socket.disconnect(true)
    } else {
      socket.join(params.key, () => {
        socket.emit("joined-ya", ":-)")
      })
    }
  })
  socket.on("cue", function (params) {
    if (db.get("private_keys").find({priv: params.key}).value() === undefined) {
      socket.emit("invalid-public-key", ":-(")
      socket.disconnect(true)
    } else {
      var pubkey = db.get("private_keys").find({priv: params.key}).value().pub;
      params.key = undefined;

      io.to(pubkey).emit("display-text", params)
    }
  })
  //socket.on("debug-send", function (params) {
  //  io.to(params[0]).emit(params[1], params[2])
  //})
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});
