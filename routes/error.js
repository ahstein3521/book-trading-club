module.exports=function(app){
	app.get("*",function(req, res, next) {
  	  	var err = new Error();
  		err.status = 404;
  		next(err);
	});
	
	app.use(function(error,req,res,next){
		if(!error){
			return next();
		}else if(error.status==404){
			res.status(404);
			return res.render("error",{message:"The page you are looking for does not exist."})
		}else{
			res.render("error",{message:"An error has occured"})
		}
	})	
}