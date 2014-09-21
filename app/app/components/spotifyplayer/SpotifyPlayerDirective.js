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
        .controller('SpotifyPlayerCtrl', ['$scope', '$routeParams', 'Track', function ($scope, $routeParams, Track) {
            $scope.player = undefined;
            $scope.status = undefined;
            $scope.playerstate = false;
            $scope.showcsrf = true;
            $scope.rememberme = checkLocalStorage();
            $scope.current = {
                song: '',
                artist: '',
                album: '',
                position: 0,
                songlength: 100,
                uri: ''
            };
            $scope.intervalUpdate = undefined;

            $scope.testCSRF = function () {
                Spotify.start($scope.csrfToken).done(function (ok, instance, status) {
                    $scope.$apply(function () {
                        $scope.showcsrf = false;
                        $scope.player = instance;
                        $scope.status = status;
                        if ($scope.rememberme) {
                            window.localStorage.setItem('csrfToken', $scope.csrfToken);
                        }
                        $scope.startLongPolling();
                    });
                }).fail(function () {
                    $('.csrfinput').find('#csrf').css({'background-color': '#FFAAAA'});
                    setTimeout(function () {
                        $('.csrfinput').find('#csrf').css({'background-color': '#FFF'});
                    }, 100);
                    setTimeout(function () {
                        $('.csrfinput').find('#csrf').css({'background-color': '#FFAAAA'});
                    }, 200);
                    setTimeout(function () {
                        $('.csrfinput').find('#csrf').css({'background-color': '#FFF'});
                    }, 300);
                    setTimeout(function () {
                        $('.csrfinput').find('#csrf').css({'background-color': '#FFAAAA'});
                    }, 400);
                    setTimeout(function () {
                        $('.csrfinput').find('#csrf').css({'background-color': '#FFF'});
                    }, 500);
                });
            };

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
                $scope.player.status(10).then(function (status) {
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
                $scope.player.togglePause();
            };

            function playerReady() {
                return typeof $scope.player !== 'undefined';
            }

            function updateProgessPercent() {
                var p = ($scope.current.position / $scope.current.songlength) * 100;
                if ($scope.current.position > $scope.current.songlength - 1.0) {
                    startNewTrack();

                }

                $('.playbarprogress').css({width: p + '%'});
            }

            function checkLocalStorage() {
                var str = window.localStorage.getItem('csrfToken');
                if (str) {
                    $scope.csrfToken = str;
                    return true;
                } else {
                    $scope.csrfToken = undefined;
                    return false;
                }
            }

            var startNewTrack = function () {
                console.log('starting new song');
                Track.index({groupId: $routeParams.groupId}, function (tracks, response) {
                    console.log('tracks', tracks.scores);
                    console.log('tracks', tracks.scores.length);
                    if (tracks.scores.length > 0) {
                        console.log('starting new song ', tracks.scores[0].id);
                        var newtrack = tracks.scores[0];
                        $scope.player.play(newtrack.id).then(function () {
                            Track.delete({groupId: $routeParams.groupId, trackId: newtrack.id.split(':')[2]});
                        });
                    }
                });
            };
        }]);
})();