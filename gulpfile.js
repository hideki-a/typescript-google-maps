const gulp = require('gulp');
// const ts = require('gulp-typescript');
// const tsProject = ts.createProject('tsconfig.json');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const browserSync = require('browser-sync').create();

gulp.task('tsc', function () {
    // return tsProject.src()
    //     .pipe(tsProject())
    //     .js.pipe(gulp.dest('./app/js'))
    //     .pipe(browserSync.stream());
    return webpackStream(webpackConfig, webpack)
        .pipe(gulp.dest("./app/js"))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve:develop', function () {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });

    gulp.watch('./app/*.html').on('change', browserSync.reload);
    gulp.watch('./src/ts/**/*.ts', gulp.series('tsc'));
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './app'
        }
    });
});

gulp.task('default', gulp.series('tsc', 'sass', 'serve:develop'));
