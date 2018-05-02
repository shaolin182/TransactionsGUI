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
 	'mainController',
 	'transactionsServiceModule', 
 	'ngMaterial', 
 	'md.data.table', 
 	'categoriesServiceModule',
 	'bankaccountServiceModule', 
 	'angularMoment',
 	'chart.js', 
 	'statsServiceModule', 
 	'chartDirective'
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