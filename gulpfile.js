var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tslint = require("gulp-tslint");
var minify = require('gulp-minify');

const transcompile = (cb) => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
}

const lint = (cb) => {
    return gulp.src('./src/**/**.ts')
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report());
}

const compress = (cb) => {
    return gulp.src('dist/**/*.js')
        .pipe(minify({noSource: true, ext: { src:'.js', min: '.js' }}))
        .pipe(gulp.dest('build'));
}

exports.transcompile = transcompile;
exports.lint = lint;
exports.default = gulp.series(transcompile, compress);
