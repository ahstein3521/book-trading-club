var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var tradeScema=new Schema({
	bookWanted:{type:Schema.Types.ObjectId,ref:"Book"},
	bookOffered:{type:Schema.Types.ObjectId,ref:"Book"},
	userInbox:{type:Schema.Types.ObjectId,ref:"User"},
	userOutbox:{type:Schema.Types.ObjectId,ref:"User"},
	status:{type:String,default:"Pending"}
})

tradeScema.post("save",function(doc,next){
	if(doc.status=="Accepted" || doc.status=="Rejected"){
		this.model("Trade").update({
			"$and":[{"status":"Pending"},
				{"$or":[{"bookWanted":{$in:[doc.bookWanted,doc.bookOffered]}},
						{"bookOffered":{$in:[doc.bookWanted,doc.bookOffered]}}]}
			]},{status:"Traded"},{multi:true},function(e,d){
			if(!e){
				next();
			} 
		})
	}
	next();
})//hook removes pending trades that feature a recently traded book. Needs error handling;

tradeScema.methods.acceptTrade=function(cb){
	var offer=this.bookOffered;
	var wanted=this.bookWanted;
	var self=this;

	this.model("Book").find({"_id":{$in:[offer,wanted]}},function(err,data){
		if(err) return cb(err);
		var tmp=data[0].owner;

		data[0].owner=data[1].owner;
		data[1].owner=tmp;
		data[0].save();
		data[1].save();
		self.status="Accepted";
		self.save();
		cb(null,data);
	})
}

tradeScema.methods.rejectTrade=function(cb){
	var offer=this.bookOffered;
	var wanted=this.bookWanted;
	this.status="Rejected";
	this.save(cb);
}


tradeScema.statics.getUsersTrades=function(id,cb){
	this.find({'$or':[{"userInbox":id},{"userOutbox":id}]})
		.populate("bookWanted bookOffered userInbox userOutbox")
		.exec(function(err,data){
			if(err) return cb(err);
			var folders={inbox:[],outbox:[],rejected:[],accepted:[],cancelled:[]}
			data.forEach(function(trade){
				if(trade.status=="Pending"){
					if(trade.userInbox._id==id){
						folders.inbox.push(trade);
					}else{
						folders.outbox.push(trade);
					}
				}
				else if(trade.status=="Accepted"){
					folders.accepted.push(trade);
				}else if(trade.status=="Rejected"){
					folders.rejected.push(trade);
				}else{
					folders.cancelled.push(trade);
				}
			})
			return cb(null,folders);
		})
}


module.exports=mongoose.model("Trade",tradeScema);


