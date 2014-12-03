var app 		  = require('express')();
var http 		  = require('http').Server(app);
var io 			  = require('socket.io')(http);
var mqtt      = require('mqtt');
var url       = require('url');
var deviceRoot="sensors/data/";
var collection,client;

/*
app.get('/', function(req, res){
  res.sendFile('/home/tadeukelly/dev/nodejs/cloudmqtt/example2/index.html');
});
*/


//MQTT CONFIG
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://arduino:arduino@m11.cloudmqtt.com:14017');
var auth = (mqtt_url.auth || ':').split(':');
client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
    username: auth[0],
    password: auth[1]
});

//SOCKET.IO CONFIG
io.on('connection', function(socket){
  visitas++;	

  socket.emit('visitas', visitas);  
  socket.broadcast.emit('visitas', visitas);
  socket.broadcast.emit('chat message', 'Log in : '+socket.handshake.address); 
        
  client.subscribe(deviceRoot+"+");
  client.on('message', function(topic, message) {  		
  		socket.emit('chat message', 'MQTT Message. [topic]='+topic+' [message]='+message);  
  });  	

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    visitas--;    
    socket.broadcast.emit('visitas', visitas);
    socket.broadcast.emit('chat message', 'disconnect');
  });

});

/*
http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/