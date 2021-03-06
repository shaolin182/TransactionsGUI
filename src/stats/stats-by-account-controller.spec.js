'use strict';

describe('Unit Testing of controller StatsAccountCtrl', function() {
    /*
	* Angularjs service used for instantiating controller
	*/
    let $controller;

    /*
	* Mock for stat service module
	*/
    let mockStatService; let mockStatFilter;

    /*
	* Mock scope used for unit test
	*/
    let $scope;

    /*
	* Mock promises
	*/
    let deferred;

    /*
	* Controller to unit test
	*/
    let controller;

    /*
	* Load stats controller module before each test
	*/
    beforeEach(module('statsAccountController'));

    /*
	* Inject $controller service.The injector unwraps the underscores (_) from around the parameter names when matching
	* Mock the service Stats
	*/
    beforeEach(inject(function(_$controller_, _$q_, _$rootScope_) {
        $controller = _$controller_;

        const $q = _$q_;
        deferred = $q.defer();

        // Init scope
        $scope = _$rootScope_.$new();

        mockStatFilter = sinon.stub({});
        mockStatService = sinon.stub({
            getOutcomeByAccountType: function() {},
        });

        mockStatService.getOutcomeByAccountType.returns(deferred.promise);

        controller = $controller('StatsAccountCtrl', {$scope: $scope, Stats: mockStatService, StatsFilter: mockStatFilter});
    }));

    it('Loading statistics should called each specific function', function(done) {
        controller.loadOutcomeByAccountType = sinon.spy();
        controller.loadStatistics();
        assert.isOk(controller.loadOutcomeByAccountType.calledOnce, 'loadOutcomeByAccountType function should be called when module boots');

        done();
    });
});
