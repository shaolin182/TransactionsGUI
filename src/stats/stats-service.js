'use strict';

function statsService($resource) {

	var statsService = {};

	/**
	* Query for aggregate data and retrieve statistics by category
	*/
	var aggregateDataByCategory = {
		match : {}, 
		group : {
			_id: "$category.category",
			total: { $sum: "$cost" }
		}, 
		sort : {"_id":1}
	}

	/**
	* Query for aggregate data and retrive global statistics
	*/
	var aggregateDataGlobal = {
		match : {}, 
		group : {
			_id: {
				year : { $year: "$date" },        
				month : { $month: "$date" },        
			},
			total: { $sum: "$cost" }
		}, 
		sort : {"_id.year":1, "_id.month":1}
	} 

	/*
	* Contains an array of sums by month
	*/ 
	var sumByMonth = [];

	/**
	* Init resource module for accessing server
	*/
	statsService.getResource = function () {
		return $resource('http://localhost:8080/stats', null, {
			aggregateData: {method:'POST', params: {match : '@match', group : '@group', sort : '@sort'}, url:'http://localhost:8080/stats/aggregateData', isArray:true} , 
		});
	}

	function isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

	/*
	* Call remote application for obtaining aggregate data
	*
	* @Param
	* query : query run on database
	* match : filter applied on query
	* transform : a function for converting results
	*/
	statsService.aggregateData = function (query, match, transform) {
		return new Promise(function (resolve, reject) {

			if (query.match.$and == undefined) {
				query.match = match;
			} else {
				var indexDate = query.match.$and.findIndex(function (currentElement) {
					return currentElement.date != undefined;
				})
				if (indexDate != -1) {
					query.match.$and[indexDate] = match;
				} else {
					if (!isEmpty(match)) {
						query.match.$and.push(match);
					}
				}
			}

			console.log(query.match);

			statsService.getResource().aggregateData(query).$promise
			.then (function (results) {
				var response = transform(results);
				resolve(response);
			})
			.catch (function (err) {
				reject(err);
			})
		});
	}

	/**
	* Apply filter sets by user and retrieve statistics about balance by month
	*/
	statsService.getBalanceByMonth = function (match) {
		return statsService.aggregateData(aggregateDataGlobal, match, transformBalanceByMonth);
	}

	/**
	* Apply filter sets by user and retrieve global statistics about sum of balance by month
	*/
	statsService.getSumBalanceByMonth = function (match) {
		return statsService.aggregateData(aggregateDataGlobal, match, transformSumBalanceByMonth);
	}

	/**
	* Apply filter sets by user and retrieve statistics by category
	*/
	statsService.getStatByCategory = function (match) {
		return statsService.aggregateData(aggregateDataByCategory, match, transformStatsByCategory);
	}

	/*
	* Transform results returned from back office about stats by category into readable data
	*/
	function transformStatsByCategory (results) {
		var response = {};

		var resultFiltered = results.filter(function (currentElement) {
			if (currentElement._id != "Revenu" && currentElement._id != null) {
				return true;
			}
		})

		response.labels = resultFiltered.map(getLabelId);
		response.series = resultFiltered.map(getLabelId);
		response.data = resultFiltered
		.map(convertCentToDecimal)
		.map(convertToPositiveNumber);

		return response;
	}

	function transformBalanceByMonth (results) {
		var response = {};

		response.labels = results.map(getLabelYearAndMonth);
		response.data = results.map(convertCentToDecimal)
		response.chartColor = results.map(getSpecificColor);

		return response;
	}

	function transformSumBalanceByMonth (results) {
		var response = {};

		results.forEach(sumBalanceByMonth);

		response.labels = results.map(getLabelYearAndMonth);
		response.chartColor = results.map(getSpecificColor);
		response.data = sumByMonth;

		return response;
	}

	/**
	* Build label for data chart by using _id property
	*/
	function getLabelId(currentElement) {
		return currentElement._id;
	}

	/**
	* As data from our service contains data into cent format we convert it into decimal format
	*/
	function convertCentToDecimal(currentElement) {
		return currentElement.total / 100;
	}

	/*
	* As stats by category can be a negative value, we transform it to poistive in order to display pie chart
	*/
	function convertToPositiveNumber(currentElement) {
		return 0-currentElement;
	}

	/**
	* Build label for data chart by concatening year to month
	*/
	function getLabelYearAndMonth (currentElement) {
		return currentElement._id.year + "-" + currentElement._id.month;
	}

	/*
	* For bar chart, return a specific color
	*/
	function getSpecificColor(currentElement) {
		return "rgb(54,172,207)";
	}

	/*
	* Build an array in which each element is the sum of the current element and the previous one
	*/
	function sumBalanceByMonth(currentElement, index) {
		
		var currentElementInDecimal = currentElement.total / 100;
		if (index > 0) {
			sumByMonth.push(currentElementInDecimal + sumByMonth[index - 1]) ;
		} else {
			sumByMonth.push(currentElementInDecimal);		
		}
	}

	return statsService;
}

angular
.module('statsServiceModule', ['ngResource'])
.factory('Stats', ['$resource', statsService]);