// VAR
var autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync'),
  cssnano = require('cssnano'),
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  postcss = require('gulp-postcss'),
  wait = require('gulp-wait'),
  rename = require('gulp-rename'),
  svgSprite = require('gulp-svg-sprite');


/* =================================================================== */
/* --------------------------- SASS to CSS --------------------------- */
/* =================================================================== */

gulp.task('sass', function () {
  gulp.src('assets/scss/**/*.scss')
    .pipe(wait(100))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'));
});


/* =================================================================== */
/* ------------------------- CSS Enhancement ------------------------- */
/* =================================================================== */

gulp.task('css', function () {
  var plugins = [
    autoprefixer({ browsers: ['last 2 version'] }),
    cssnano()
  ];

  return gulp.src('dist/css/app.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});


/* =================================================================== */
/* -------------------------- JS Enhancement ------------------------- */
/* =================================================================== */

gulp.task('js', function () {
  return gulp.src('assets/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});


/* =================================================================== */
/* ---------------------------- SVG Sprite --------------------------- */
/* =================================================================== */

gulp.task('sprite', function () {
  return gulp.src('img/svg/*.svg')
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 0
        }
      },
      mode: {
        css: {
          dest: 'img/',
          layout: 'diagonal',
          sprite: '../sprite.svg',
          bust: false,
          render: {
            scss: {
              dest: '../../assets/scss/partial/_sprite-svg.scss',
              template: 'assets/scss/tpl/_sprite-tpl-css.scss'
            }
          }
        },

        symbol: {
          dest: 'img/',
          layout: 'diagonal',
          sprite: '../sprite-inline.svg',
          bust: false,
          render: {
            scss: {
              dest: '../../assets/scss/partial/_sprite-svg-inline.scss',
              template: 'assets/scss/tpl/_sprite-tpl-inline.scss'
            }
          }
        }
      },
      variables: {
        mapname: 'icons'
      }
    }))
    .pipe(gulp.dest('img/'));
});


/* =================================================================== */
/* --------------------------- BrowserSync --------------------------- */
/* =================================================================== */

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: '.'
    },
    notify: false
  });
});


/* =================================================================== */
/* ----------------------------- Watcher ----------------------------- */
/* =================================================================== */

gulp.task('watch', ['sass', 'css', 'js', 'browser-sync'], function () {
  gulp.watch('img/sprite.svg');
  gulp.watch('assets/scss/**/*.scss', ['sass']);
  gulp.watch('dist/css/app.css', ['css']);
  gulp.watch('assets/js/app.js', ['js']);
  gulp.watch('img/svg/*.svg', ['sprite']);
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('build', ['sass', 'css', 'js', 'sprite']);

gulp.task('default', ['watch']);