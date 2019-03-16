'use strict';

var dialogController = angular.module('dialogController', []);

dialogController.controller('DialogCtrl', ['$scope', 'params', '$mdDialog', function($scope, params, $mdDialog) {
    /**
	* Contains the list of elements used to build autocomplete control
	*/
    $scope.items = params.items;

    /**
	* Modal dialog title
	*/
    $scope.dialogTitle = params.dialogTitle;

    /*
	* Placeholder for first autocomplete control
	*/
    $scope.placeHolderParent = params.placeHolderParent;

    /*
	* Placeholder for 2nd autocomplete control
	*/
    $scope.placeHolderChild = params.placeHolderChild;

    /*
	* Determine a new id for the new item to create
	*/
    if ($scope.items.length > 0																									) {
        $scope.maxId = Math.max.apply(Math, $scope.items.map(function(item) {
            return item.id;
        })) + 1;
    } else {
        $scope.maxId = 1;
    }


    /**
	 * Contains all element for autocomplete related to parent data
	 *
	 * Parent list is an array of object. Each object contains a property "display".
	 * It is built from items list. An object is added to the parent list each time a new parent value is met in items list.
	 */
	 $scope.parents = $scope.items.reduce(function(previous, current) {
	 	if (previous.length > 0) {
	 		let found = false;
	 		previous.forEach(function(currentElement) {
	 			if (currentElement.display == current.category) {
	 				found = true;
	 			}
	 		});

	 		if (found == false) {
	 			previous.push({display: current.category});
	 		}
	 	} else {
	 		previous.push({display: current.category});
	 	}

	 	return previous;
	 }, []);


    /**
     * Determine if one item of a list match query set by user
     * Insensitive case
     */
    function createFilterFor(query) {
     	const lowercaseQuery = angular.lowercase(query);

     	return function filterFn(item) {
     		return (angular.lowercase(item.display).indexOf(lowercaseQuery) > -1);
     	};
    }

    /**
    * Function used to filter automcomplete control when user enter some characters
    */
    $scope.querySearch = function(query, list) {
    	const results = query ? list.filter( createFilterFor(query) ) : list;
    	return results;
    };

    /**
	* Build child list (an arry of object containing a property 'display') each time parent is changed
	* Empty search text child field
	*/
    $scope.selectedItemChange = function(parent) {
        $scope.childs = [];
        $scope.searchChildText = '';

        if (parent != undefined) {
            $scope.items.forEach(function(currentElement) {
                if (currentElement.category == parent.display) {
                    $scope.childs.push({display: currentElement.label});
                }
            });
        }
    };

    /*
     * Close current modal dialog
     */
    $scope.closeDialog = function() {
     	$mdDialog.cancel();
    };

    /**
     * Return a new item object with an id, a category and a label
     */
    $scope.okDialog = function() {
     	$mdDialog.hide({id: $scope.maxId, category: $scope.searchParentText, label: $scope.searchChildText});
    };
}]);
