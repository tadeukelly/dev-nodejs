// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt          = require('bcrypt');
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({ passReqToCallback: true },
      function(req, username, password, done) {     
        User.findOne({ 'username': username }, function (err, user) {          
          if (err)            
             return done(err, false, { message: 'Erro de Processamento!' });         
          if (!user)            
            return done(null, false, { message: 'Usuário não encontrado!' });
          if (user){
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false, { message: 'Senha incorreta!' }); 
            user.password = null;            
            return done(null, user);
          }          
        });
      }
    ));


    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        User.findOne({ 'username' :  username }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, { message: 'Usuário já existente!' });
            } else {
                var newUser            = new User();
                newUser.username       = username;
                newUser.password       = bcrypt.hashSync(password, 10);        
                newUser.save(function(err) {
                    if (err)                        
                        return done(err, false, { message: 'Erro criando usuário!' });         
                    newUser.password = null;
                    return done(null, newUser);
                });
            }

        });

    }));
};