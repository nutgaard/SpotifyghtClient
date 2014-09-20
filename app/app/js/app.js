(function() {
    'use strict';

    var spotify = angular.module('spotifyghtApp', [
        'ngRoute',
        'ngResource',
        'spotifyghtAppControllers',
        'VotingService',
        'btford.socket-io',
        'spotifyghtComponents',
        'spotifyghtAppControllers',
        'SpotifyWebAPIService',
        'SocketService',
        'SongDataService',
        'LocalStoreService',
        'ngMaterial'
    ])
        .constant('API_ENDPOINT', 'http://10.0.1.2:3001/')
        .constant('SPOTIFY_TRACK_PREFIX', 'spotify:track:');

    // instantiate module
    angular.module('spotifyghtAppControllers', []);
    angular.module('spotifyghtComponents', []);
    
    spotify.config(['$routeProvider', '$httpProvider', '$locationProvider',
        function ($routeProvider, $httpProvider, $locationProvider) {
            $routeProvider.
                when('/home', {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }).
                when('/group/:groupId', {
                    templateUrl: 'templates/group.html',
                    controller: 'GroupCtrl'
                }).
                otherwise({
                    redirectTo: '/home'
                });
//          $locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
//    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

        }]);
})();