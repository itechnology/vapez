"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {

    $scope.resistance = 1.00;

    $scope.resistanceUp = function () {
        $scope.resistance += 0.1;
    }

    $scope.resistanceDown = function () {
        $scope.resistance -= 0.1;
    }

    console.log("hi scope");
});
