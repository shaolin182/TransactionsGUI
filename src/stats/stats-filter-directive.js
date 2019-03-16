angular.module('filterDirective', [])
    .directive('statsFilterDirective', function() {
        return {
            restrict: 'E',
            scope: {
                filter: '='},
            templateUrl: 'stats/stats-filter-directive.html',
            replace: false,
        };
    });
