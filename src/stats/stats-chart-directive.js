angular.module('chartDirective', [])
    .directive('statsChartDirective', function() {
        return {
            restrict: 'E',
            scope: {
                config: '=',
            },
            templateUrl: 'stats/stats-chart-directive.html',
            replace: false,
        };
    });
