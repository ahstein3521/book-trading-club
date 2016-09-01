var express=require("express");
var app = module.exports.app = exports.app = express();
var exphbs=require('express-handlebars');
var passport=require('passport');
var session=require('express-session');
var mongoose = require('mongoose');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var flash=require("connect-flash");
var validator=require("express-validator")
var path=require("path")
var methodOverride=require("method-override");

require("dotenv").config();

mongoose.Promise=require("bluebird");
mongoose.connect(process.env.mongoURI);


app.use(cookieParser());
app.use(session({secret:process.env.cookie_secret,saveUninitialized:true,resave:false}));
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use("/public", express.static(path.join(__dirname, 'public')));



app.use(flash());

app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))//https://github.com/ctavan/express-validator

app.use(function(req,res,next){
	res.locals.success=req.flash("success_msg");
	res.locals.error_msg=req.flash("error_msg");
	res.locals.error=req.flash("error");
	next();
})


require("./config/passport")(app);
require("./routes/index")(app);
require("./routes/auth")(app);
require("./routes/book")(app);
require("./routes/trade")(app);
require("./routes/settings")(app);
require("./routes/error")(app);

app.listen(process.env.PORT||8080,function(){
	console.log("Serving ....");
})
