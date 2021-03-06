'use strict';

describe('Unit Testing of controller StatsCategoryCtrl', function() {
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
    beforeEach(module('statsCategoryController'));

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
            getStatByCategory: function() {},
            getStatByCategoryOverMonth: function() {},
            getStatByCategoryOverYear: function() {},
        });

        mockStatService.getStatByCategory.returns(deferred.promise);
        mockStatService.getStatByCategoryOverMonth.returns(deferred.promise);
        mockStatService.getStatByCategoryOverYear.returns(deferred.promise);

        controller = $controller('StatsCategoryCtrl', {$scope: $scope, Stats: mockStatService, StatsFilter: mockStatFilter});
    }));

    it('Loading statistics should called each specific function', function(done) {
        controller.loadStatByCategory = sinon.spy();
        controller.loadStatByCategoryOverMonth = sinon.spy();
        controller.loadStatistics();
        assert.isOk(controller.loadStatByCategory.calledOnce, 'loadStatByCategory function should be called when module boots');
        assert.isOk(controller.loadStatByCategoryOverMonth.calledOnce, 'loadStatByCategoryOverMonth function should be called when module boots');

        done();
    });

    it('Unit Test for function loadStatByCategory', function(done) {
        controller.loadStatByCategory();

        deferred.resolve(['loadStatByCategory']);
        $scope.$apply();

        assert.isOk(mockStatService.getStatByCategory.calledThrice, 'getStatByCategory function should be called thrice, twice when module boots, once when function is called');
        assert.equal($scope.costByCategory[0], 'loadStatByCategory');
        assert.equal($scope.costByCategory.title, 'Dépenses par catégorie');
        assert.equal($scope.costByCategory.type, 'pie');
        assert.deepEqual($scope.costByCategory.options, {legend: {display: true, position: 'right'}});

        done();
    });
});
