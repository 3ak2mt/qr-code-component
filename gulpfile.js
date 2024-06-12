import gulp from "gulp";
import { deleteAsync } from "del";
import autoprefixer from "gulp-autoprefixer";
import imagemin, { optipng } from "gulp-imagemin";
import cssnano from "gulp-cssnano";
import concat from "gulp-concat";
import htmlmin from "gulp-htmlmin";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import gulpreplace from "gulp-replace";

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
        dest: "dist/fonts",
    },
};

const minifyHTML = async () => {
    return gulp
        .src(paths.html.src)
        .pipe(gulpreplace("styles.css", "styles.min.css"))
        .pipe(
            htmlmin({
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
        .pipe(sourcemaps.init())
        .pipe(gulpreplace('@import url("sr-only.css");\n', ""))
        .pipe(autoprefixer())
        .pipe(concat("styles.css"))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.css.dest));
};

const optimizeImages = async () => {
    return gulp
        .src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
};

const cleanDist = async () => {
    return deleteAsync(["dist"]);
};

const moveFonts = async () => {
    return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
};

gulp.task("clean", cleanDist);
gulp.task("styleCSS", styleCSS);
gulp.task(
    "default",
    gulp.series(
        cleanDist,
        gulp.parallel(minifyHTML, styleCSS, moveFonts, optimizeImages)
    )
);
