'use strict';

var statsController = angular.module('statsController', []);
statsController.controller('StatsCtrl', ['$scope', 'Stats', 'StatsFilter', '$timeout', function ($scope, Stats, StatsFilter, $timeout) {

	var self = this;

	/**
	* Filter information
	*/
	$scope.filter = StatsFilter;

	/**
	* Match data for mongo query
	*/
	self.matchRequest = {};	

	/*
	* Load statistics about balance by month
	*/
	self.loadStatBalanceByMonth = function () {
		Stats.getBalanceByMonth($scope.filter)
		.then (function (result) {
			$scope.costByMonth = result;
			$scope.costByMonth.title = "Solde par mois";
			$scope.costByMonth.type = "bar";
			$timeout(function(){
				$scope.$apply();
			});
		});		
	}

	/*
	* Load statistics about balance by month
	*/
	self.loadStatBalanceByYear = function () {
		Stats.getBalanceByYear($scope.filter)
		.then (function (result) {
			$scope.costByYear = result;
			$scope.costByYear.title = "Solde par année";
			$scope.costByYear.type = "bar";
			$timeout(function(){
				$scope.$apply();
			});
		})
		.catch (err => {console.log("error")});		
	}

	/*
	* Load statistics about sum balance by month
	*/
	self.loadStatSumBalanceByMonth = function () {
		Stats.getSumBalanceByMonth($scope.filter)
		.then (function (result) {
			$scope.cumulByMonth = result;
			$scope.cumulByMonth.title = "Cumul des soldes par mois";
			$scope.cumulByMonth.type = "bar";
			$timeout(function(){
				$scope.$apply();
			});
		});
	}

	/**
	* Call server for statistics data
	*/
	self.loadStatistics = function () {
		self.loadStatBalanceByMonth();
		self.loadStatBalanceByYear();
		self.loadStatSumBalanceByMonth();

		
	}

	self.loadStatistics();

	$scope.filter.applyFilter = function () {
		self.matchRequest = {"date" : {$gt : $scope.filter.startDate, $lt : $scope.filter.endDate}};
		self.loadStatistics();
	}
}])