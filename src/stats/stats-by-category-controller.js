'use strict';

var statsController = angular.module('statsCategoryController', []);
statsController.controller('StatsCategoryCtrl', ['$scope', 'Stats', 'StatsFilter', '$timeout', function ($scope, Stats, StatsFilter, $timeout) {

	var self = this;
	
	/**
	* Filter information
	*/
	$scope.filter = StatsFilter;

    /*
	* Load statistics about category
	*/
	self.loadStatByCategory = function() {
		Stats.getStatByCategory($scope.filter)
		.then(function(result) {
			$scope.costByCategory = result;
			$scope.costByCategory.title = "Dépenses par catégorie";
			$scope.costByCategory.type = "pie";
			$scope.costByCategory.options = {legend: {display: true, position:'right'}}
			
			$timeout(function(){
				$scope.$apply();
			});
		})
	}

	/*
	* Load statistics about category over month
	*/
	self.loadStatByCategoryOverMonth = function() {
		Stats.getStatByCategoryOverMonth($scope.filter)
		.then(function(result) {
			$scope.costByCategoryOverMonth = result;
			$scope.costByCategoryOverMonth.title = "Dépenses par catégorie et par mois";
			$scope.costByCategoryOverMonth.type = "line";
			$scope.costByCategoryOverMonth.options = {legend: {display: true, position:'right'}}
			
			$timeout(function(){
				$scope.$apply();
			});
		})
	}
    
    /**
	* Call server for statistics data
	*/
	self.loadStatistics = function () {
		self.loadStatByCategory();
		self.loadStatByCategoryOverMonth();
	}

	$scope.filter.applyFilter = function () {
		self.loadStatistics();
	}

	self.loadStatistics();

}]);