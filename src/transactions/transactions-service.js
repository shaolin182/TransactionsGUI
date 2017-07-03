'use strict';

function transactionsService($resource) {
/*
	var transactionsService = {};


	transactionsService.getAll = function () {
		return $resource('http://localhost:8080/transactions', {}, {getAll : {method: 'GET', isArray:true}});
	}

	transactionsService.update = function () {
		return $resource('http://localhost:8080/transactions/:id', {}, {update : {method: 'POST', params:{id:'@_id'}}});
	}

	transactionsService.add = function () {
		return $resource('http://localhost:8080/transactions', {}, {add : {method: 'POST'}});
	}

	transactionsService.remove = function () {
		return $resource('http://localhost:8080/transactions/:id', {id:'@id'}, {remove : {method: 'DELETE'}});
	}		

	return transactionsService;
	*/
	return $resource('http://localhost:8080/transactions/:id', {id:'@_id'});

}

angular
.module('transactionsServiceModule', ['ngResource'])
.factory('Transactions', ['$resource', transactionsService]);