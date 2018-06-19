'use strict';

var transactionsController = angular.module('transactionsController', ['ngMaterial']);
transactionsController.controller('TransactionsCtrl', ['$scope', 'Transactions', 'Categories', 'BankAccount', '$mdDialog', function ($scope, Transactions, Categories, BankAccount, $mdDialog) {

	var self = this;

	/**
	* If true, data table  is editable.
	*/
	$scope.editTable = false;

	/*
	* Default configuration about sorting and pagination, used in md-datatable directive
	*/
	$scope.query = {
		order: '-dateToDisplay', // default order
		limit: 20, // default page size
		page: 1,  // default page
		query:[5, 10, 20, 50, 100] // pagination limit
	};

	/*
	* Init Variables
	*/
	$scope.items = [];
	$scope.itemSelected = [];
	$scope.showFilter = false;

	/*
	* Load all transactions and then encapsulate each row returned in an item object
	* Item object contains specific property about it should be displayed
	*/ 
	self.loadTransactions = function () {
		var resultItem = [];
		Transactions.getResource().query(function (results) {
			results.forEach(function (currentElement) {

				// encapsulate into a row item
				var item = self.encapsulateTransaction(currentElement);
				resultItem.push(item);
			});
		});

		return resultItem;
	}


	// Load all transactions
	$scope.items = self.loadTransactions();

	// Load categories list
	$scope.categories = Categories.getCategories();

	// Load Bank Account list
	$scope.bankaccountList = BankAccount.getBankAccount();

	$scope.bankAccountTotal = BankAccount.getBankAccountTotal();

	$scope.bankAccountTotalByCategory = BankAccount.getBankAccountTotalByCategory();

	/**
	* Create and return a new transaction object with default value
	*/
	self.initTransaction = function (){
		var transaction = {
			date: new Date(),
			income:0,
			outcome:0
		};
		return transaction;
	}

	/**
	* As we don't want to save in our database GUI properties when saving a transaction, we encapsulate a transaction object into an item object
	* item object will contains GUI properties
	*
	* In our case 'date' property is saved in string format and need to be convert into Date
	* Adding a new property 'currentlySaving' to display a progress icon when saving
	*/ 
	self.encapsulateTransaction = function (aTransaction) {
		var item = {
			transaction: aTransaction,
			dateToDisplay: new Date(aTransaction.date),
			currentlySaving:false	
		};
		return item;
	}

	/**
	* Add a new transaction and persist it to database
	* Then, encapsulate return from database into item object for adding it in item list
	*/
	self.addNewTransaction = function() {
		var transaction = self.initTransaction();

		Transactions.getResource().save(transaction).$promise
		.then (function (result) {
			var item = self.encapsulateTransaction(result);
			$scope.items.push(item);
		});		
	};

	/**
	* Delete transactions selected by user
	*/
	self.deleteTransaction = function () {
		$scope.itemSelected.forEach(function (currentElement){
			var currentId = currentElement.transaction._id;
			var params={'id':currentId};
			Transactions.getResource().remove(params).$promise
			.then (function () {

				// find index
				var index = $scope.items.findIndex(function (currentValue) {
					return currentValue.transaction._id == currentId;
				});

				// remove from items
				$scope.items.splice(index, 1);

				$scope.itemSelected = [];

			});
		});
	}

	var update = function (currentItem) {
		if (!currentItem.currentlySaving) {
			Transactions.getResource().save(currentItem.transaction, function () {
				currentItem.currentlySaving = false;
				currentItem.changed = false;	
			});
			currentItem.currentlySaving = true;	
		}
	}

	$scope.onChange = function (currentItem) {
		//change item properties
		currentItem.changed = true;
	}

	$scope.onFocus = function (currentItem) {

		if (typeof $scope.lastItem == 'undefined') {
			$scope.lastItem = currentItem;
		}

		// Compare currentItem with last modified item
		if (currentItem.transaction._id != $scope.lastItem.transaction._id) {
			// If both are different
			//	 update changes of previous item (if changed)
			//	 replace lastCurrentItem with current item
			if ($scope.lastItem.changed) {
				update($scope.lastItem);	
			}

			$scope.lastItem = currentItem;	

		}
	}

	$scope.onBlur = function(currentItem) {
		update(currentItem);
	}

	var originatorEv;

	$scope.openMenu = function($mdMenu, ev) {
		originatorEv = ev;
		$mdMenu.open(ev);
	};

	$scope.addNewCategory = function(ev) {

		var dialogParams = {
			dialogTitle : "Add new category", 
			items : $scope.categories,
			placeHolderParent : "Select category type ...",
			placeHolderChild : "Select category ..."
		}

		$mdDialog.show({
			locals: {params:dialogParams},
			controller: 'DialogCtrl',
			templateUrl: '../dialog/dialog.html',
			targetEvent: ev,
			clickOutsideToClose:true,
		})
		.then(function(categoryAdded) {
			$scope.categories.push(categoryAdded);
			$scope.categories.type = $scope.categories.reduce(function(previous, current) {
				if (previous.indexOf(current.category) === -1) {
					previous.push(current.category);
				}

				return previous;
			}, []);
		}, function() {
			console.log('You cancelled the dialog.');
		});
	};

	$scope.addNewBankAccount = function(ev) {

		var dialogParams = {
			dialogTitle : "Add new Bank Account", 
			items : $scope.bankaccountList,
			placeHolderParent : "Select bank account type ...",
			placeHolderChild : "Select bank account ..."
		}

		$mdDialog.show({
			locals: {params:dialogParams},
			controller: 'DialogCtrl',
			templateUrl: '../dialog/dialog.html',
			targetEvent: ev,
			clickOutsideToClose:true,
		})
		.then(function(bankAccountAdded) {
			$scope.bankaccountList.push(bankAccountAdded);
			$scope.bankaccountList.type = $scope.bankaccountList.reduce(function(previous, current) {
				if (previous.indexOf(current.category) === -1) {
					previous.push(current.category);
				}

				return previous;
			}, []);
		}, function() {
			console.log('You cancelled the dialog.');
		});
	};

	self.addTransaction = function(ev) {

		$mdDialog.show({
			controller: 'TransactionsDialogCtrl',
			templateUrl: '../transactions/transactions-dialog.html',
			targetEvent: ev,
			controllerAs: 'ctrl',
			clickOutsideToClose:true,
		})
		.then(function(bankAccountAdded) {
			$scope.items = self.loadTransactions();
		}, function() {
			console.log('You cancelled the dialog.');
		});

	}
}])