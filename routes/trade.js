var Trade=require("../models/trade");

module.exports=function(app){
	app.post("/request",function(req,res){
		var trade=new Trade({bookWanted:req.query.for,
							 bookOffered:req.body.book,
							 userOutbox:req.user._id,
							 userInbox:req.query.owner
							});
		trade.save();

		res.redirect("/browse");
	})

	app.put("/trade",function(req,res){
		var id=req.query.id;
		var body=req.body;
		var userAccepted=body.hasOwnProperty("accept");

		Trade.findOne({_id:req.query.id},function(e,trade){
			if(userAccepted){
				trade.acceptTrade(function(e,d){
					if(e) return res.send(e).status(500)
			 		return res.redirect(303,"/messages");
				})
			}else{
				trade.rejectTrade(function(e,d){
					if(e) return res.send(e).status(500);
					res.redirect(303,"/messages");
				})
			}
		})
	})
	app.delete("/trade",function(req,res){
		Trade.findByIdAndRemove({_id:req.query.id},function(e,d){
			res.redirect(303,"/messages");
		})
	})	
}
