var User=require("../models/user");
var passport=require("passport");

module.exports=function(app){	
	app.get("/signup",function(req,res){
		res.render("signup");
	})
	
	app.get("/signin",function(req,res){
		res.render("signin");
	})

	app.post("/signup",function(req,res){
		var $=req.body;
		req.checkBody("username","Please enter a username").notEmpty()
		req.checkBody("email","Please enter an email").notEmpty();
		req.checkBody("email","Email is improperly formatted.").isEmail()
		req.checkBody("password","Please enter a password").notEmpty()
		req.checkBody("password_confirm","Passwords must match").equals(req.body.password);

		if(req.validationErrors()){
			return res.render("signup",{errors:req.validationErrors()})
		}
		else{
			var user=new User({username:$.username,password:$.password,email:$.email});
			
			user.register(user,function(err,data){
				if(err) throw err;
			})

			req.flash("success_msg","Thank you for registering.");
			res.redirect("/");
		}
		
	})

	app.post('/signin', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/signin',failureFlash: true  }));
	app.get("/logout",function(req,res){
  		req.logOut();
  		res.redirect("/")
  	})
}