"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {
    // init default adjustable values
    $scope.diameter = 2.0;
    $scope.spires   = 4.0;
    $scope.feet     = 3.0;
    $scope.volts    = 3.7;

    // init
    $http.get("content/js/wire.json")
        .success(function (data) {
            $scope.data = data;
            $scope.wire = data[1];

            $scope.calculate();
        });

    // init default results (not needed ...?)
    $scope.ohms    = 1.0;
    $scope.watts   = 1.0;
    $scope.amperes = 1.0;
    $scope.length  = 1.0;
    
    //#region functions
    $scope.up = function(target, value) {
        $scope[target] += value;

        $scope.calculate();
    };

    $scope.down = function(target, value) {
        var next = ($scope[target] - value);

        if (!!next) {
            $scope[target] = next;
        }

        $scope.calculate();
    };

    $scope.changed = function () {
        console.log($scope.wire);
        $scope.calculate();
    };

    $scope.calculate = function () {
        // http://jsfiddle.net/he25P/17/

        //#region Surface Area
        // -> Round (diameter in mm)
        // var section = Math.PI * (Math.pow(wire.diameter/2, 2);

        // -> Flat (height/width in mm)
        // var section = (wire.height * wire.width);
        //#endregion

        // Resistance/mm (resistivity in ohm/mm²/meter)
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        var resistance = ($scope.wire.resistivity / $scope.wire.section) / 1000;

        // Helicoidal length (1 turn)
        // http://fr.wikipedia.org/wiki/H%C3%A9lice_%28g%C3%A9om%C3%A9trie%29
        // var length2 = (2 * Math.PI) * Math.sqrt(Math.pow(($scope.diameter/2), 2) + Math.pow((wire.width / (2 * Math.PI)), 2));
        //
        // http://answers.yahoo.com/question/index?qid=20080704040430AAUSsuL
        // D: coil diameter
        // P: pitch
        // N: turns
        //
        // C  = pi x D
        // Lc = sqrt(C^2 + P^2)
        // Lt = N x Lc 
        var length = Math.sqrt(Math.pow(Math.PI * $scope.diameter, 2) + Math.pow($scope.wire.width, 2));

        // Total distance (coil + feet)
        var dist = (length * $scope.spires) + ($scope.feet * 2);

        // Display
        $scope.ohms    = dist * resistance;
        $scope.watts   = Math.pow($scope.volts, 2) / $scope.ohms;
        $scope.amperes = $scope.volts / $scope.ohms;
        $scope.length = dist / 10;

        // Visual effects
        $scope.warningAmperes = ($scope.amperes > 5.5);
    };
    //#endregion
});
