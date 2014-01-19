"use strict";

/* App Module */
var consommationApp = angular.module("consommation", []);

consommationApp.controller("ConsommationCtrl", function ($scope, $http, $filter) {
    // default model
    $scope.model = {
        cigarette : {
            count       : 20,
            nicotine    : 0.9,
            assimilation: 35
        },
        liquid: {            
            assimilation: 60,
            mg: 18
        },
        cigarettes: 20,
        nicotine: 0.9,
        realcontent: 1.35,
        assimilation: 2.5
    };

    $scope.result = {        
        cigarette: {
            // placeholder for results    
        },
        liquid: {
            // placeholder for results
        }
    };    

    //#region functions
    $scope.up = function (model, attribute, step) {
        $scope.model[model][attribute] += step;

        $scope.calculate();
    };

    $scope.down = function (model, attribute, step) {
        var next = ($scope.model[model][attribute] - step);

        if (next > 0) {
            $scope.model[model][attribute] = next;
        }

        $scope.calculate();
    };

    $scope.calculate = function () {
        // result.ml = / liquide mg)
        var model  = $scope.model;
        var result = $scope.result;

        result.cigarette.nicotine     = model.cigarette.count     * model.cigarette.nicotine;
        result.cigarette.assimilated = result.cigarette.nicotine + (result.cigarette.nicotine * (model.cigarette.assimilation / 100));

        //24 + (24 * 135/100)
        result.liquid.equivalent   = result.cigarette.assimilated + (result.cigarette.assimilated * (66.66/100));
        result.liquid.assimilated  = result.liquid.equivalent * (model.liquid.assimilation / 100);
        result.liquid.consummation = result.liquid.equivalent / model.liquid.mg;
    };
    
    $scope.calculate();
    //#endregion
});
