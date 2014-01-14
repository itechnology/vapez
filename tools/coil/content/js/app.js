"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {

    // Adjustable
    $scope.diameter = "2.0";
    $scope.spires   = "4.0";
    $scope.feet     = "5.0";
    $scope.volts    = "3.2";

    // init
    $http.get("content/js/wire.json")
        .success(function (data) {
            $scope.data = data;
            $scope.selected = 0;

            $scope.calculate();
        });

    //#region functions
    $scope.up = function (target, value) {
        var prev = parseFloat($scope[target]);
        $scope[target] = (prev += value).toFixed(1);

        $scope.calculate();
    }

    $scope.down = function (target, value) {
        var prev = parseFloat($scope[target]);
        var next = (prev -= value);

        if (!!next) {
            $scope[target] = next.toFixed(1);
        }

        $scope.calculate();
    }

    $scope.changed = function () {
        $scope.calculate();
    }

    // Results
    $scope.ohms    = 1.0;
    $scope.watts   = 1.0;
    $scope.amperes = 1.0;
    $scope.length  = 1.0;

    $scope.calculate = function () {
        var wire = $scope.data[$scope.selected];
        var dist = ((parseFloat($scope.diameter) * Math.PI) * parseFloat($scope.spires)) + (parseFloat($scope.feet) * 2);

        // Determine resistance of material
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        
        // Ohm/mm = (Resistivity / Surface mm²) / 1000
        var r = (wire.resistivity / wire.surface) / 1000;
        
        // Surface mm² = (PI() * ((diameter/2)^2))
        // Surface mm² = (h * w)

        $scope.ohms    = (dist * r).toFixed(2);
        $scope.watts   = (($scope.volts * $scope.volts) / $scope.ohms).toFixed(2);
        $scope.amperes = ($scope.volts / $scope.ohms).toFixed(2);
        $scope.length  = (dist / 10).toFixed(2);
    }
    //#endregion
});
