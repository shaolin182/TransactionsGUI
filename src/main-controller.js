'use strict';

var mainController = angular.module('mainController', []);
mainController.controller('MainCtrl', ['$scope', '$mdSidenav', '$location', function($scope, $mdSidenav, $location) {
    const self = this;

    $scope.sideOpen = true;

    self.closeOrOpenSidePanel = function() {
        if ($scope.sideOpen) {
            self.closeSidePanel();
        } else {
            self.openSidePanel();
        }
    };

    self.closeSidePanel = function() {
        $mdSidenav('left').close();
        $scope.sideOpen = false;
    };

    self.openSidePanel = function() {
        $mdSidenav('left').open();
        $scope.sideOpen = true;
    };

    self.goToPage = function(path) {
        $location.path(path);
    };
}]);
