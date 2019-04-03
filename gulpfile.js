const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const terser = require('gulp-terser');
const Server = require('karma').Server;

const paths = {
    src: 'src/**/*',
    src_js: [
        'src/**/*.js',
        '!src/**/*spec.js',
    ],
    src_html: 'src/**/*.html',
    src_css: [
        'src/**/*.css',
        'node_modules/angular-material/angular-material.css',
    ],

    lib: [
        'node_modules/angular/angular.js',
        'node_modules/angular-route/angular-route.js',
        'node_modules/angular-resource/angular-resource.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/moment/moment.js',
        'node_modules/angular-moment/angular-moment.js',
        'node_modules/chart.js/dist/Chart.js',
        'node_modules/angular-chart.js/dist/angular-chart.js',
    ],
    libTest: 'node_modules/angular-mocks/angular-mocks.js',

    dist: 'dist',
    dist_lib: 'dist/lib',
    dist_css: 'dist/css',

};

const karmaFiles = paths.lib.concat(paths.libTest).concat(paths.src_js);

gulp.task('clean', function() {
    return gulp.src(paths.dist, {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('build_lib', function() {
    return gulp.src(paths.lib)
        .pipe(concat('lib.js'))
        .pipe(terser())
        .pipe(gulp.dest(paths.dist_lib));
});

gulp.task('build_src_js', function() {
    return gulp.src(paths.src_js.concat())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build_src_html', function() {
    return gulp.src(paths.src_html, {base: 'src'})
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build_src_css', function() {
    return gulp.src(paths.src_css)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(paths.dist_css));
});


gulp.task('build', gulp.series(['clean', 'build_lib',
    'build_src_js', 'build_src_html', 'build_src_css']));

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
    Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        files: karmaFiles,
    }, function() {
        done();
    });
});
gulp.task('default', gulp.series(['build']));
