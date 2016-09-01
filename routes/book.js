var Book=require("../models/book")

module.exports=function(app){

	app.get("/book",function(req,res){
		var usersBooks=req.session? req.session.books:null;

		Book.findOne({_id:req.query.id})
			.populate("owner")
			.exec(function(e,d){
				res.render("book_info",{user:req.user,book:d,usersBooks:usersBooks})

		})
	})

	app.post("/add",function(req,res,next){
		var book=req.body;
		book.owner=req.user._id;

		req.session.books.push(book);
		var newBook=new Book(book);
		newBook.save(function(err,data){
			if(err) throw err;
			res.send(data);
		})
	})
	app.use("/remove",function(req,res,next){
		if(req.method!="DELETE") return next();
		req.session.books.forEach(function(val,i,arr){
			if(val._id==req.query.book){
			   arr.splice(i,1)
			   next();
			}
		})
	})

	app.delete("/remove",function(req,res){
		Book.findByIdAndRemove({_id:req.query.book},function(e,d){
			if(e) return res.status(422).send("Error Deleting");
			return res.status(200).send("Book deleted from user's collection");
		})
	})
}
