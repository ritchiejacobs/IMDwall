var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');

// Default
gulp.task('default', ['watch', 'scripts', 'styles']);

// Javascript
gulp.task('scripts', function() 
{
	gulp.src('dev/js/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
    	.pipe(gulp.dest('public/js/'))
});

// Sass
gulp.task('styles', function() 
{
    gulp.src('dev/scss/*.scss')
        .pipe(sass())
		.pipe(minify())
        .pipe(gulp.dest('public/css'));
});

// Watch
gulp.task('watch', function() 
{
	gulp.watch('dev/js/*.js', ['scripts']);
	gulp.watch('dev/scss/**', ['styles']);

	var server = livereload();

	gulp.watch(['dev/**']).on('change', function(file) {
		server.changed(file.path);
	});
});