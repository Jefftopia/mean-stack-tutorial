var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
//var watch = require('gulp-watch');
var flatten = require('gulp-flatten'); 

gulp.task('build-js', function(){
   return  gulp.src('src/**/*.js')
        .pipe(concat('flapper.js'))
        .pipe(gulp.dest('public/javascripts'))                
        .pipe(gulp.dest('dist'))
        .pipe(rename('flapper.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('copy-templates', function(){
   return gulp.src('src/**/*.html')
            .pipe(flatten())
            .pipe(gulp.dest('dist/html'))
            .pipe(gulp.dest('public/html'));
});

gulp.task('default', ['build-js','copy-templates'], function() {});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['build-js','copy-templates']);
});