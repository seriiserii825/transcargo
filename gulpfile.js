"use strict";

let gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    cssbeautify = require("gulp-cssbeautify"),
    removeComments = require('gulp-strip-css-comments'),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    cssnano = require("gulp-cssnano"),
    rigger = require("gulp-rigger"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    filter    = require('gulp-filter'),
    watch = require("gulp-watch"),
    sourcemaps = require('gulp-sourcemaps'),
    svgSprite = require('gulp-svg-sprite'),
    svgSprites = require("gulp-svg-sprites"),
    svgmin = require('gulp-svgmin'),
    svg2png   = require('gulp-svg2png'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    plumber = require("gulp-plumber"),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require("gulp-imagemin"),
    run = require("run-sequence"),
    newer = require('gulp-newer'),
    rimraf = require("rimraf"),
    csscomb = require('gulp-csscomb'),
    fontfacegen = require('fontfacegen'),
    map = require('map-stream'),
    browserSync = require('browser-sync').create();


/* Paths to source/build/watch files
=========================*/
let path = {
    build: {
        html: "build/",
        js: "build/assets/js/",
        css: "build/assets/css/",
        img: "build/assets/i/",
        fonts: "build/assets/fonts/",
        header: "build/assets/header/",
        libs: "build/assets/libs/",
        bootstrap: "build/assets/libs/bootstrap/"
    },
    src: {
        html: "src/*.{htm,html}",
        js: "src/assets/js/main.js",
        css: "src/assets/sass/style.scss",
        img: "src/assets/i/**/*.*",
        fonts: "src/assets/fonts/**/*.*",
        header: "src/assets/header/header.scss",
        libs: "src/assets/libs/**/*.*",
        bootstrap: "src/assets/libs/bootstrap/bootstrap.js"
    },
    watch: {
        html: "src/**/*.{htm,html}",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        img: "src/assets/i/**/*.*",
        fonts: "src/assets/fonts/**/*.*",
        header: "src/assets/header/**/*.scss",
        libs: "src/assets/libs/**/*.*"
    },
    clean: "./build"
};

/* browser-sync
=========================*/
gulp.task('browser-sync', function(){

    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        notify: true
    });
});

/* html:build
====================================================*/
gulp.task("html:build", function(){
    return gulp.src(path.src.html)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

/* libs:build
====================================================*/
gulp.task("libs:build", function(){
    return gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
        .pipe(browserSync.stream());
});

/* favicon:build
====================================================*/
gulp.task("favicon:build", function(){
    return gulp.src("src/favicon.ico")
        .pipe(gulp.dest("build/"))
        .pipe(browserSync.stream());
});

/* css:build
====================================================*/
gulp.task("css:build", function(){
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        //.pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        //.pipe(removeComments())
        //.pipe(cssbeautify())
        //.pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css));
});

/* header:build
====================================================*/
gulp.task("header:build", function(){
    gulp.src(path.src.header)
        .pipe(sourcemaps.init())
        //.pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        //.pipe(removeComments())
        //.pipe(cssbeautify())
        //.pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.header))
        .pipe(browserSync.stream())
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename("header.min.css"))
        .pipe(gulp.dest(path.build.header));
});

/* home-scss
====================================================*/
gulp.task("home-scss", function(){
    gulp.src("src/assets/sass/home.scss")
        .pipe(sourcemaps.init())
        //.pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        //.pipe(removeComments())
        //.pipe(cssbeautify())
        //.pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/assets/css/"))
        .pipe(browserSync.stream())
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename("home.min.css"))
        .pipe(gulp.dest("build/assets/css/"));
});

/* js:build
====================================================*/
gulp.task("js:build", function(){
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(removeComments())
        .pipe(rename("main.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

/* bootstrap:build
====================================================*/
gulp.task("bootstrap:build", function(){
    gulp.src(path.src.bootstrap)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.bootstrap))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(removeComments())
        .pipe(rename("bootstrap.min.js"))
        .pipe(gulp.dest(path.build.bootstrap))
        .pipe(browserSync.stream());
});

/* fonts:build
====================================================*/
gulp.task("fonts:build", function(){
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

/* fontgen
====================================================*/
gulp.task('fontgen', function(){
    return gulp.src("src/assets/fonts/*.{ttf,otf}")
        .pipe(plumber())
        .pipe(map(function(file, cb){
            fontfacegen({
                source: file.path,
                dest: 'src/assets/fonts/'
            });
            cb(null, file);
        }));
});

/* image:build
====================================================*/
gulp.task("image:build", function(){
    gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(newer('build/assets/i/'))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

/* sprite
====================================================*/
gulp.task('sprite', function(){
    let spriteData = gulp.src('src/assets/i/icons/**/*.*')
        .pipe(plumber())
        .pipe(spritesmith({
            imgName: '../i/sprite.png',
            cssName: 'sprite.scss',
            cssFormat: 'scss',
            algorithm: 'binary-tree',
            padding: 20
        }));
    spriteData.img.pipe(gulp.dest('src/assets/i'));
    spriteData.css.pipe(gulp.dest('src/assets/sass/partials/'));
});

gulp.task("clean", function(cb){
    rimraf(path.clean, cb);
});

/* spriteSvg
====================================================*/
gulp.task('svg', function () {
    return gulp.src('src/assets/i/icons/svg/*.svg')
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg",
                    render: {
                        scss: {
                            dest:'_sprite.scss',
                            template: "src/assets/sass/partials/_sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('src/assets/i/'));
});

/*spritesSvgImg
 ===============================*/
gulp.task('sprites', function () {
    return gulp.src('src/assets/i/icons/svg/*.svg')
        .pipe(svgSprites())
        .pipe(gulp.dest("src/assets/i/sprite-svg-img/")) // Write the sprite-sheet + CSS + Preview
        .pipe(filter("**/*.svg"))  // Filter out everything except the SVG file
        .pipe(svg2png())           // Create a PNG
        .pipe(gulp.dest("src/assets/i/sprite-svg-img/"));
});

/* build
====================================================*/
gulp.task('build', function(cb){
    run(
        "clean",
        "html:build",
        "css:build",
        "header:build",
        "libs:build",
        "bootstrap:build",
        "favicon:build",
        "js:build",
        "fonts:build",
        "image:build",
        "home-scss"
        , cb);
});

/* watch
====================================================*/
gulp.task("watch", function(){
    watch([path.watch.html], function(event, cb){
        gulp.start("html:build");
    });
    watch([path.watch.css], function(event, cb){
        gulp.start("css:build");
    });
    watch([path.watch.libs], function(event, cb){
        gulp.start("libs:build");
    });
    watch([path.watch.header], function(event, cb){
        gulp.start("header:build");
    });
    watch(["src/assets/sass/home.scss"], function(event, cb){
        gulp.start("home-scss");
    });
    watch([path.watch.js], function(event, cb){
        gulp.start("js:build");
    });
    watch([path.watch.img], function(event, cb){
        gulp.start("image:build");
    });
    watch([path.watch.fonts], function(event, cb){
        gulp.start("fonts:build");
    });
});

/* default
====================================================*/
gulp.task("default", function(cb){
    run(
        "clean",
        "build",
        "browser-sync",
        "watch"
        , cb);
});


