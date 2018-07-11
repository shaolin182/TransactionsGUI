'use strict';

var statsController = angular.module('statsCategoryController', []);
statsController.controller('StatsCategoryCtrl', ['$scope', 'Stats', function ($scope, Stats) {

    var self = this;

    /*
	* Load statistics about category
	*/
	self.loadStatByCategory = function() {
		Stats.getStatByCategory({})
		.then(function(result) {
			$scope.costByCategory = result;
			$scope.costByCategory.title = "Dépenses par catégorie";
			$scope.costByCategory.type = "pie";
			$scope.costByCategory.options = {legend: {display: true, position:'right'}}
		})
	}

	/*
	* Load statistics about category over month
	*/
	self.loadStatByCategoryOverMonth = function() {
		Stats.getStatByCategoryOverMonth({})
		.then(function(result) {
			$scope.costByCategoryOverMonth = result;
			$scope.costByCategoryOverMonth.title = "Dépenses par catégorie et par mois";
			$scope.costByCategoryOverMonth.type = "line";
			$scope.costByCategoryOverMonth.options = {legend: {display: true, position:'right'}}
		})
	}
    
    /**
	* Call server for statistics data
	*/
	self.loadStatistics = function () {
		self.loadStatByCategory();
		self.loadStatByCategoryOverMonth();
	}

	self.loadStatistics();

}]);