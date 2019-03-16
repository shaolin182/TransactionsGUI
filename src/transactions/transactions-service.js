'use strict';

function transactionsService($resource) {
    const transactionsService = {};

    transactionsService.getResource = function() {
        return $resource('http://localhost:8080/transactions/:id', {id: '@_id'});
    };

    /*
	* Init a transaction with default value
	*/
    transactionsService.initTransaction = function() {
        return {
            income: 0,
            outcome: 0,
            date: new Date(),
            multi: false,
        };
    };

    /**
	* Init new transaction with default value and from last transaction
	* Called when we run the popup and when we click on 'Add' button
	*/
    transactionsService.reinitTransaction = function(transaction) {
        const result = transactionsService.initTransaction();
        result.bankaccount = transaction.bankaccount;
        result.date = transaction.date;

        return result;
    };

    return transactionsService;
}

angular
    .module('transactionsServiceModule', ['ngResource'])
    .factory('Transactions', ['$resource', transactionsService]);
