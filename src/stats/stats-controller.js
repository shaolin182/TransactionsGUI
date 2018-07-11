'use strict';

var statsController = angular.module('statsController', []);
statsController.controller('StatsCtrl', ['$scope', 'Stats', function ($scope, Stats) {

	var self = this;

	/**
	* Filter information
	*/
	$scope.filter = {};

	/**
	* Match data for mongo query
	*/
	self.matchRequest = {};	

	/*
	* Load statistics about balance by month
	*/
	self.loadStatBalanceByMonth = function () {
		Stats.getBalanceByMonth(self.matchRequest)
		.then (function (result) {
			$scope.costByMonth = result;
			$scope.costByMonth.title = "Solde par mois";
			$scope.costByMonth.type = "bar";
		});		
	}

	/*
	* Load statistics about balance by month
	*/
	self.loadStatBalanceByYear = function () {
		Stats.getBalanceByYear(self.matchRequest)
		.then (function (result) {
			$scope.costByYear = result;
			$scope.costByYear.title = "Solde par année";
			$scope.costByYear.type = "bar";
		});		
	}

	/*
	* Load statistics about sum balance by month
	*/
	self.loadStatSumBalanceByMonth = function () {
		Stats.getSumBalanceByMonth(self.matchRequest)
		.then (function (result) {
			$scope.cumulByMonth = result;
			$scope.cumulByMonth.title = "Cumul des soldes par mois";
			$scope.cumulByMonth.type = "bar";
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

	self.applyFilter = function () {
		
		self.matchRequest = {"date" : {$gt : $scope.filter.startDate, $lt : $scope.filter.endDate}};
		
		self.loadStatistics();
	}
}])