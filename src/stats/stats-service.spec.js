"use strict";

describe ("Unit Testing of statsService module", function () {

	/*
	* Stats services - Service to test
	*/
	var Stats;

	// it("statsByCategory should populate $scope.costByCategory property", function (done) {
	// 	var controller = $controller('StatsCtrl', { $scope: $scope, Stats : mockStatService });

	// 	var result = [ {"_id" : {"year" : 2014, "month" : 12}, "total" : 100}, 
	// 	{"_id" : {"year" : 2015, "month" : 1}, "total" : 101},
	// 	{"_id" : {"year" : 2015, "month" : 2}, "total" : 105},
	// 	{"_id" : {"year" : 2015, "month" : 3}, "total" : 1000},
	// 	{"_id" : {"year" : 2015, "month" : 4}, "total" : 201},
	// 	{"_id" : {"year" : 2015, "month" : 5}, "total" : -500},
	// 	{"_id" : {"year" : 2015, "month" : 6}, "total" : 0},
	// 	{"_id" : {"year" : 2015, "month" : 7}, "total" : 93},
	// 	{"_id" : {"year" : 2015, "month" : 8}, "total" : 12},
	// 	{"_id" : {"year" : 2015, "month" : 9}, "total" : -12.5}]

	// 	controller.statsBalanceByMonth(result);

	// 	assert.deepEqual($scope.costByMonth.labels, ['2014-12', '2015-1' ,'2015-2' ,'2015-3' ,'2015-4' ,'2015-5' ,'2015-6' ,'2015-7' ,'2015-8' ,'2015-9']);

	// 	done();
	// })

	// it("Return the concatenation of month and year", function (done) {
	// 	var controller = $controller('StatsCtrl', { $scope: $scope, Stats : mockStatService });
	// 	var element = {
	// 		"_id" : {
	// 			"year" : "2018", 
	// 			"month" : "02"
	// 		}

	// 	}

	// 	controller.getLabelYearAndMonth(element).should.eql("2018-02");

	// 	done();

	// })
	var data;

	/*
	* Load stats services module module before each test
	*/
	beforeEach(module('statsServiceModule'));

	/*
	* Load Stats services in order to use it in further test
	*/
	beforeEach(inject(function(_Stats_) {
		Stats = _Stats_;
	}));

	describe ("Unit Tests for utility function", function () {
		it("Unit Test for getPeriod function - basic case", function (done) {
			data = {
				_id : {
					year:"2918", 
					month:"43"
				}
			}
			var result = Stats.getPeriod(data);
			result.should.equal("2918-43", "Period returned should be equals to 2918-43");

			done();
		});

		it("Unit Test for getPeriod function - exception case - missing property", function (done) {
			data = {
				_id : {
					year:"2918"
				}
			}
			var result = Stats.getPeriod(data);
			result.should.equal("2918", "Period returned should be equals to 2918");

			done();
		});

		it("Unit Test for getPeriod function - exception case - no input data", function (done) {
			data = {};
			var result = Stats.getPeriod(data);
			result.should.equal("", "Period returned should be equals to empty");

			done();
		});

		it("Unit test for 'getFieldValueFromId' function - nominal case", function (done) {
			data={'_id' : {'aField' : 'aFieldValue'}};
			var result = Stats.getFieldValueFromId(data, 'aField');
			result.should.equal('aFieldValue', "should return 'aFieldValue' ");

			done();
		});

		it("Unit test for 'getFieldValueFromId' function - exception case - no matching field", function (done) {
			data={'_id' : {'aSecondField' : 'aFieldValue'}};
			var result = Stats.getFieldValueFromId(data, 'aField');
			result.should.equal('', "should return empty value");

			done();
		});

		it("Unit test for 'getFieldValueFromId' function - exception case - no data", function (done) {
			data={};
			var result = Stats.getFieldValueFromId(data, 'aField');
			result.should.equal('', "should return emptu value");

			done();
		});
	});

	describe("Unit test for manipulating chart data", function () {

		it("Unit test addTotalToPreviousElement function - nominal case 1", function(done){
			var array=[100,200,1500];

			var result = Stats.addTotalToPreviousElement(array[0], 0, array);

			result.should.equal(100, 'addTotalToPreviousElement should return 10 in this case');
			done();
		})

		it("Unit test addTotalToPreviousElement function - nominal case 2", function(done){
			var array=[100,200,1500, 4400];

			var result = Stats.addTotalToPreviousElement(array[2], 2, array);

			result.should.equal(1800, 'addTotalToPreviousElement should return 1800 in this case');
			done();
		});

		it("Unit test addTotalToPreviousElement function - nominal case - from Map function", function(done){
			var array=[100,200,1500, 4400];

			var result = array.map(Stats.addTotalToPreviousElement);

			result.should.deep.equal([100, 300, 1800, 6200], 'from map function should return a new array with of each element');
			done();
		});

		it ("Unit test for 'convertCentToUnit' function", function(done) {
			var result = Stats.convertCentToUnit(17300);
			result.should.equal(173, 'income data should be divided by 100');
			done();
		});

		it ("Unit test for 'convertToPositiveNumber' function", function(done) {
			var result = Stats.convertToPositiveNumber(-17300);
			result.should.equal(17300, 'income data should be positive');

			var result = Stats.convertToPositiveNumber(15);
			result.should.equal(-15, 'income data should be negative');
			done();
		});

		it ("Unit test for 'getTotal' function", function (done) {
			var result = Stats.getTotal({total:15});
			result.should.equal(15, "total should be extracted correctly");

			var result = Stats.getTotal({});
			result.should.equal(0, "0 should be returned if no total property exists");

			var result = Stats.getTotal({test:13});
			result.should.equal(0, "0 should be returned if no total property exists");

			var result = Stats.getTotal();
			result.should.equal(0, "0 should be returned if no total property exists");

			done();
		})

		it("Unit test for getLabelId function", function(done) {
			var result = Stats.getLabelId({_id:'unId'});
			result.should.equal('unId', 'should extract property _id');
			done();
		})
	});

	describe ("Unit test for function about building charts structure", function () {
		/*
		* Init data
		*/
		beforeEach(function() {
			data = [
				{"_id":{"year":2011,"month":1,"accountType":"Perso"},"total":50}, 
				{"_id":{"year":2011,"month":2,"accountType":"Perso"},"total":50}, 
				{"_id":{"year":2011,"month":2,"accountType":"Commun"},"total":13}, 
				{"_id":{"year":2011,"month":3,"accountType":"PEE"},"total":150},
				{"_id":{"year":2011,"month":4,"accountType":"Perso"},"total":50}, 
				{"_id":{"year":2011,"month":4,"accountType":"PEE"},"total":150},
				{"_id":{"year":2011,"month":4,"accountType":"Commun"},"total":13}, 
				{"_id":{"year":2012,"month":8,"accountType":"PEE"},"total":113}
			];
		});

		it("Compute series data for chart with field 'accountType'", function (done) {
			var result  = Stats.convertResultToSeries(data, 'accountType');
			result.should.deep.equal([[50, 50, 0, 50, 0], [0, 13, 0, 13, 0], [0, 0, 150, 150, 113]], "series should be correct");
			done();
		});

		it("Extract disctint data for accountType", function (done) {
			var result = Stats.extractDistinctInfoFromData(data, Stats.getFieldValueFromId, 'accountType'); 
			result.should.deep.equal(["Perso", "Commun", "PEE"], "series should contains 3 items")
			done();
		});

		it("Extract disctint data for accountType", function (done) {
			var result = Stats.extractDistinctInfoFromData(data, Stats.getPeriod);
			result.should.deep.equal(["2011-1", "2011-2", "2011-3", "2011-4", "2012-8"], "X axis labels should contains 5 items")
			done();
		});
	})
});