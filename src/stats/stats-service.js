'use strict';

function statsService($resource) {
    const statsService = {};

    /**
	* Init resource module for accessing server
	*/
    statsService.getResource = function() {
        return $resource('http://localhost:8080/stats', null, {
            totalCostByMonth: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByMonth', isArray: true},
            totalCostByYear: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByYear', isArray: true},
            totalCostByCategory: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByCategory', isArray: true},
            totalCostByCategoryAndMonth: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByCategoryAndMonth', isArray: true},
            totalCostByCategoryAndYear: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByCategoryAndYear', isArray: true},
            totalCostByAccountAndMonth: {method: 'POST', params: {}, url: 'http://localhost:8080/stats/totalCostByAccountAndMonth', isArray: true},
        });
    };

    /**
	* Apply filter sets by user and retrieve statistics about balance by month
	*/
    statsService.getBalanceByMonth = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByMonth(match).$promise
                .then(function(results) {
                    resolve(transformBalance(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
	* Apply filter sets by user and retrieve statistics about balance by month
	*/
    statsService.getBalanceByYear = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByYear(match).$promise
                .then(function(results) {
                    resolve(transformBalance(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
	* Apply filter sets by user and retrieve global statistics about sum of balance by month
	*/
    statsService.getSumBalanceByMonth = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByMonth(match).$promise
                .then(function(results) {
                    resolve(transformSumBalanceByMonth(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
	* Apply filter sets by user and retrieve statistics by category
	*/
    statsService.getStatByCategory = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByCategory(match).$promise
                .then(function(results) {
                    resolve(transformStatsByCategory(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
	* Apply filter sets by user and retrieve statistics by category over month
	*/
    statsService.getStatByCategoryOverMonth = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByCategoryAndMonth(match).$promise
                .then(function(results) {
                    resolve(transformStatsByCategoryOverMonth(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
	* Apply filter sets by user and retrieve statistics by category over month
	*/
    statsService.getStatByCategoryOverYear = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByCategoryAndYear(match).$promise
                .then(function(results) {
                    resolve(transformStatsByCategoryOverYear(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /*
	* Apply filter sets by user and retrieve statistics by account type
	*/
    statsService.getOutcomeByAccountType = function(match) {
        return new Promise(function(resolve, reject) {
            return statsService.getResource().totalCostByAccountAndMonth(match).$promise
                .then(function(results) {
                    resolve(transformOutcomeByAccountType(results));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /*
	* Transform results returned from back office about stats by category into readable data
	*/
    function transformStatsByCategory(results) {
        const response = {};

        const resultFiltered = results.filter(function(currentElement) {
            if (currentElement._id != 'Revenu' && currentElement._id != null) {
                return true;
            }
        });

        response.labels = resultFiltered.map(statsService.getLabelId);
        response.series = resultFiltered.map(statsService.getLabelId);
        response.data = resultFiltered
            .map(statsService.getTotal)
            .map(statsService.convertCentToUnit)
            .map(statsService.convertToPositiveNumber);

        return response;
    }

    function transformStatsByCategoryOverMonth(results) {
        const response = {};

        const resultFiltered = results.filter(function(currentElement) {
            if (currentElement._id.category != 'Revenu' && currentElement._id.category != null) {
                return true;
            }
        });

        response.labels = statsService.extractDistinctInfoFromData(resultFiltered, statsService.getPeriod);
        response.series = statsService.extractDistinctInfoFromData(resultFiltered, statsService.getFieldValueFromId, 'category');
        resultFiltered.forEach(function(currentElement) {
            currentElement.total = statsService.convertCentToUnit(currentElement.total);
            currentElement.total = statsService.convertToPositiveNumber(currentElement.total);
        });

        response.data = statsService.convertResultToSeries(resultFiltered, 'category');

        return response;
    }

    function transformStatsByCategoryOverYear(results) {
        const response = {};

        const resultFiltered = results.filter(function(currentElement) {
            if (currentElement._id.category != 'Revenu' && currentElement._id.category != null) {
                return true;
            }
        });

        response.labels = statsService.extractDistinctInfoFromData(resultFiltered, statsService.getPeriod);
        response.series = statsService.extractDistinctInfoFromData(resultFiltered, statsService.getFieldValueFromId, 'category');
        resultFiltered.forEach(function(currentElement) {
            currentElement.total = statsService.convertCentToUnit(currentElement.total);
            currentElement.total = statsService.convertToPositiveNumber(currentElement.total);
        });

        response.data = statsService.convertResultToSeries(resultFiltered, 'category');

        return response;
    }

    function transformBalance(results) {
        const response = {};

        response.labels = results.map(statsService.getPeriod);
        response.data = results
            .map(statsService.getTotal)
            .map(statsService.convertCentToUnit);
        response.chartColor = results.map(getSpecificColor);

        return response;
    }

    function transformSumBalanceByMonth(results) {
        const response = transformBalance(results);
        response.data = response.data
            .map(statsService.addTotalToPreviousElement);

        return response;
    }

    /*
	* Transform result from database query into readable format for chart.js plugin
	*/
    function transformOutcomeByAccountType(results) {
        const response = {};

        response.labels = statsService.extractDistinctInfoFromData(results, statsService.getPeriod);
        response.series = statsService.extractDistinctInfoFromData(results, statsService.getFieldValueFromId, 'accountType');
        results.forEach(function(currentElement) {
            currentElement.total = statsService.convertCentToUnit(currentElement.total);
        });
        response.data = statsService.convertResultToSeries(results, 'accountType');

        return response;
    }

    /**
	* Build label for data chart by using _id property
	*/
    statsService.getLabelId = function(currentElement) {
        return currentElement._id;
    };

    /*
	* Return total property or 0 if it does not exist
	*/
    statsService.getTotal = function(currentElement) {
        if (currentElement && currentElement.total) {
            return currentElement.total;
        } else {
            return 0;
        }
    };

    /**
	* As data from our service contains data into cent format we convert it into unit format
	*/
    statsService.convertCentToUnit = function(currentElement) {
        return currentElement / 100;
    };

    /*
	* As stats by category can be a negative value, we transform it to poistive in order to display pie chart
	*/
    statsService.convertToPositiveNumber = function(currentElement) {
        return 0-currentElement;
    };

    /*
	* For bar chart, return a specific color
	*/
    function getSpecificColor(currentElement) {
        return 'rgb(54,172,207)';
    }

    /*
	* Build an array in which each element is the sum of the current element and the previous one
	*/
    statsService.addTotalToPreviousElement = function(currentElement, index, array) {
        const result = array.reduce(function(previousResult, currentElement, currentIndex) {
            if (currentIndex < index) {
                return previousResult + currentElement;
            } else {
                return previousResult;
            }
        }, 0);
        return currentElement + result;
    };

    /*
	* Build an array of label from some data
	* @param
	* data : source data
	* jsFunction : JS function used to extract data
	*/
    statsService.extractDistinctInfoFromData = function(data, jsFunction, field) {
        const result = [];
        data.forEach(function(currentElement) {
            const item = jsFunction(currentElement, field);
            if (result.indexOf(item) == -1) {
                result.push(item);
            }
        });

        return result;
    };

    /* Return a period wit format 'year-month' */
    statsService.getPeriod = function(currentElement) {
        if (currentElement && currentElement._id) {
            if (currentElement._id.month) {
                return currentElement._id.year + '-' + currentElement._id.month;
            }
            return currentElement._id.year;
        }
        return '';
    };

    /* Return a property from id*/
    statsService.getFieldValueFromId = function(currentElement, field) {
        if (currentElement && currentElement._id && currentElement._id[field]) {
            return currentElement._id[field];
        }
        return '';
    };

    /*
	* Transform result from database into result for chart.js framework
	*
	* Sample Result from database are : [{"_id":{"year":2011,"month":1,"accountType":"Perso"},"total":50}, {"_id":{"year":2011,"month":2,"accountType":"Perso"},"total":50}, {"_id":{"year":2011,"month":2,"accountType":"Commun"},"total":13}, {"_id":{"year":2011,"month":3,"accountType":"PEE"},"total":150}]
	* And should be transform into [[50, 50, 0], [0, 13, 0], [0, 0, 150]]
	*
	* Result must be a list of array. There are one item in the list for each month
	* There are one item in the array for each account type
	*/
    statsService.convertResultToSeries = function(data, field) {
        let result = [];
        const periodMap = new Map();
        const seriesMap = new Map(); ;
        let keyPeriod; let keySeries; let index;
        const defaultItem = [];

        data.forEach(function(currentElement) {
            // Create a new element in map for each series (a serie is defined by the property field)
            // For each series, add an item for each month
            keySeries = currentElement._id[field];
            if (seriesMap.get(keySeries) == undefined) {
                seriesMap.set(keySeries, []);
            }
            seriesMap.get(keySeries).push({'date': currentElement._id.year + '' + currentElement._id.month, 'total': currentElement.total});

            // Create map for each month, used in further process to find index of the month in series
            keyPeriod = currentElement._id.year + '' + currentElement._id.month;
            if (periodMap.get(keyPeriod) == undefined) {
                periodMap.set(keyPeriod, periodMap.size);
                defaultItem.push(0);
            }
        });

        // Create a new Tab with same size and each item is a sub tab with only 0 inside it.
        result = Array.from(seriesMap).map(function(currentElement) {
            return defaultItem.slice(0);
        });

        Array.from(seriesMap).forEach(function(currentElement, currentIndex) {
            currentElement[1].forEach(function(currentItem) {
                index = periodMap.get(currentItem.date);
                result[currentIndex][index] = currentItem.total;
            });
        });

        return result;
    };
    return statsService;
}

angular
    .module('statsServiceModule', ['ngResource'])
    .factory('Stats', ['$resource', statsService]);
