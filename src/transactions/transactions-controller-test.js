'use strict';

/**
* Unit test transactions controllers
*/ 
describe('TransactionsCtrl', function(){

	var $scope;
	var ctrl;
	var deferred;
	var removeDefer;
	var mockTransaction, mockResource;

	// Load transactions modules
	beforeEach(module('transactionsController'));

	beforeEach(inject(function($controller, _$q_, _$rootScope_, $mdDialog) {
		var $q = _$q_;
		$scope = _$rootScope_.$new();

		deferred = $q.defer();
		removeDefer = $q.defer();

		mockTransaction =sinon.stub({
			getResource : function(){}
		});

		mockResource = sinon.stub({
			save : function () {}, 
			query : function() {}, 
			remove : function () {}
		});

		var mdDialog = $mdDialog;

		mockTransaction.getResource.returns(mockResource);

		mockResource.save.returns({$promise : deferred.promise});
		mockResource.remove.returns({$promise : removeDefer.promise});
		mockResource.query.returns({$promise : deferred.promise});

		var mockCategories = sinon.stub({getCategories : function() {}});

		var mockBankAccount = sinon.stub({getBankAccount : function () {}, getBankAccountTotal : function() {}, getBankAccountTotalByCategory : function() {}});

		ctrl = $controller('TransactionsCtrl', {
			$scope: $scope, 
			Transactions : mockTransaction, 
			Categories : mockCategories,
			BankAccount : mockBankAccount,
			$mdDialog : mdDialog
		});
	}));

	describe ('Load Transactions' , function () {

		it ("loadTransaction function should made a call to server and called function 'buildItemList'", function (done) {
			
			sinon.spy(ctrl, 'buildItemsList');
			ctrl.loadTransactions();
			
			deferred.resolve();

			$scope.$apply();

			assert.isOk(mockResource.query.calledOnce, "'query' method should be called once when we load transactions");
			assert.isOk(ctrl.buildItemsList.calledOnce, "'query' method should be called once when we load transactions");
			done();
		});

		it("'buildItemsList' function unit test - nominal case", function(done) {

			var data=[
				{'date':'2017-12-08T17:05:01.000Z'}, 
				{'date':'2017-12-11T17:05:01.000Z'}, 
				{'date':'2017-12-31T17:05:01.000Z'}, 
				{'date':'2018-01-08T17:05:01.000Z'}, 
				{'date':'2018-01-09T17:05:01.000Z'}, 
				{'date':'2018-03-01T17:05:01.000Z'}, 
				{'date':'2018-04-08T17:05:01.000Z'}, 
				{'date':'2018-04-08T17:06:01.000Z'}, 
				{'date':'2018-04-09T17:05:01.000Z'}, 
				{'date':'2019-06-08T17:05:01.000Z'}, 
				{'date':'2019-06-09T17:05:01.000Z'}, 
				{'date':'2019-06-30T17:05:01.000Z'}, 
				{'date':'2019-07-08T17:05:01.000Z'}, 
				{'date':'2019-08-08T17:05:01.000Z'}, 
				{'date':'2019-09-09T17:05:01.000Z'}
			];

			var result = ctrl.buildItemsList(data);

			var expectedResult = [
				{'group': 'Décembre 2017', 'dateToDisplay' : new Date("2017-12-08T17:05:01.000Z")},
				{'transaction': {'date':'2017-12-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2017-12-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2017-12-11T17:05:01.000Z'}, 'dateToDisplay' : new Date("2017-12-11T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2017-12-31T17:05:01.000Z'}, 'dateToDisplay' : new Date("2017-12-31T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Janvier 2018', 'dateToDisplay' : new Date("2018-01-08T17:05:01.000Z")},
				{'transaction': {'date':'2018-01-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2018-01-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2018-01-09T17:05:01.000Z'}, 'dateToDisplay' : new Date("2018-01-09T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Mars 2018', 'dateToDisplay' : new Date("2018-03-01T17:05:01.000Z")},
				{'transaction': {'date':'2018-03-01T17:05:01.000Z'}, 'dateToDisplay' : new Date("2018-03-01T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Avril 2018', 'dateToDisplay' : new Date("2018-04-08T17:05:01.000Z")},
				{'transaction': {'date':'2018-04-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2018-04-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2018-04-08T17:06:01.000Z'}, 'dateToDisplay' : new Date("2018-04-08T17:06:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2018-04-09T17:05:01.000Z'}, 'dateToDisplay' : new Date("2018-04-09T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Juin 2019', 'dateToDisplay' : new Date("2019-06-08T17:05:01.000Z")},
				{'transaction': {'date':'2019-06-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-06-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2019-06-09T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-06-09T17:05:01.000Z"), 'currentlySaving' : false},
				{'transaction': {'date':'2019-06-30T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-06-30T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Juillet 2019', 'dateToDisplay' : new Date("2019-07-08T17:05:01.000Z")},
				{'transaction': {'date':'2019-07-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-07-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Août 2019', 'dateToDisplay' : new Date("2019-08-08T17:05:01.000Z")},
				{'transaction': {'date':'2019-08-08T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-08-08T17:05:01.000Z"), 'currentlySaving' : false},
				{'group': 'Septembre 2019', 'dateToDisplay' : new Date("2019-09-09T17:05:01.000Z")},
				{'transaction': {'date':'2019-09-09T17:05:01.000Z'}, 'dateToDisplay' : new Date("2019-09-09T17:05:01.000Z"), 'currentlySaving' : false},
			];

			assert.equal(JSON.stringify(expectedResult), JSON.stringify(result), "Error in building items list from transactions");

			done();
		});
	})

	/**
	* Unit test about adding encapsulating a transaction object
	*/
	describe('encapsulateTransaction', function(){

		it('Encasuplating a transaction should initiate correct properties', function (done) {

			// Mock a transaction object
			var aTransaction = {
				income:5,
				outcome:0,
				date:"2017-05-08T17:00:34.642Z"
			};

			// Encapsulate
			var item = ctrl.encapsulateTransaction(aTransaction);

			assert.isOk(item.transaction === aTransaction, 'property transaction from encapsulated object is not identical to original object');
			assert.isNotOk(item.currentlySaving, 'property currentlySaving shoudl equals to false at init');
			assert.equal(aTransaction.date, item.dateToDisplay.toISOString(), 'Displayed date and transaction date are not the same');

			done();
		});
	});

	/**
	* Unit Test about deleting a transaction.
	* List of transactions should be decreased
	*/
	describe ('deleteTransaction', function (){

		/**
		* Init items list and selected items list
		*/
		beforeEach(function () {
			$scope.items = [{transaction:{_id:1}},{transaction:{_id:2}},{transaction:{_id:3}},{transaction:{_id:4}},{transaction:{_id:5}},{transaction:{_id:6}}]
			$scope.itemSelected = [{transaction:{_id:2}},{transaction:{_id:5}},{transaction:{_id:6}}];
		});

		it("Unit Test for updateSelectedList function ", function(done) {

			$scope.items[0].selected = true;
			ctrl.updateSelectedList($scope.items[0]);

			assert.equal(4, $scope.itemSelected.length, "$scope.itemSelected should have one more element");

			$scope.items[0].selected = false;
			ctrl.updateSelectedList($scope.items[0]);

			assert.equal(3, $scope.itemSelected.length, "$scope.itemSelected should have one less element");

			$scope.items[1].selected = false;
			ctrl.updateSelectedList($scope.items[1]);

			assert.equal(2, $scope.itemSelected.length, "$scope.itemSelected should have one less element");

			$scope.items[2].selected = false;
			ctrl.updateSelectedList($scope.items[2]);

			assert.equal(2, $scope.itemSelected.length, "$scope.itemSelected should have same number of element");

			done();
		})

		/**
		*	Make sure item selected are deleted
		*/ 
		it ('Delete transactions should remove elements from list', function (done) {

			ctrl.deleteTransaction();

			removeDefer.resolve({});

			$scope.$apply();

			assert.equal(3, $scope.items.length, 'should have 3 elements now');
			assert.sameDeepMembers([{transaction:{_id:1}},{transaction:{_id:3}},{transaction:{_id:4}}], $scope.items, 'only 1,3 et 4 transaction should exist');
			assert.isOk(mockResource.remove.calledThrice, 'remove moethod shoud have been called three times');
			assert.deepEqual({id:2}, mockResource.remove.getCall(0).args[0], '1st Call should delete element with id 2');
			assert.deepEqual({id:5}, mockResource.remove.getCall(1).args[0], '2nd Call should delete element with id 5');
			assert.deepEqual({id:6}, mockResource.remove.getCall(2).args[0], '3rd Call should delete element with id 6');
			assert.equal(0, $scope.itemSelected.length, 'selected item should be empty');
			done();
		});
	});
});