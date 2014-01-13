"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {

    // Adjustable
    $scope.diameter = "1.0";
    $scope.spires   = "1.0";
    $scope.feet     = "1.0";
    $scope.tension  = "3.2";

    // init
    $http.get('content/js/wire.json')
        .success(function (data) {
            $scope.data = data;
            $scope.calculate();
        });

    //#region functions
    $scope.up = function (target, value) {
        $scope[target] = parseFloat($scope[target]);
        $scope[target] = ($scope[target] += value).toFixed(1);

        $scope.calculate();
    }

    $scope.down = function (target, value) {
        $scope[target] = parseFloat($scope[target]);
        $scope[target] = ($scope[target] -= value).toFixed(1);

        $scope.calculate();
    }

    $scope.changed = function () {
        $scope.calculate();
    }

    // Results
    $scope.resistance = 1.0;
    $scope.watts      = 1.0;
    $scope.amperes    = 1.0;
    $scope.coeff      = 1.0;
    $scope.length     = 1.0;

    $scope.calculate = function () {
        var wire = $scope.data[$scope.selected];
        var dist = ((parseFloat($scope.diameter) * Math.PI) * parseFloat($scope.spires)) + (parseFloat($scope.feet) * 2);


        // Determine resistance of material
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        
        // Ohm/mm = (Resistivity / Surface mm²) / 1000
        var r = (wire.resistivity / wire.surface) / 1000;
        
        // Surface mm² = (PI() * ((diameter/2)^2))
        // Surface mm² = (h * w)


        $scope.resistance = (dist * r).toFixed(2);

        $scope.length = dist.toFixed(2);
        //Math.PI;
    }
    //#endregion
});
