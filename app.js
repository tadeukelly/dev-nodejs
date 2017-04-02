//*********************************//
//*** 		 Base SETUP         ***//
//*********************************//
var express 		= require("express");
var bodyParser  	= require('body-parser');
var morgan      	= require('morgan');  // log requests to the console (express4)
var passport 		= require('passport');
var session  		= require('express-session');
var mongoose 		= require('mongoose');
var favicon     = require('serve-favicon');
var db 				= require('./config/database');
var routes  		= require('./routes/index');
var user    		= require('./routes/user');
var api     		= require('./routes/api');
var app 			= express();
var http 			= require('http').createServer(app);
var io 				= require('socket.io').listen(http);
var mqtt      		= require('mqtt');
var url       		= require('url');
var port 			= process.env.PORT || 3000;


//*********************************//
//*** 	   Configure MQTT       ***//
//*********************************//
var deviceRoot		= "sensors/data";
var visitas 		= 0;
var collection,client;
//var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://arduino:arduino@m11.cloudmqtt.com:11962');
var mqtt_url = 'mqtt://arduino:arduino@m11.cloudmqtt.com:11962';
client  = mqtt.connect(mqtt_url);

//*********************************//
//*** 	 Configure Socket.io    ***//
//*********************************//
io.sockets.on('connection', function(socket){
  visitas++;	

  socket.emit('visitas', visitas);  
  socket.broadcast.emit('visitas', visitas);
  socket.broadcast.emit('chat message', 'Logged in : '+socket.handshake.address); 
  
  //GET MQTT MESSAGES
  client.subscribe(deviceRoot);
  client.on('message', function(topic, message) { 
	  console.log(topic + '--'+message);
  		socket.emit('mqtt', message);  
  });  	

  socket.on('chat message', function(nick, msg){    
    socket.emit('chat message', '('+nick+') '+msg);
    socket.broadcast.emit('chat message', '('+nick+') '+msg);
  });

  socket.on('disconnect', function(){
    visitas--;    
    socket.broadcast.emit('visitas', visitas);
    socket.broadcast.emit('chat message', 'Log out : '+socket.handshake.address);
  });

});



//*********************************//
//*** 	Define TEMPLATE ENGINE  ***//
//*********************************//
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//*********************************//
//*** 	  Define STATIC DIR     ***//
//*********************************//
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


//*********************************//
//*** Allow Read POST REQUESTS  ***//
//*********************************//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//*********************************//
//***    Configure Passport     ***//
//*********************************//
app.use(session({ secret: 'theozucoxexelentinhasecrettadeunewbabythanksgod', 
                 saveUninitialized: true,
                 resave: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

//*********************************//
//*** 	  Default Logging 		***//
//*********************************//
app.use(morgan('dev')); 	

//*********************************//
//*** 	Connect to Database    ***//
//*********************************//
mongoose.connect(db.url);

//*********************************//
//***    Apply Routes to App    ***//
//*********************************//
app.use('/user', user);
app.use('/api', api);
app.use('/', routes);

//*********************************//
//***       Create Server       ***//
//*********************************//
http.listen(port, function(){
	console.log("Listening on port " + port);
});

module.exports = app;
