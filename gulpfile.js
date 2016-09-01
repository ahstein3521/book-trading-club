var gulp = require('gulp');
var uglify=require("gulp-uglify");
var server = require('gulp-express');
var autoprefixer=require('gulp-autoprefixer')
var plumber=require("gulp-plumber");
var sourcemaps=require("gulp-sourcemaps")
var sass=require("gulp-sass")
var concat=require("gulp-concat");

gulp.task("scripts",function(){
	gulp.src("public/scripts/**/*.js")
		.pipe(uglify())
		.pipe(concat("main.js"))
		.pipe(gulp.dest("public/dist"))
		.pipe(server.notify())
})

gulp.task("styles",function(){
	return gulp.src("public/styles/styles.scss")
			.pipe(plumber(function(err){
				console.log(err);
				this.emit("end");
			}))
			.pipe(sourcemaps.init())
			.pipe(autoprefixer())
			.pipe(sass({outputStyle:"compressed"}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest("public/dist"))
			.pipe(server.notify())
			
})		



gulp.task('server', function () {
     
    server.run(["app.js"]);

    gulp.watch("public/scripts/**/*.js",["scripts"])
    gulp.watch("public/styles/**/*.scss",['styles'])
    gulp.watch(['app.js'], [server.run])
    
});