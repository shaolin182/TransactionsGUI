'use strict';

var transactionsController = angular.module('transactionsController', ['ngMaterial']);
transactionsController.controller('TransactionsCtrl', ['$scope', 'Transactions', 'Categories', 'BankAccount', '$mdDialog', function($scope, Transactions, Categories, BankAccount, $mdDialog) {
    const self = this;

    /* List of month, used for displaying header */
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    /*
	* Init Variables
	*/
    $scope.items = [];
    $scope.itemSelected = [];
    $scope.showFilter = false;

    /*
	* Transform results from database into readable format for GUI
	* @param :
	* - result : transactions from database
	*/
    self.buildItemsList = function(data) {
        const result = [];
        let key; let oldKey = '';
        let item;

        if (data) {
            data.forEach(function(currentElement) {
                // encapsulate into a row item
                item = self.encapsulateTransaction(currentElement);
                key = monthNames[item.dateToDisplay.getMonth()] + ' ' + item.dateToDisplay.getFullYear();
                if (oldKey != key) {
                    result.push({'group': key, 'dateToDisplay': item.dateToDisplay});
                    oldKey = key;
                }

                result.push(item);
            });
        }

        return result;
    };

    /*
	* Load all transactions and then encapsulate each row returned in an item object
	* Item object contains specific property about it should be displayed
	*/
    self.loadTransactions = function() {
        Transactions.getResource().query().$promise
            .then(function(results) {
                $scope.items = self.buildItemsList(results);
            });
    };

    /*
	* Add/Remove the current item from the selected list
	*/
    self.updateSelectedList = function(item) {
        if (item.selected) {
            $scope.itemSelected.push(item);
        } else {
            // find index
            const index = $scope.itemSelected.findIndex(function(currentElement) {
                return currentElement.transaction._id == item.transaction._id;
            });

            // remove from items
            if (index > -1) {
                $scope.itemSelected.splice(index, 1);
            }
        }
    };

    // Load categories list
    $scope.categories = Categories.getCategories();

    // Load Bank Account list
    $scope.bankaccountList = BankAccount.getBankAccount();

    $scope.bankAccountTotal = BankAccount.getBankAccountTotal();

    $scope.bankAccountTotalByCategory = BankAccount.getBankAccountTotalByCategory();

    /**
	* As we don't want to save in our database GUI properties when saving a transaction, we encapsulate a transaction object into an item object
	* item object will contains GUI properties
	*
	* In our case 'date' property is saved in string format and need to be convert into Date
	* Adding a new property 'currentlySaving' to display a progress icon when saving
	*/
    self.encapsulateTransaction = function(aTransaction) {
        const item = {
            transaction: aTransaction,
            dateToDisplay: new Date(aTransaction.date),
            currentlySaving: false,
            showEdit: false,
        };
        return item;
    };

    /**
	* Delete transactions selected by user
	*/
    self.deleteTransaction = function() {
        $scope.itemSelected.forEach(function(currentElement) {
            const currentId = currentElement.transaction._id;
            const params={'id': currentId};
            Transactions.getResource().remove(params).$promise
                .then(function() {
                    // find index
                    const index = $scope.items.findIndex(function(currentValue) {
                        if (!currentValue.group) {
                            return currentValue.transaction._id == currentId;
                        } else {
                            return false;
                        }
                    });

                    // remove from items
                    $scope.items.splice(index, 1);

                    $scope.itemSelected = [];
                });
        });
    };

    const update = function(currentItem) {
        if (!currentItem.currentlySaving) {
            Transactions.getResource().save(currentItem.transaction, function() {
                currentItem.currentlySaving = false;
                currentItem.changed = false;
            });
            currentItem.currentlySaving = true;
        }
    };

    let originatorEv;

    $scope.openMenu = function($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    $scope.addNewCategory = function(ev) {
        const dialogParams = {
            dialogTitle: 'Add new category',
            items: $scope.categories,
            placeHolderParent: 'Select category type ...',
            placeHolderChild: 'Select category ...',
        };

        $mdDialog.show({
            locals: {params: dialogParams},
            controller: 'DialogCtrl',
            templateUrl: '../dialog/dialog.html',
            targetEvent: ev,
            clickOutsideToClose: true,
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
        const dialogParams = {
            dialogTitle: 'Add new Bank Account',
            items: $scope.bankaccountList,
            placeHolderParent: 'Select bank account type ...',
            placeHolderChild: 'Select bank account ...',
        };

        $mdDialog.show({
            locals: {params: dialogParams},
            controller: 'DialogCtrl',
            templateUrl: '../dialog/dialog.html',
            targetEvent: ev,
            clickOutsideToClose: true,
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

    /* Open a popup for adding a new transaction */
    self.showEditTransactionDialog = function(mode, aTransaction) {
        $mdDialog.show(
            $mdDialog
                .transactionDialog({
                    locals: {
                        transaction: aTransaction,
                        mode: mode,
                    },
                })
        )
            .then(function(bankAccountAdded) {
                $scope.items = self.loadTransactions();
            });
    };
}]);
