import gulp from "gulp";
import { deleteAsync } from "del";
import gulpAutoprefixer from "gulp-autoprefixer";
import gulpConcat from "gulp-concat";
import gulpCssNano from "gulp-cssnano";
import gulpHtmlMin from "gulp-htmlmin";
import gulpImageMin, { optipng } from "gulp-imagemin";
import gulpRename from "gulp-rename";
import gulpReplace from "gulp-replace";
import gulpSourceMaps from "gulp-sourcemaps";

/* 'removeBOM: false' is required to keep files in 'dist' unchanged */

const paths = {
    html: {
        src: "src/**/*.html",
        dest: "dist/",
    },
    css: {
        src: "src/css/**/*.css",
        dest: "dist/css/",
    },
    images: {
        src: "src/images/**/*.png",
        dest: "dist/images/",
    },
    fonts: {
        src: "src/fonts/**/*.woff2",
        dest: "dist/fonts/",
    },
};

const minifyHTML = async () => {
    return gulp
        .src(paths.html.src)
        .pipe(gulpReplace("styles.css", "styles.min.css"))
        .pipe(
            gulpHtmlMin({
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true,
            })
        )
        .pipe(gulp.dest(paths.html.dest));
};

const styleCSS = async () => {
    return gulp
        .src(paths.css.src)
        .pipe(gulpSourceMaps.init())
        .pipe(gulpReplace('@import url("sr-only.css");\n', ""))
        .pipe(gulpAutoprefixer())
        .pipe(gulpConcat("styles.css"))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(gulpCssNano())
        .pipe(gulpRename({ suffix: ".min" }))
        .pipe(gulpSourceMaps.write("."))
        .pipe(gulp.dest(paths.css.dest));
};

const optimizeImages = async () => {
    return gulp
        .src(paths.images.src, { removeBOM: false })
        .pipe(gulpImageMin())
        .pipe(gulp.dest(paths.images.dest));
};

const cleanDist = async () => {
    return deleteAsync(["dist"]);
};

const copyFonts = async () => {
    return gulp
        .src(paths.fonts.src, { removeBOM: false })
        .pipe(gulp.dest(paths.fonts.dest));
};

gulp.task("minifyHTML", minifyHTML);
gulp.task("optimizeImages", optimizeImages);
gulp.task("copyFonts", copyFonts);
gulp.task("clean", cleanDist);
gulp.task("styleCSS", styleCSS);
gulp.task(
    "default",
    gulp.series(
        cleanDist,
        gulp.parallel(minifyHTML, styleCSS, copyFonts, optimizeImages)
    )
);
