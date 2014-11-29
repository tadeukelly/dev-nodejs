var express     = require("express");
var router      = express.Router();
var passport    = require('passport');


router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {      
      return res.send({ status: "failed", message: err.message});
    }
    else if (!user) {
      return res.send({ status: "failed", message: info.message});
    }
    else {
      req.logIn(user, function(err) {
        if (err) return res.send({ status: "failed", message: err.message});
        //res.cookie('user', user);
        return res.send({ status: "success", user: user });
      });
    }
  })(req, res, next);
});



router.get('/isloggedin', function(req, res, next) {  
  if (req.isAuthenticated()) {
    var authenticatedUser = {
      _id: req.user._id, 
      username: req.user.username
    }    
    return res.send({ status: "success", user: authenticatedUser });
  } else {
    return res.send({ status: "failed" });
  }
});



router.post('/signup',
    passport.authenticate('local-signup'),
    function(req, res) {     
    res.json(req.user);    
});



router.get('/logout', function(req, res) {
    req.logout();    
    res.redirect('/');
});


module.exports = router;