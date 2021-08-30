const express = require('./config/express');
const {logger} = require('./config/winston');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client.html');
});

let count=1;
io.on('connection', function(socket){
    console.log('user connected: ', socket.id);
    let name = "user" + count++;
    io.to(socket.id).emit('change name',name);

    socket.on('disconnect', function(){
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', function(name,text){
        let msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

http.listen(3000, function(){ //4
    console.log('server on!');
});