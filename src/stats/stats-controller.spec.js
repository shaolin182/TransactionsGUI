"use strict";

describe ("Unit Testing of controller StatsCtrl", function () {

	/*
	* Angularjs service used for instantiating controller
	*/
	var $controller;

	/*
	* Mock for stat service module
	*/
	var mockStatService, mockStatFilter;

	/*
	* Mock scope used for unit test
	*/
	var $scope;

	/*
	* Mock promises
	*/
	var deferred;

	/*
	* Controller to unit test
	*/
	var controller;

	var $timeout;


	/*
	* Load stats controller module before each test
	*/
	beforeEach(module('statsController'));

	/*
	* Inject $controller service.The injector unwraps the underscores (_) from around the parameter names when matching	
	* Mock the service Stats
	*/
	beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _$timeout_){	    
		$controller = _$controller_;
		$timeout = _$timeout_;

		var $q = _$q_;
		deferred = $q.defer();

		// Init scope
		$scope = _$rootScope_.$new();
		
		mockStatFilter = sinon.stub({});
		mockStatService = sinon.stub({
			getBalanceByMonth : function (){},
			getBalanceByYear : function (){},
			getSumBalanceByMonth : function (){}
		})

		mockStatService.getBalanceByMonth.returns(deferred.promise);	
		mockStatService.getBalanceByYear.returns(deferred.promise);
		mockStatService.getSumBalanceByMonth.returns(deferred.promise);

		controller = $controller('StatsCtrl', { $scope: $scope, Stats : mockStatService, StatsFilter : mockStatFilter });
	}));

	it("Loading statistics should called each specific function", function (done) {

		controller.loadStatBalanceByMonth = sinon.spy();
		controller.loadStatBalanceByYear = sinon.spy();
		controller.loadStatSumBalanceByMonth = sinon.spy();

		controller.loadStatistics();

		assert.isOk(controller.loadStatBalanceByMonth.calledOnce, 'loadStatBalanceByMonth function should be called when module boots');
		assert.isOk(controller.loadStatBalanceByYear.calledOnce, 'loadStatBalanceByYear function should be called when module boots');
		assert.isOk(controller.loadStatSumBalanceByMonth.calledOnce, 'loadStatSumBalanceByMonth function should be called when module boots');

		done();
	});

	it ("Unit Test for function loadStatBalanceByMonth", function (done) {
		controller.loadStatBalanceByMonth();

		deferred.resolve(['loadStatBalanceByMonth']);
		$scope.$apply();

		assert.isOk(mockStatService.getBalanceByMonth.calledTwice, 'getBalanceByMonth function should be called when twice, once when module boots, once when function is called');
		assert.equal($scope.costByMonth[0], 'loadStatBalanceByMonth');
		assert.equal($scope.costByMonth.title, 'Solde par mois');
		assert.equal($scope.costByMonth.type, 'bar');

		done();
	});

	it ("Unit Test for function loadStatSumBalanceByMonth", function (done) {
		controller.loadStatSumBalanceByMonth();

		deferred.resolve(['loadStatSumBalanceByMonth']);
		
		$scope.$apply();

		assert.isOk(mockStatService.getSumBalanceByMonth.calledTwice, 'getSumBalanceByMonth function should be called when twice, once when module boots, once when function is called');
		//assert.equal($scope.cumulByMonth[0], 'loadStatSumBalanceByMonth');
		assert.equal($scope.cumulByMonth.title, 'Cumul des soldes par mois');
		assert.equal($scope.cumulByMonth.type, 'bar');

		done();
	});

	it ("Unit Test for applyFilter function", function (done) {

		controller.loadStatistics = sinon.spy();
		$scope.filter.startDate = "24071984";
		$scope.filter.endDate = "04091984";

		$scope.filter.applyFilter();

		assert.isOk(controller.loadStatistics.calledOnce, 'loadStatistics function should be called once');
		assert.isOk(controller.matchRequest.date.$gt, $scope.filter.startDate);
		assert.isOk(controller.matchRequest.date.$lt, $scope.filter.endDate);

		done();
	});
});