const gulp = require("gulp"),
  sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  gulpif = require("gulp-if"),
  notify = require("gulp-notify"),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pug = require('gulp-pug'),
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync').create();

const path = {
  input: {
    sass: "./_src/sass/*.*",
    scripts: "./_src/scripts/*.*",
    pug: "./_src/*.*"
  },

  output: {
    css: "./build/css/",
    js: "./build/js/",
    html: "./build/"
  }
};

const config = {
  sourcemaps: true,
  notify: false,
  cssMinify: "compressed",
  jsMinify: true,
  htmlMinify: true // true - disable minify, false - enable minify
};

const eslintRules = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "comma-spacing": [
      "error",
      {"before": false, "after": true}
    ],
    "prefer-arrow-callback": 2,
    "prefer-const": 0,
    "no-var": 2,
    "object-shorthand": 2,
    "no-template-curly-in-string": 2
  }
};

gulp.task('html', function buildHTML() {
  return gulp.src(path.input.pug)
    .pipe(pug({
      pretty: config.htmlMinify
    }))
    .pipe(gulp.dest(path.output.html))
});

gulp.task("sass", function () {
  return gulp.src(path.input.sass)
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(sass({outputStyle: config.cssMinify})
      .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false
    }))
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(path.output.css))
    .pipe(browserSync.stream())
    .pipe(gulpif(config.notify, notify({message: 'Styles compiled'})));
});

gulp.task("scripts", function () {
  return gulp.src(path.input.scripts)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('script.min.js'))
    .pipe(gulpif(config.jsMinify, uglify())
      .on('error', function (e) {
        console.log(e.error);
      }))
    .pipe(gulp.dest(path.output.js))
    .pipe(browserSync.stream())
    .pipe(gulpif(config.notify, notify({message: 'Scripts compiled'})));

});

gulp.task('eslint', function () {
  return gulp.src([path.input.scripts, '!node_modules/**'])
    .pipe(eslint(eslintRules))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function () {

  browserSync.init({
    server: "./build"
  });

  gulp.watch(path.input.pug, ['html']);
  gulp.watch(path.input.sass, ['sass']);
  gulp.watch(path.input.scripts, ['scripts', 'eslint']);
  gulp.watch("./build/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['html', 'sass', 'scripts', 'eslint']);
