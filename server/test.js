import httpServe from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io";

var app = express() 

// var app = require('express')();
var http = httpServe.Server(app);
var io = socketio(http);

app.get('/', function(req, res){
   res.sendFile('E:/test/index.html');
});
   
io.on('connection', function(socket){
   console.log('A user connected');
   // Send a message when
//    setTimeout(function(){
      // Sending an object when emmiting an event
      socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});
//    }, 4000);
socket.on('clientEvent', function(data){
    console.log(data);
 });

 socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  
socket.on('disconnect', function () {
    console.log('A user disconnected');
});
});
http.listen(3001, function(){
   console.log('listening on localhost:3000');
});