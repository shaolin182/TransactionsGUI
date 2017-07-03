'use strict';

function bankaccountService($resource) {

	var bankaccountService = {};

	bankaccountService.getResource = function () {
		return $resource('http://localhost:8080/bankaccount');
	}

	bankaccountService.getBankAccount = function () {
		var bankAccount = bankaccountService.getResource().query(function () {
			bankAccount.type = bankAccount.reduce(function (previous, current) {
				if (previous.indexOf(current.category) === -1) {
					previous.push(current.category);
				}
				return previous
			}, []);
		});

		return bankAccount;
	}

	return bankaccountService;

}

angular
.module('bankaccountServiceModule', ['ngResource'])
.factory('BankAccount', ['$resource', bankaccountService]);