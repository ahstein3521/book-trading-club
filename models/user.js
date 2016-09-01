var mongoose=require("mongoose");
var bcrypt=require("bcryptjs")
var Schema=mongoose.Schema;

var userSchema=new Schema({
	username:{type:String,index:true},
	   email:String,
	password:String,
	location:String
})

userSchema.methods.register=function(user,cb){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(user.password, salt, function(err, hash) {
    	   user.password=hash;
    	   user.save(cb)
    	});
	});
}

userSchema.methods.comparePassword=function(candidatePW,hash,cb){
	bcrypt.compare(candidatePW,hash,function(err,success){
		if(err) throw err;
		cb(null,success);
	})
}


module.exports=mongoose.model("User",userSchema);