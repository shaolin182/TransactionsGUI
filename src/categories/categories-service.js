'use strict';

function categoriesService($resource) {

	var categoriesService = {};

	categoriesService.getResource = function () {
		return $resource('http://localhost:8080/categories');
	}

	categoriesService.getCategories = function () {
		var categories = categoriesService.getResource().query( function () {
			categories.type = categories.reduce(function(previous, current) {
				if (previous.indexOf(current.category) === -1) {
					previous.push(current.category);
				}

				return previous;
			}, []);
		});

		return categories;
	}

	return categoriesService;
}

angular
.module('categoriesServiceModule', ['ngResource'])
.factory('Categories', ['$resource', categoriesService]);