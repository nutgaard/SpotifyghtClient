(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('HomeCtrl', ['$scope', '$routeParams', 'User', '$location', 'LocalStorage',
            function($scope, $routeParams, User, $location, LocalStorage) {
                console.log("loaded home");

                var user = LocalStorage.get('user');

                $scope.login = function() {
                console.log('submit');
                    user.username = $scope.username;
                    login();
                };
                var login = function() {
                    console.log('var user', user);
                    user = {username: $scope.username};
                    LocalStorage.put('user', user);
                    User.create(user, function(res, headers) {
                        console.log(res);
                        console.log('user logged in');
                        $scope.loggedIn = true;
                    });
                };
                $scope.gotoGroup = function() {
                    $location.path('/group/'+$scope.group);
                };
                if(user && user.username) {
                    $scope.username = user.username;
                    login();
                } else {
                    user = {};
                }
            }
        ]);
})();
