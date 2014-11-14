var gulp = require('gulp'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');

gulp.task('jade', function () {
    return gulp.src('./src/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./app'));
});

gulp.task('jshint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('./app'));
});

gulp.task('less', function () {
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./app/css'));
});

gulp.task('scripts', function () {
    return gulp.src('./src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./app/dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['jshint']);
    gulp.watch('./src/**/*.js', ['scripts']);
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('./src/**/*.jade', ['jade']);
});

gulp.task('default', ['jshint', 'jade', 'less', 'watch']);
