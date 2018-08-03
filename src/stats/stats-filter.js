'use strict';

angular
.module('statsFilterModule', [])
.service('StatsFilter', function () {

    var statsFilter = {
        startDate : undefined,
        endDate : undefined,
        categories : [],
        bankaccount : []
    } 

    return statsFilter;
});