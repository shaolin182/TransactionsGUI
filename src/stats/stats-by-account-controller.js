'use strict';

var statsController = angular.module('statsAccountController', []);
statsController.controller('StatsAccountCtrl', ['$scope', 'Stats', 'StatsFilter', '$timeout', function ($scope, Stats, StatsFilter, $timeout) {

	var self = this;
	
	/**
	* Filter information
	*/
	$scope.filter = StatsFilter;

    self.loadOutcomeByAccountType = function () {
		Stats.getOutcomeByAccountType($scope.filter)
		.then(function (result) {
			$scope.outcomeByAccountType = result;
			$scope.outcomeByAccountType.title = "Dépenses par type de comptes";
			$scope.outcomeByAccountType.type = "line";
			
			$timeout(function(){
				$scope.$apply();
			});
		});
    }
    
    /**
	* Call server for statistics data
	*/
	self.loadStatistics = function () {
		self.loadOutcomeByAccountType();
	}

	$scope.filter.applyFilter = function () {
		self.matchRequest = {"date" : {$gt : $scope.filter.startDate, $lt : $scope.filter.endDate}};
		self.loadStatistics();
	}

	self.loadStatistics();

}]);