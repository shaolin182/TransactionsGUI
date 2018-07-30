'use strict';

/**
 *
 * Main module of the application.
 */
 var transactionsApp = angular
 .module('transactions', [
 	'ngRoute', 
 	'transactionsController', 
 	'dialogController', 
 	'transactionsDialogController',
	'statsController' ,
	'statsAccountController', 
	'statsCategoryController',
 	'mainController',
 	'transactionsServiceModule', 
 	'ngMaterial', 
 	'md.data.table', 
 	'categoriesServiceModule',
 	'bankaccountServiceModule', 
 	'angularMoment',
 	'chart.js', 
 	'statsServiceModule', 
	'chartDirective', 
	'statsFilterModule', 
	'filterDirective'
 	]);

 transactionsApp.config(['$routeProvider', function ($routeProvider) {
 	$routeProvider
 	.when('/', {
 		templateUrl: 'transactions/transactions.html',
 		controller: 'TransactionsCtrl', 
 		controllerAs:'ctrl'
 	})
 	.when('/stats', {
 		templateUrl: 'stats/stats.html',
 		controller: 'StatsCtrl', 
 		controllerAs:'ctrl'
	 })
	 .when('/statsByAccount', {
		templateUrl: 'stats/stats-by-account.html',
		controller: 'StatsAccountCtrl', 
		controllerAs:'ctrl'
	})
	.when('/statsByCategory', {
		templateUrl: 'stats/stats-by-category.html',
		controller: 'StatsCategoryCtrl', 
		controllerAs:'ctrl'
	})
 	.otherwise({
 		redirectTo: '/'
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

transactionsApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
	
	$mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('pink');
}]);