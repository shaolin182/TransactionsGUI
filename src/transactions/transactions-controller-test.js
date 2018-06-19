'use strict';

/**
* Unit test transactions controllers
*/ 
describe('TransactionsCtrl', function(){

	var $scope;
	var ctrl;
	var deferred;
	var mockTransaction, mockResource;

	// Load transactions modules
	beforeEach(module('transactionsController'));

	beforeEach(inject(function($controller, _$q_, _$rootScope_, $mdDialog) {
		var $q = _$q_;
		$scope = _$rootScope_.$new();

		deferred = $q.defer();

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
		mockResource.remove.returns({$promise : deferred.promise});

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

	/**
	* Unit test about adding a new transaction
	*/
	describe('initTransaction', function(){

		it('a new transaction should have correct defaults value', function (done) {

			// Test adding a new element
			var transaction = ctrl.initTransaction();

			assert.equal(0, transaction.income, 'Income default value is incorrect');
			assert.equal(0, transaction.outcome, 'Outcome default value is incorrect');
			assert.isOk(transaction.date instanceof Date, 'property date is not roperly instanciated');

			done();
		});
	});

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
	* Unit Test about adding a new transaction.
	* List of transactions should be increased by one, new transaction should have default value and an id
	*/
	describe ('addNewTransaction', function (){

		it ('Adding a transaction should add an element to items list', function (done) {

			ctrl.addNewTransaction();

			deferred.resolve({
				income:0,
				outcome:0,
				date:"2017-05-08T17:00:34.642Z",
				_id:12345
			});

			$scope.$apply();

			assert.isOk(mockResource.save.calledOnce, 'saving transaction should be called once');
			assert.equal(1, $scope.items.length, 'should have a new element in item list');
			assert.equal(12345, $scope.items[0].transaction._id, 'should have an id');
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

		/**
		* BeforeEach 
		*	init items list
		*	item selected items list (maybe in each method)
		*/ 
		it ('Delete transactions should remove elements from list', function (done) {

			ctrl.deleteTransaction();

			deferred.resolve({});

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