var gulp = require('gulp');
var less = require('less');
var gulpless = require('gulp-less');
var rename = require('gulp-rename');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var through = require('through2');
var notify = require("gulp-notify");
var combiner = require('stream-combiner2');

//代码着色和显示错误日志
var handleError = function() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'compile error',
        message: '<%=error.message %>'
    }).apply(this, args); //替换为当前对象
    this.emit('end'); //提交
};
var logStream = function(text) {
    return through.obj(function(file, env, callback) {

        // 输出log
        gutil.log(gutil.colors.blue(file.relative) + ' ' + text);
        callback(null, file);
    });
};
// 流错误处理
var errStream = function(stream, err) {
    // 输出错误信息
    util.log(err);
    stream.emit('error', err);
    // 结束流
    stream.emit('end');
};
var getLessStream = function() {
    // less解析出错时的替换内容
    var errCssMsg = [
        "body:before{",
        "content:'这个文件打包出了问题，请检查相应less文件';",
        "position:fixed;",
        "background:#000;",
        "left:0;top:0;padding:1rem;",
        "}"
    ].join('');

    return through.obj(function(file, env, callback) {
        console.log(file, env, callback);
        var self = this;
        var content = file.contents.toString();

        // 使用less解析文件内容
        less.render(content, function(e, output) {
            console.log(e);
            if (e) {
                // 错误处理
                errStream(self, e);

                // less解析出错 输出错误提示
                file.contents = new Buffer(errCssMsg, 'utf8');
                callback(null, file);

            } else {
                // 将解析的内容塞到流内
                file.contents = new Buffer(output.css, 'utf8');
                callback(null, file);
            }
        });
    });
};

//定义一个编译less的任务
gulp.task('less', function() {
    var combined = combiner.obj([
        gulp
        .src('./src/pages/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(logStream('task start'))
        //.pipe(gulpless())
        // 处理less文件
        .pipe(getLessStream())
        .pipe(sourcemaps.write())
        .pipe(rename(function(path) {
            path.dirname += "/";
            path.extname = ".wxss";
        }))
        .pipe(gulp.dest('./dist/pages/'))
        .pipe(logStream('task end'))
    ]);
    combined.on('error', console.error.bind(console));

    return combined;

});
//移动文件夹pages从src到dist
gulp.task('copy', function() {
    return gulp
        .src('./src/pages/**/!(*.less)')
        .pipe(gulp.dest('./dist/pages/'));
});
//监听less文件变化
gulp.task('lessWatch', function() {
    gulp.watch('./src/pages/**/*.less', ['less', 'copy']);
});