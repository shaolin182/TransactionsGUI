'use strict';

var statsController = angular.module('statsAccountController', []);
statsController.controller('StatsAccountCtrl', ['$scope', 'Stats', function ($scope, Stats) {

    var self = this;

    self.loadOutcomeByAccountType = function () {
		Stats.getOutcomeByAccountType(self.matchRequest)
		.then(function (result) {
			$scope.outcomeByAccountType = result;
			$scope.outcomeByAccountType.title = "Dépenses par type de comptes";
			$scope.outcomeByAccountType.type = "line";
		});
    }
    
    /**
	* Call server for statistics data
	*/
	self.loadStatistics = function () {
		self.loadOutcomeByAccountType();
	}

	self.loadStatistics();

}]);