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
            $scope.current = {
                song: 'Tore tang',
                artist: 'Mods',
                album: 'Et eller annet',
                uri: ''
            };
            $scope.isplaying = function(){return true;};
        }]);
})();