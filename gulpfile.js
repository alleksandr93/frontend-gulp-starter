const { src, dest, watch, parallel, series } = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const cached = require('gulp-cached')


function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
        .pipe(avif({ quality: 50 }))

        .pipe(src('app/images/src/*.*'))
        .pipe(webp())

        .pipe(src('app/images/src/*.*'))
        .pipe(imagemin())

        .pipe(dest('app/images/dist'))
}
function scripts() {
    return src([
        'app/js/*.js',
        '!app/js/main.min.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}
function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions']
        }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ style: 'compressed' }).on('error', scss.logError))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}
function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles
exports.images = images
exports.scripts = scripts
exports.watching = watching
exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, watching)