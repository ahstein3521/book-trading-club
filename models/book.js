var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var bookSchema=new Schema({
	title:String,
	description:String,
	image:String,
	pageCount:Number,
	averageRating:Number,
	publisher:String,
	authors:String,
	owner:{type:Schema.Types.ObjectId,ref:"User"}
})

module.exports=mongoose.model("Book",bookSchema);