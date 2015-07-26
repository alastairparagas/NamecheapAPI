(function () {
    'use strict';

    var gulp = require('gulp'),
        gulpJshint = require('gulp-jshint'),
        gulpWatch = require('gulp-watch'),
        gulpPlumber = require('gulp-plumber'),
        gulpMocha = require('gulp-mocha'),
        jshintStylish = require('jshint-stylish'),
        colors = require('colors');

    function jshint() {
        return gulp.src(['gulpfile.js',
                         'namecheap-api.js',
                         'Namecheap/**/*.js'])
            .pipe(gulpJshint())
            .pipe(gulpJshint.reporter(jshintStylish));
    }

    function mocha() {
        return gulp.src('tests/**/*.js')
            .pipe(gulpPlumber())
            .pipe(gulpMocha());
    }

    gulp.task('jshint', jshint);
    gulp.task('mocha', mocha);


    function jshintWatch() {
        return gulpWatch('**/*.js', function () {
            console.log(colors.yellow.underline("JS Hint"));
            jshint();   
        });
    }

    function mochaWatch() {
        mocha();
        return gulpWatch(['namecheap-api.js',
                          'namecheap/**/*.js',
                          'tests/**/*.js'], function () {
            console.log(colors.yellow.underline("Mocha Run"));
            mocha();
        });
    }
    gulp.task('jshintWatch', jshintWatch);
    gulp.task('mochaWatch', mochaWatch);


}());