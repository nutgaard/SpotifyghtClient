(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('HomeCtrl', ['$scope', '$routeParams', 'User', '$location', 'LocalStorage',
            function($scope, $routeParams, User, $location, LocalStorage) {
                console.log("loaded home");
                $scope.showUsernamePrompt = true;
                $scope.showRolePrompt = false;
                $scope.showGroupPrompt = false;


                var user = LocalStorage.get('user');

                $scope.login = function() {
                console.log('submit');
                    user.username = $scope.username;
                    login();
                };
                var login = function() {
                    user = {username: $scope.username};
                    LocalStorage.put('user', user);
                    User.create(user, function(res, headers) {
                        $scope.showUsernamePrompt = false;
                        $scope.showRolePrompt = true;
                        $scope.showGroupPrompt = true;
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
