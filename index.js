var http = require('http');
var express = require('express')
var app = express()
var url = require('url');
var path = require("path");
var cons = require('consolidate');
var atpl = require('atpl');
var md5 = require('md5');
app.use(express.static('game'));

app.get('/', function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    
    cons.atpl('index.html', {  }, function(err, html){
      if (err) throw err;
      res.end(html);
    });
});
app.listen(80, function () {
  console.log('Example app listening on port 3000!')
})

var server = http.createServer(function(request, response) {});


server.listen(1234, function() {
    console.log(' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});
var count = 0;
var clients = {};
var Players = {};
function randNumber(max,min){
  return Math.floor((Math.random()*max))+min;
}
wsServer.on('request', function(r){

    var connection = r.accept('echo-protocol', r.origin);

    // Specific id for this client & increment count
    var id = md5((count++)+(new Date().getTime())).substring(0, 3);

    // Store the connection method so we can loop through & contact all clients
    clients[id] = connection;



    // Create event listener
    connection.on('message', function(message) {

        // The string message that was sent to us
        var msgString = message.utf8Data;

        var msg = JSON.parse(msgString);
        
        if(msg.msg=="recivedShot"){
            var tank = msg.payload;
            for(var i in clients){
                clients[i].sendUTF(JSON.stringify(msg));
            }
            return ;
        }
        if(msg.msg=="updateTankAr"){
            var tank = msg.payload;
            for(var i in clients){
                clients[i].sendUTF(JSON.stringify(msg));
               
            }
            return ;
        }
        if(msg.msg=="CreateNewPlayer"){
            if(Players[id]==null){
                Players[id] = {
                    'name':msg.payload.name,
                    'teamID':msg.payload.teamID,
                    'health':100,
                    'KillCount':0,
                    'x':randNumber(20,0),
                    'z':randNumber(20,0),
                    'UID':id
                }
            }
            msg.payload = Players[id];
            clients[id].sendUTF(JSON.stringify(msg));
            
        }
        if(msg.msg=="CreateOrUpdateTank"){
            var tank = msg.payload;
            for( t in Players){
                if(Players[t].UID==tank.UID){
                    Players[t] = tank;
                    break;
                }
            }
        }
        msg.msg = "CreateOrUpdateTank";


        for(var i in clients){
            for(var ip in Players){
                if(Players[ip]!=null && i!=ip){
                    msg.payload = Players[ip];
                    clients[i].sendUTF(JSON.stringify(msg));
                }
            }
            
        }

    });


    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        
    });
});