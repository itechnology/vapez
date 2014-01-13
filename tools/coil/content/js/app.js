"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {

    // Adjustable
    $scope.diameter = 1;
    $scope.spires   = 1;
    $scope.feet     = 1;
    $scope.tension  = 3.20;

    // init
    $http.get('content/js/wire.json')
        .success(function (data) {
            $scope.data = data;
            $scope.calculate();
        });

    //#region functions
    $scope.up = function (target, value) {
        $scope[target] += value;
        $scope.calculate();
    }

    $scope.down = function (target, value) {
        $scope[target] -= value;
        $scope.calculate();
    }

    $scope.changed = function () {
        $scope.calculate();
    }

    // Results
    $scope.resistance = 1.00;
    $scope.watts      = 1.00;
    $scope.amperes    = 1.00;
    $scope.coeff      = 1.00;
    $scope.length     = 1.00;

    $scope.calculate = function () {
        var wire = $scope.data[$scope.selected];
        var dist = (($scope.diameter * Math.PI) * $scope.spires) + ($scope.feet * 2);


        // Determine resistance of material
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        
        // Ohm/mm = (Resistivity / Surface mm²) / 1000
        var r = (wire.resistivity / wire.surface) / 1000;
        
        // Surface mm² = (PI() * ((diameter/2)^2))
        // Surface mm² = (h * w)


        $scope.resistance = dist * r;

        $scope.length = dist;
        //Math.PI;
    }
    //#endregion
});
