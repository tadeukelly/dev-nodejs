var express 		= require('express');
var router 			= express.Router();
var fortune 		= require('../lib/fortune');

router.get('/', function(req, res) {	
	 //res.sendFile('/home/tadeukelly/dev/angularjs/dev-nodejs/public/index.html'); //uncomment for local
	 res.sendFile('/app/public/index.html'); //uncomment for heroku
});

router.post('/post',function(req,res){
	res.render("post", {nome: req.body.nome});	
});

router.get('/about*', function(req, res){
	res.render("about", {title:fortune.getFortune()});	
});

router.get('/home',function(req,res){
	res.render("home");	
});

// custom 404 page
router.use(function(req, res){
	res.status(404);
	res.render("404");
});

// custom 500 page
router.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render("500");
});


module.exports = router;