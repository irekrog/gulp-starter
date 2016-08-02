var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    gulpif = require("gulp-if"),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

var path = {
    input: {
        sass: "./_src/sass/*.*",
        scripts: "./_src/scripts/*.*"
    },

    output: {
        css: "css/",
        js: "js/"
    }
};

var config = {
    sourcemaps: true,
    notify: false,
    cssCompress: "compressed"
};

gulp.task("sass", function () {
    return gulp.src(path.input.sass)
        .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
        .pipe(sass({outputStyle: config.cssCompress})
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
        .pipe(gulp.dest(path.output.css))
        .pipe(browserSync.stream())
        .pipe(gulpif(config.notify,notify({message: 'Styles compiled'})));
});

gulp.task("scripts", function () {
   return gulp.src(path.input.scripts)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
            .on('error', function (e) {
                console.log(e.error);
            })
        .pipe(gulp.dest(path.output.js))
        .pipe(browserSync.stream())
        .pipe(gulpif(config.notify,notify({message: 'Scripts compiled'})));

});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', ['sass', 'scripts'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch(path.input.sass, ['sass']);
    gulp.watch(path.input.scripts, ['scripts']);
    gulp.watch("./*.html").on('change', browserSync.reload);

});

gulp.task('default', ['sass', 'scripts']);