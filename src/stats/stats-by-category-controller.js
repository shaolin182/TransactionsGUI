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
	* Load statistics about category
	*/
	self.loadStatByCategoryBar = function() {
		Stats.getStatByCategory($scope.filter)
		.then(function(result) {
			$scope.costByCategoryBar = result;
			$scope.costByCategoryBar.title = "Dépenses par catégorie";
			$scope.costByCategoryBar.type = "horizontalBar";
			
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

	/*
	* Load statistics about category over month
	*/
	self.loadStatByCategoryOverYear = function() {
		Stats.getStatByCategoryOverYear($scope.filter)
		.then(function(result) {
			$scope.costByCategoryOverYear = result;
			$scope.costByCategoryOverYear.title = "Dépenses par catégorie et par année";
			$scope.costByCategoryOverYear.type = "bar";
			$scope.costByCategoryOverYear.options = {legend: {display: true, position:'right'}, 
				scales: {xAxes: [{stacked:true}], yAxes: [{stacked:true}]}
			}

			$scope.costByCategoryOverYear.datasetOverride = [
				{backgroundColor: 'rgb(247,70,74)',	borderWidth: 0},
				{backgroundColor: 'rgb(151,187,205)',	borderWidth: 0},
				{backgroundColor: 'rgb(220,220,220)',	borderWidth: 0},
				{backgroundColor: 'rgb(70,191,189)',	borderWidth: 0},
				{backgroundColor: 'rgb(253,180,92)',	borderWidth: 0},
				{backgroundColor: 'rgb(148,159,177)',	borderWidth: 0},
				{backgroundColor: 'rgb(77,83,96)',	borderWidth: 0},
				{backgroundColor: 'rgb(54,172,207)',	borderWidth: 0},
				{backgroundColor: 'rgb(39,174,96)',	borderWidth: 0},
				{backgroundColor: 'rgb(51,113,255)',	borderWidth: 0},
				{backgroundColor: 'rgb(190,51,255)',	borderWidth: 0},
				{backgroundColor: 'rgb(255,153,51)',	borderWidth: 0},
			];
			
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
		self.loadStatByCategoryBar();
		self.loadStatByCategoryOverYear();
	}

	$scope.filter.applyFilter = function () {
		self.loadStatistics();
	}

	self.loadStatistics();

}]);