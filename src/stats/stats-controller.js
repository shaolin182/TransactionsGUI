'use strict';

var statsController = angular.module('statsController', []);
statsController.controller('StatsCtrl', ['$scope', 'Stats', function ($scope, Stats) {

	var self = this;

	var data = {
		match : {}, 
		group : {
			_id: {
				year : { $year: "$date" },        
				month : { $month: "$date" },        
			},
			costByMonth: { $sum: "$cost" }
		}, 
		sort : {"_id.year":1, "_id.month":1}
	} 


	Stats.getTotalCostByMonth(data, function (result) {
		statsCostByMonth(result);
		statsCumulCostByMonth(result);
	});

	/**
	* Build data for chart about cost by month
	*/
	function statsCostByMonth(result) {
		$scope.costByMonth = {};
		$scope.costByMonth.labels = result.map(function (currentElement) {
			return currentElement._id.year + "-" + currentElement._id.month;
		})

		$scope.costByMonth.data = result.map(function (currentElement) {
			return currentElement.costByMonth / 100;
		})

		$scope.costByMonth.chartColor = result.map(function (currentElement) {
			return "rgb(54,172,207)";
		})
	}


	function statsCumulCostByMonth(result) {
		$scope.cumulByMonth = {
			data : []
		};
		$scope.cumulByMonth.labels = result.map(function (currentElement) {
			return currentElement._id.year + "-" + currentElement._id.month;
		})

		$scope.cumulByMonth.chartColor = result.map(function (currentElement) {
			return "rgb(54,172,207)";
		})	

		result.forEach(function (currentElement, index)  {
			if (index > 0) {
				$scope.cumulByMonth.data.push((currentElement.costByMonth / 100) + $scope.cumulByMonth.data[index - 1]) ;
			} else {
				$scope.cumulByMonth.data.push(currentElement.costByMonth / 100);		
			}
		})
	}

	self.applyFilter = function () {
		data = {
			match : {date : {$gt : $scope.startDate, $lt : $scope.endDate}}, 
			group : {
				_id: {
					year : { $year: "$date" },        
					month : { $month: "$date" },        
				},
				costByMonth: { $sum: "$cost" }
			}, 
			sort : {"_id.year":1, "_id.month":1}
		} 

		Stats.getTotalCostByMonth(data, function (result) {
			statsCostByMonth(result);
			statsCumulCostByMonth(result);
		});
	}


}])

