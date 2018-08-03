// Karma configuration
// Generated on Wed May 03 2017 20:08:30 GMT+0200 (CEST)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
    'src/bower_components/angular/angular.js',
    'src/bower_components/angular-route/angular-route.js',
    'src/bower_components/angular-resource/angular-resource.js',
    'src/bower_components/angular-material-data-table/dist/md-data-table.min.js',
    'src/bower_components/angular-material/angular-material.min.js',
    'src/bower_components/angular-animate/angular-animate.min.js',
    'src/bower_components/angular-aria/angular-aria.min.js',
    'src/bower_components/moment/moment.js',
    'src/bower_components/angular-moment/angular-moment.js',
    'src/bower_components/angular-mocks/angular-mocks.js',
    'src/app.js',
    'src/transactions/transactions-controller.js',
    'src/transactions/transactions-service.js',
    'src/transactions/transactions-service.spec.js',
    'src/dialog/dialog-controller.js',
    'src/categories/categories-service.js',
    'src/bankaccount/bankaccount-service.js', 
    'src/transactions/transactions-controller-test.js',
    'src/transactions/transactions-dialog-controller.js', 
    'src/stats/stats-controller.js', 
    'src/stats/stats-controller.spec.js', 
    'src/stats/stats-by-account-controller.js', 
    'src/stats/stats-by-account-controller.spec.js', 
    'src/stats/stats-by-category-controller.js', 
    'src/stats/stats-by-category-controller.spec.js', 
    'src/stats/stats-service.js',
    'src/stats/stats-filter.js',
    'src/stats/stats-service.spec.js',
    './node_modules/phantomjs-polyfill-find-index/findIndex-polyfill.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity, 

    // Show log from browser into console
    browserConsoleLogOptions: {
        level: 'log',
        terminal: true
    },
})
}
