// Karma configuration
// Generated on Wed May 03 2017 20:08:30 GMT+0200 (CEST)
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.js': ['coverage'],
        },

        coverageReporter: {
            type: 'text',
            check: {
                global: {
                    statements: 30,
                    branches: 30,
                    functions: 30,
                    lines: 30,
                    excludes: [
                        'src/**/*spec.js',
                    ],
                },
            },
        },

        // junitReporter: {
        //     outputDir: '/tmp',
        //     outputFile: 'unittest.xml',
        //     useBrowserName: false,
        // },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever
        // any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // Show log from browser into console
        browserConsoleLogOptions: {
            level: 'log',
            terminal: true,
        },
    });
};
