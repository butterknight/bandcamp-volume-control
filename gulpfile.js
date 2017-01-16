var gulp = require('gulp'),
    bump = require('gulp-bump'),
    concat = require('gulp-concat'),
    del = require('del'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    seq = require('run-sequence'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify');

var env = process.env.NODE_ENV || 'dev', // prod | dev
    buildDir = './build',
    files = {
        js: [
            './src/lib/**/*',
            './src/index.js',
        ],
        meta: [
            './src/meta/**/*'
        ]
    };

gulp.task('clean', function () {
    return del(buildDir, { force: true });
});

gulp.task('publish:version', function () {
    if (env === 'dev') {
        return;
    }
    gulp.src('./package.json')
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));

    gulp.src('./src/meta/manifest.json')
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./src/meta'));
});

gulp.task('publish', function () {
    seq('clean', 'publish:version', 'compile', 'meta');
});

gulp.task('compile', function () {
    return gulp.src(files.js)
        .pipe(concat('content.js'))
        .pipe(header('(function () {\n\n\'use strict\';\n\n'))
        .pipe(footer('\n})();\n'))
        .pipe(gulpif(env === 'prod', stripDebug()))
        .pipe(gulpif(env === 'prod', uglify().on('error', gutil.log)))
        .pipe(gulp.dest(buildDir));
});

gulp.task('meta', function () {
    return gulp.src(files.meta)
        .pipe(gulp.dest(buildDir));
});

gulp.task('build', function () {
    seq('clean', ['compile', 'meta']);
});

gulp.task('watch', function () {

    gulp.watch(files.meta, { debounceDelay: 500 }, ['meta']);

    gulp.watch(files.js, { debounceDelay: 500 }, ['compile']);

});
