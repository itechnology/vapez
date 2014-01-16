"use strict";

/* App Module */
var coilApp = angular.module("coil", []);

coilApp.controller("CoilCtrl", function ($scope, $http, $filter) {
    $scope.close = function() {    
        $scope.dialog = false;
    };
    $scope.open = function (text) {
        $scope.text   = text;
        $scope.dialog = true;
    };
    
    // default model
    $scope.model = {
        wire: {
            category   : "Kanthal A1",
            resistivity: 1.45,
            height     : 0.20,
            width      : 0.20,
            flat       : false,
            count      : 1
        },
        coil: {
            diameter: 1.8,
            turns   : 5,
            stubs   : 4,
            count   : 1,
            volts   : 3.7
        }        
    };

    $scope.result = {
        // placeholder for results
    };
    
    // init
    $http.get("content/js/wire.json")
        .success(function (data) {
            $scope.data = data;

            load();
            
            if (!$scope.LOADED) {
                $scope.model.wire = data[0];                
            } else {
                for (var i = 0, l = data.length; i < l; i++) {
                    if ($scope.model.wire.category === data[i].category) {
                        $scope.model.wire = data[i];
                    }
                }
            }
            
            // add missing value
            $scope.model.wire.count = 1;            
            $scope.calculate();
        });
    
    //#region functions
    $scope.up = function (model, attribute, step) {
        $scope.model[model][attribute] += step;

        $scope.calculate();
    };

    $scope.down = function(model, attribute, step) {
        var next = ($scope.model[model][attribute] - step);

        if (next > 0) {
            $scope.model[model][attribute] = next;
        }

        $scope.calculate();
    };

    $scope.changed = function () {
        // We changed wire type, so reset default values
        $scope.model.wire.count = 1;
        
        $scope.calculate();
    };
    
    $scope.calculate = function () {
        // http://jsfiddle.net/he25P/17/
        
        var model  = $scope.model;
        var result = $scope.result;
        
        if (model.coil.volts > 8.4) {
            model.coil.volts = 8.4;
        }

        // Surface Area
        var section = 0;
        
        if (!!model.wire.flat) {
            // -> Flat (height/width in mm)
            section = (model.wire.height * model.wire.width);
        } else {
            // -> Round (diameter in mm)
            section = Math.PI * (Math.pow(model.wire.width / 2, 2));
            
            // since working with round wire
            model.wire.height = model.wire.width;
        }

        // Resistance/mm (resistivity in ohm/mm²/meter)
        // http://www.kanthal.com/en/products/materials-in-wire-and-strip-form/wire/resistance-heating-wire-and-resistance-wire/list-of-alloys/
        var resistance = (model.wire.resistivity / (section * model.wire.count)) / 1000;

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
        var height = model.wire.height;
        var width  = model.wire.width * model.wire.count;
        var length = Math.sqrt(Math.pow(Math.PI * (model.coil.diameter + height), 2) + Math.pow(width, 2));

        // Total distance (coil + feet)
        var dist = (length * model.coil.turns) + (model.coil.stubs * 2) + model.coil.diameter;

        // Display
        result.ohms   = dist * (resistance / model.coil.count);
        result.watts  = Math.pow(model.coil.volts, 2) / result.ohms;
        result.amps   = model.coil.volts / result.ohms;
        result.length = dist / 10;
        result.width  = (model.coil.turns * width) / 10;
        
        // Thank's to luc.bigjohn !
        // https://docs.google.com/file/d/0BxGcL1JOoEcySXpUTklhZGNfY28/edit
        if (model.wire.flat) {
            result.coeff = (result.watts / model.coil.count) / (2 * (model.wire.height + model.wire.width) * dist);
        } else {
            result.coeff = (result.watts / model.coil.count) / ((Math.PI * model.wire.width) * dist);            
        }
        
        // Visual effects
        result.cssOhms  = (result.ohms < 0.5);
        result.cssAmps  = (result.amps > 5.5);
        result.cssWatts = (result.watts > 15);
        result.cssCoeff = (result.coeff >= 0.2 && result.coeff <= 0.3);

       save();
    };

    function load() {
        // load from localStorage
        var model = localStorage.getItem("settings");
        
        if (!!model) {
            model = JSON.parse(model);

            if (angular.isObject(model)) {
                $scope.model  = model;
                $scope.LOADED = true;               
            }            
        }
    }
    
    function save() {
        // save to localStorage
        localStorage.setItem("settings", JSON.stringify($scope.model));
    }
    //#endregion
});
