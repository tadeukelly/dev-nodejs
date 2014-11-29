var express     = require("express");
var router      = express.Router();
var Menu        = require('../models/menu');
var BusOrg      = require('../models/table_bus_org');


router.get("/menu", isLoggedIn, function(req, res){	
	Menu.find(function(err, menus) {
			if (err){
				res.send(err);
			}			
			res.json(menus);
		});

});

router.get("/org/:name", isLoggedIn, function(req, res){	
	BusOrg.find({ 'name': new RegExp(req.params.name, 'i')},{},{ limit: 20 },function(err, organizacao) {				
			if (err){
				console.log(err);
				res.send(err);
			};			
			res.json(organizacao);
		});	
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {        
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
};

module.exports = router;