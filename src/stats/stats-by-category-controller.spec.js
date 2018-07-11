"use strict";

describe ("Unit Testing of controller StatsCategoryCtrl", function () {

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
    beforeEach(module('statsCategoryController'));
    
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
			getStatByCategory : function (){},
			getStatByCategoryOverMonth : function(){}
		})

		mockStatService.getStatByCategory.returns(deferred.promise);
		mockStatService.getStatByCategoryOverMonth.returns(deferred.promise);

		controller = $controller('StatsCategoryCtrl', { $scope: $scope, Stats : mockStatService });
	}));

	it("Loading statistics should called each specific function", function (done) {

		controller.loadStatByCategory = sinon.spy();
		controller.loadStatByCategoryOverMonth = sinon.spy();
		controller.loadStatistics();
		assert.isOk(controller.loadStatByCategory.calledOnce, 'loadStatByCategory function should be called when module boots');
		assert.isOk(controller.loadStatByCategoryOverMonth.calledOnce, 'loadStatByCategoryOverMonth function should be called when module boots');

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
});