var passport=require("passport");
var bcrypt=require("bcryptjs");
var User=require("../models/user");
var LocalStrategy = require('passport-local');
module.exports=function(){
passport.use(new LocalStrategy(
	function(username, password, done) {
	    User.findOne({ username: username }, function (err, user) {
	      if (err) { return done(err); }
	      if (!user) {
	        return done(null, false, { message: 'Incorrect username.' });
	      }
	      user.comparePassword(password,user.password,function(err,success){
	      	if(err) throw err;
	      	if(success){
	      		return done(null,user);
	      	}else{
	      		return done(null, false, { message: 'Incorrect password.' });		
	      	}

	      })
	    });
	  }
	));
}