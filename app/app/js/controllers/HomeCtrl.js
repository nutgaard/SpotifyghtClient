(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('HomeCtrl', ['$scope', '$routeParams',
            function($scope, $routeParams) {
                console.log("loaded home");

                $scope.login = function() {
                    console.log('submit');
                    console.log('$scope.username', $scope.username);
                    localStorage.username = angular.toJson($scope.username);
                };
            }
        ]);
})();