'use strict';

var transactionsDialogController = angular.module('transactionsDialogController', []);

transactionsDialogController.controller('TransactionsDialogCtrl', ['$scope', '$mdDialog', 'Categories', 'BankAccount', 'Transactions', function ($scope, $mdDialog, Categories, BankAccount, Transactions) {

	var self = this;

	/*
	* Init new transaction with default values
	* Called when we run the popup and when we click on 'Add' button
	*/ 
	self.initTransaction = function () {
		return {
			income:0,
			outcome:0,
			date: new Date(),
			multi: false
		};
	}

	/**
	* Init Transaction
	*/
	$scope.transaction = self.initTransaction();

	/**
	* Contains sub transaction selected by user
	*/
	$scope.subTransactionSelected = [];

	/*
	* Load categories list for dropdown list
	*/
	$scope.categories = Categories.getCategories();

	/*
	* Load Bank Account list for dropdown list
	*/
	$scope.bankaccountList = BankAccount.getBankAccount();

	/**
	* Init a sub transaction with default value
	*/
	self.initSubTransaction = function () {
		return 	{
			income:0,
			outcome:0
		};
	}

	self.reinitTransaction = function () {
		$scope.transaction.income = 0;
		$scope.transaction.outcome = 0;
		$scope.transaction.multi = false;
	}

	/*
	* Given the 'multi' property we init sub transaction if it's true, we delete it otherwise
	*/
	self.onMultiChange = function () {
		if ($scope.transaction.multi) {
			$scope.transaction.subtransaction = [];
			self.addSubTransaction();
			$scope.transaction.category = {id:0, category:'Multi', label:'Multi'};
		} else {
			self.cleanSubTransaction();
		}
	}

	/*
	* On Click on 'Add' Button from sub transaction part
	* Init a new sub transaction
	*/
	self.addSubTransaction = function () {
		$scope.transaction.subtransaction.push(self.initSubTransaction());
	}

	/**
	* On click on 'Remove' button from sub transaction part
	* Remove selected item from list
	*/
	self.removeSubTransaction = function (subtransaction) {

		$scope.subTransactionSelected.forEach(function (currentElement){
			var index=$scope.transaction.subtransaction.indexOf(currentElement)
			$scope.transaction.subtransaction.splice(index,1);
			$scope.subTransactionSelected = [];
		});
	}

	/*
	* Remove sub transaction from transaction object, also clean category property
	*/ 
	self.cleanSubTransaction = function () {
		delete $scope.transaction.subtransaction;
		delete $scope.transaction.category;
	}

	/*
     * Close current modal dialog
     */
     self.closeDialog = function() {
     	$mdDialog.cancel();
     };

     /*
     * Add a new transaction and init another one
     */
     self.addDialog = function() {
     	Transactions.save($scope.transaction).$promise
     	.then (function (result) {
     		$scope.transaction = self.initTransaction();
     	});	

     }

     /**
     * Create or edit new transaction
     */ 
     self.okDialog = function() {

     	Transactions.save($scope.transaction).$promise
     	.then (function (result) {
     		$mdDialog.hide();
     	});	     	
     }
 }]);