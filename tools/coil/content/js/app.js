"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {
    // init default adjustable values
    $scope.diameter = 2.0;    
    $scope.spires   = 4.0;
    $scope.feet     = 3.0;
    $scope.volts    = 3.7;

    $scope.coils = 1;
    $scope.wires = 1;

    // init
    $http.get("content/js/wire.json")
        .success(function (data) {
            $scope.data = data;
            $scope.wire = data[0];
            
            $scope.height = $scope.wire.height;
            $scope.width  = $scope.wire.width;

            $scope.calculate();
        });
    
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
        // We changed wire type, so reset default values
        $scope.height = $scope.wire.height;
        $scope.width  = $scope.wire.width;
        $scope.wires  = 1;
        
        $scope.calculate();
    };

    $scope.calculate = function () {
        // http://jsfiddle.net/he25P/17/

        // Surface Area
        var section = 0;
        
        if (!!$scope.wire.flat) {
            // -> Flat (height/width in mm)
            section = ($scope.height * $scope.width);
        } else {
            // -> Round (diameter in mm)
            section = Math.PI * (Math.pow($scope.width / 2, 2));
            
            // since working with round wire
            $scope.height = $scope.width;
        }

        // Resistance/mm (resistivity in ohm/mm²/meter)
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        var resistance = ($scope.wire.resistivity / (section * $scope.wires)) / 1000;

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
        var width  = $scope.width  * $scope.wires;
        var height = $scope.height * $scope.wires;
        var length = Math.sqrt(Math.pow(Math.PI * ($scope.diameter + height), 2) + Math.pow(width, 2));

        // Total distance (coil + feet)
        var dist = (length * $scope.spires) + ($scope.feet * 2) + $scope.diameter;

        // Display
        $scope.ohms    = dist * (resistance/$scope.coils);
        $scope.watts   = Math.pow($scope.volts, 2) / $scope.ohms;
        $scope.amperes = $scope.volts / $scope.ohms;
        $scope.length  = dist / 10;

        // Visual effects
        $scope.warningAmperes = ($scope.amperes > 5.5);

        //save();
    };

    function load() {
        // load from localStorage
    }
    function save() {
        // save to localStorage
    }
    //#endregion
});
