'use strict';

angular
    .module('statsFilterModule', [])
    .service('StatsFilter', function() {
        const statsFilter = {
            startDate: undefined,
            endDate: undefined,
            categories: [],
            bankaccount: [],
        };

        return statsFilter;
    });
