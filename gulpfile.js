'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minifyCSS = require('gulp-csso');
const del = require('del');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// BUILD scripts
gulp.task('clean', function() {
    return del('build/**');
});

gulp.task('build:sass', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({browsers: ['last 4 version']}) ]))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build'));
});

gulp.task('copy:html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'));
});

// DEV scripts
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("tmp/"))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./tmp'));
});

gulp.task('js', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./tmp/js'));
});

gulp.task('server', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: './tmp/',
        },
        port: 4000
    });

    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch("src/**/*.*").on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'build:sass', 'copy:html']);
gulp.task('default', ['html', 'js', 'server']);