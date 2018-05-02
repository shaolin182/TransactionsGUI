"use strict";

describe ("Unit Testing of controller StatsCtrl", function () {

	/*
	* Angularjs service used for instantiating controller
	*/
	var $controller;

	/*
	* Mock for stat service module
	*/
	var mockStatService;

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


	/*
	* Load stats controller module before each test
	*/
	beforeEach(module('statsController'));

	/*
	* Inject $controller service.The injector unwraps the underscores (_) from around the parameter names when matching	
	* Mock the service Stats
	*/
	beforeEach(inject(function(_$controller_, _$q_, _$rootScope_){	    
		$controller = _$controller_;

		var $q = _$q_;
		deferred = $q.defer();

		// Init scope
		$scope = _$rootScope_.$new();

		mockStatService = sinon.stub({
			getBalanceByMonth : function (){},
			getStatByCategory : function (){}, 
			getSumBalanceByMonth : function (){}
		})

		mockStatService.getBalanceByMonth.returns(deferred.promise);	
		mockStatService.getStatByCategory.returns(deferred.promise);
		mockStatService.getSumBalanceByMonth.returns(deferred.promise);	

		controller = $controller('StatsCtrl', { $scope: $scope, Stats : mockStatService });
	}));

	it("Loading statistics should called each specific function", function (done) {

		controller.loadStatBalanceByMonth = sinon.spy();
		controller.loadStatSumBalanceByMonth = sinon.spy();
		controller.loadStatByCategory = sinon.spy();

		controller.loadStatistics();

		assert.isOk(controller.loadStatBalanceByMonth.calledOnce, 'loadStatBalanceByMonth function should be called when module boots');
		assert.isOk(controller.loadStatByCategory.calledOnce, 'loadStatByCategory function should be called when module boots');
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
		assert.equal($scope.cumulByMonth[0], 'loadStatSumBalanceByMonth');
		assert.equal($scope.cumulByMonth.title, 'Cumul des soldes par mois');
		assert.equal($scope.cumulByMonth.type, 'bar');

		done();
	});

	it ("Unit Test for function loadStatByCategory", function (done) {
		controller.loadStatByCategory();

		deferred.resolve(['loadStatByCategory']);
		$scope.$apply();

		assert.isOk(mockStatService.getStatByCategory.calledTwice, 'getStatByCategory function should be called when twice, once when module boots, once when function is called');
		assert.equal($scope.costByCategory[0], 'loadStatByCategory');
		assert.equal($scope.costByCategory.title, 'Dépenses par catégorie');
		assert.equal($scope.costByCategory.type, 'pie');
		assert.deepEqual($scope.costByCategory.options, {legend: {display: true, position:'right'}});

		done();
	});

	it ("Unit Test for applyFilter function", function (done) {

		controller.loadStatistics = sinon.spy();
		$scope.filter.startDate = "24071984";
		$scope.filter.endDate = "04091984";

		controller.applyFilter();

		assert.isOk(controller.loadStatistics.calledOnce, 'loadStatistics function should be called once');
		assert.isOk(controller.matchRequest.date.$gt, $scope.filter.startDate);
		assert.isOk(controller.matchRequest.date.$lt, $scope.filter.endDate);

		done();
	});
});