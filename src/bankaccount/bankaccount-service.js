'use strict';

function bankaccountService($resource) {
    const bankaccountService = {};

    /**
	* Global variable that contains all bank account
	*/
    let bankAccount;

    bankaccountService.getResource = function() {
        return $resource('http://localhost:8080/bankaccount', null, {
            total: {method: 'GET', url: 'http://localhost:8080/bankaccount/total', isArray: true},
            totalByCategory: {method: 'GET', url: 'http://localhost:8080/bankaccount/totalCategory', isArray: true},
        });
    };

    bankaccountService.getBankAccount = function() {
        if (bankAccount == undefined) {
            bankAccount = bankaccountService.getResource().query(function() {
                bankAccount.type = bankAccount.reduce(function(previous, current) {
                    if (previous.indexOf(current.category) === -1) {
                        previous.push(current.category);
                    }
                    return previous;
                }, []);
            });
        }

        return bankAccount;
    };

    bankaccountService.getBankAccountTotal = function() {
        return bankaccountService.getResource().total();
    };

    bankaccountService.getBankAccountTotalByCategory = function() {
        return bankaccountService.getResource().totalByCategory();
    };

    return bankaccountService;
}

angular
    .module('bankaccountServiceModule', ['ngResource'])
    .factory('BankAccount', ['$resource', bankaccountService]);
