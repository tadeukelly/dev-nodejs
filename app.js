//*********************************//
//*** 		 Base SETUP         ***//
//*********************************//
var express 		= require("express");
var bodyParser  	= require('body-parser');
var morgan      	= require('morgan');  // log requests to the console (express4)
var passport 		= require('passport');
var session  		= require('express-session');
var mongoose 		= require('mongoose');
var db 				= require('./config/database');
var routes  		= require('./routes/index');
var user    		= require('./routes/user');
var api     		= require('./routes/api');
var app 			= express();
var port 			= process.env.PORT || 3000;

//*********************************//
//*** 	Define TEMPLATE ENGINE  ***//
//*********************************//
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//*********************************//
//*** 	  Define STATIC DIR     ***//
//*********************************//
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
app.listen(port, function(){
	console.log("Listening on port " + port);
});

module.exports = app;