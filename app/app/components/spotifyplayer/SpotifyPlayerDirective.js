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
            $scope.player = undefined;
            $scope.status = undefined;
            $scope.playerstate = false;
            $scope.current = {
                song: '',
                artist: '',
                album: '',
                position: 0,
                songlength: 100,
                uri: ''
            };
            $scope.intervalUpdate = undefined;

            Spotify.start('bf1a2d09e98ce4c077b70f965bd12faa').done(function (ok, instance, status) {
                $scope.$apply(function () {
                    $scope.player = instance;
                    $scope.status = status;
                    $scope.startLongPolling();
                });
            }).fail(function () {
                console.log('Could not connect to spotify client');
            });

            $scope.$watch('status', function (status) {
                if (typeof status === 'undefined') {
                    return;
                }
                console.log('status update: ', status);
                $scope.current.song = status.track.track_resource.name;
                $scope.current.artist = status.track.artist_resource.name;
                $scope.current.album = status.track.album_resource.name;
                $scope.current.uri = status.track.track_resource.uri;
                $scope.current.position = status.playing_position;
                $scope.current.songlength = status.track.length;
                $scope.playerstate = status.playing;
                updateProgessPercent();
            });
            $scope.$watch('playerstate', function (state) {
                if (state) {
                    $scope.intervalUpdate = setInterval(function () {
                        $scope.current.position += 0.25;
                        updateProgessPercent();
                    }, 250);
                } else if ($scope.intervalUpdate > 0) {
                    clearInterval($scope.intervalUpdate);
                }

            });
            $scope.startLongPolling = function () {
                $scope.player.status().then(function (status) {
                    $scope.$apply(function () {
                        $scope.status = status;
                    });
                    $scope.startLongPolling();
                });
            };
            $scope.isplaying = function () {
                return $scope.playerstate;
            };
            $scope.playpause = function () {
                $scope.playerstate = !$scope.playerstate;
            };

            function playerReady() {
                return typeof $scope.player !== 'undefined';
            }

            function updateProgessPercent() {
                var p = ($scope.current.position / $scope.current.songlength) * 100;
                $('.playbarprogress').css({width: p + '%'});
            }
        }]);
})();