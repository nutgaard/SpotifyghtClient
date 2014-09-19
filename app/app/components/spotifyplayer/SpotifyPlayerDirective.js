(function () {
    "use strict";
    angular.module('spotifyghtComponents')
        .directive('spotifyPlayer', [function () {
            return {
                restrict: 'E',
                templateUrl: 'components/spotifyplayer/player.html',
                controller: 'SpotifyPlayerCtrl'
            };
        }])
        .controller('SpotifyPlayerCtrl', ['$scope', function ($scope) {
            $scope.isplaying = function(){return true;};

            $scope.song = 'Tore tang';
            $scope.artist = 'Mods';
            $scope.album = 'Et eller annet';
            $scope.uri = '';

            
        }]);
})();