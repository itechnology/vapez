"use strict";

/* App Module */
var powerApp = angular.module("power", []);

powerApp.controller("PowerCtrl", function ($scope, $http, $filter) {
    // init default adjustable values
    $scope.ohm    = 1.8;
    $scope.volt   = 3.7;
    $scope.watt   = 7.60555556;
    $scope.amp = 2.05555556;

    var timeout = 0;
    //#region functions
    $scope.ohmChange = function () {
        console.log("ohmChange");

        clearTimeout(timeout);

        (function ($scope) {
            setTimeout(function() {
                $scope.volt = $scope.ampere * $scope.ohms;
                //$scope.watt = $scope.volt * $scope.amp;
            }, 500);
        })($scope);

        setTimeout(function () {
            //$scope.volt = $scope.ampere * $scope.ohms;
            $scope.watt = $scope.volt * $scope.amp;
        }, 1000);
    };
    $scope.voltChange = function () {
        console.log("voltChange");
        // $scope.amp = $scope.volt / $scope.ohms;
        $scope.watt = $scope.volt * $scope.amp;
    };
    

    $scope.wattChange = function () {
        console.log("wattChange");
        $scope.ohm = $scope.watt / $scope.amp;
        //$scope.amp = $scope.watt / $scope.ohms;
    };
    $scope.ampereChange = function () {
        console.log("ampereChange");
        $scope.ohms = $scope.volt / $scope.amp;
        //$scope.volt = $scope.volt * $scope.amp;
    };
    //#endregion
});
