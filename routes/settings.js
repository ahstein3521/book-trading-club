var User=require("../models/user");

module.exports=function(app){
	app.get("/settings",function(req,res){
		if(!req.user) return res.redirect("/");
		res.render("settings",{user:req.user})
	})

	app.put("/settings",function(req,res){
		var body=req.body;
		User.findByIdAndUpdate({_id:req.user._id},{$set:{username:body.username,location:body.location}},function(e,d){
			if(e) throw e;

			req.user.username=d.username;
			req.user.location=d.location;
			res.redirect(303,"/")
		})
		
	})
}