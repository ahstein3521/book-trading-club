var Book=require("../models/book");
var Trade=require("../models/trade");

module.exports=function(app){

	app.get("/",function(req,res){
		if(!req.user){
			return res.render("home", {title:"HOME"});
		}
			
		Book.find({owner:req.user._id},function(err,d){
			if(err) throw err;
			req.session.books=d;
			res.render("home",{title:req.user.username, user:req.user, books:d});
		})	
	})
	
	app.use("/messages",function(req,res,next){
		if(!req.user) return res.redirect("/");
		
		Trade.getUsersTrades(req.user._id,function(e,results){

			req.user.messages=results;
			next();
		})
	})
	
	app.get("/messages",function(req,res){
		var msg=req.user.messages;
		res.render("mailbox",{user:req.user,inbox:msg.inbox,outbox:msg.outbox})
	})

	app.get("/browse",function(req,res){
		var user=req.user? req.user._id : null;

		Book.find({owner:{$ne: user}},function(e,d){
			res.render("browse",{title:"Browse",user:req.user,books:d});
		})
	})

}