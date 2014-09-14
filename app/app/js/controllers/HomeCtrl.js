(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('HomeCtrl', ['$scope', '$routeParams',
            function($scope, $routeParams) {
                $scope.name = "test";
                console.log("loaded home");
            }
        ]);
})();