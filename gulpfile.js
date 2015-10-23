(function () {
    'use strict';

        var gulp             = require('gulp'),
            del              = require('del'),
            argv             = require('yargs').argv,
            $                = require('gulp-load-plugins')(),

            config = {
                less_dir: 'less',
                dist_dir: 'dist',
                www_root: 'public'
            },

            changeLog = function (e) {
                $.util.log('[' + $.util.colors.yellow('INFO') + '] File ' + e.path + ' ' + e.type + ' !');
            };
        
        /**
         * ===================
         * === BUILD TASKS ===
         * ===================
         */
        
        gulp.task('build', function () {

            $.util.log('[' + $.util.colors.yellow('INFO') + '] Building library ...');

            return gulp.src(config.less_dir + '/ds-grid.less')
                .pipe($.less({
                    paths: [config.less_dir]
                }))
                .on('error', function (err) {
                    $.util.log('[' + $.util.colors.red('ERROR') + '] ' + err.toString());
                    this.emit('end');
                })
                .pipe($.autoprefixer())
                .pipe(gulp.dest(config.www_root + '/css'))
                .pipe($.if(argv.mini, $.minifyCss()))
                .pipe($.if(argv.mini, $.rename('ds-grid.min.css')))
                .pipe($.if(argv.mini, gulp.dest(config.www_root + '/css')))
                .pipe($.livereload());
        });

        gulp.task('publish', ['build'], function () {

            $.util.log('[' + $.util.colors.yellow('INFO') + '] Publishing production files ...');

            return gulp.src(config.less_dir + '/ds-grid.less')
                .pipe($.less({
                    paths: [config.less_dir]
                }))
                .pipe($.autoprefixer())
                .pipe(gulp.dest(config.dist_dir))
                .pipe($.minifyCss())
                .pipe($.rename('ds-grid.min.css'))
                .pipe(gulp.dest(config.dist_dir));
        });

        /**
         * ===================
         * === CLEAN TASKS ===
         * ===================
         */
        
        gulp.task('clean', function () {
            $.util.log('[' + $.util.colors.green('INFO') + '] Cleaning builded files ...');

            return del([
                config.www_root + '/css/*',
                config.dist_dir + '/*'
            ]);
        });

        /**
         * =========================
         * === DEVELOPMENT TASKS ===
         * =========================
         */
        
        gulp.task('watch', function () {
            $.livereload.listen();

            gulp.watch([
                config.less_dir + '/**/*.less'
            ], ['build'])
                .on('change', changeLog);
        });

}());