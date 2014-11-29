var express 		= require('express');
var router 			= express.Router();
var fortune 		= require('../lib/fortune');

router.get('/', function(req, res) {	
	 //res.sendFile('/home/tadeukelly/dev/angularjs/node-dashboard/public/app.html');		 
	 res.sendFile('/app/public/app.html');
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