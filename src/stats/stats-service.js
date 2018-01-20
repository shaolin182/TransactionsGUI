'use strict';

function statsService($resource) {

	var statsService = {};


	statsService.getResource = function () {
		return $resource('http://localhost:8080/stats', null, {
			totalCostByMonth: {method:'GET', url:'http://localhost:8080/stats/totalCostByMonth', isArray:true} , 
			aggregateData: {method:'POST', params: {match : '@match', group : '@group', sort : '@sort'}, url:'http://localhost:8080/stats/aggregateData', isArray:true} , 
		});
	}

	statsService.getTotalCostByMonth = function (data, callback) {
		statsService.getResource().aggregateData(data, function (result) {
			callback(result);
		});
	}

	return statsService;

}

angular
.module('statsServiceModule', ['ngResource'])
.factory('Stats', ['$resource', statsService]);