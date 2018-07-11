"use strict";

describe ("Unit Testing of controller StatsAccountCtrl", function () {

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
    beforeEach(module('statsAccountController'));
    
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
			getOutcomeByAccountType : function (){}
		})

		mockStatService.getOutcomeByAccountType.returns(deferred.promise);

		controller = $controller('StatsAccountCtrl', { $scope: $scope, Stats : mockStatService });
	}));

	it("Loading statistics should called each specific function", function (done) {

		controller.loadOutcomeByAccountType = sinon.spy();
		controller.loadStatistics();
		assert.isOk(controller.loadOutcomeByAccountType.calledOnce, 'loadOutcomeByAccountType function should be called when module boots');

		done();
	});
});