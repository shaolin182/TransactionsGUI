'use strict';

/**
 *
 * Main module of the application.
 */
const transactionsApp = angular
    .module('transactions', [
        'ngRoute',
        'transactionsController',
        'dialogController',
        'transactionsDialogController',
        'statsController',
        'statsAccountController',
        'statsCategoryController',
        'mainController',
        'transactionsServiceModule',
        'ngMaterial',
        'categoriesServiceModule',
        'bankaccountServiceModule',
        'angularMoment',
        'chart.js',
        'statsServiceModule',
        'chartDirective',
        'statsFilterModule',
        'filterDirective',
    ]);

transactionsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'transactions/transactions.html',
            controller: 'TransactionsCtrl',
            controllerAs: 'ctrl',
        })
        .when('/stats', {
            templateUrl: 'stats/stats.html',
            controller: 'StatsCtrl',
            controllerAs: 'ctrl',
        })
        .when('/statsByAccount', {
            templateUrl: 'stats/stats-by-account.html',
            controller: 'StatsAccountCtrl',
            controllerAs: 'ctrl',
        })
        .when('/statsByCategory', {
            templateUrl: 'stats/stats-by-category.html',
            controller: 'StatsCategoryCtrl',
            controllerAs: 'ctrl',
        })
        .otherwise({
            redirectTo: '/',
        });
}]);

/**
* Configure how date should be displayed
*/
transactionsApp.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');
    };
});

/*
* Configuring application theme
*/
transactionsApp.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink');
}]);

/*
 * Add some preset for $mdDialog
 */
transactionsApp.config(['$mdDialogProvider', function($mdDialogProvider) {
    $mdDialogProvider.addPreset('transactionDialog', {
        options: function() {
            return {
                controller: 'TransactionsDialogCtrl',
                templateUrl: './transactions/transactions-dialog.html',
                controllerAs: 'ctrl',
                clickOutsideToClose: true,
            };
        },
    });
}]);
