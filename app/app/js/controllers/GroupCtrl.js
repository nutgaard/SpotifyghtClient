(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', '$location', 'Group', 'Track', 'socket',
            function($scope, $routeParams, $location, Group, Track, socket) {
                console.log("loaded group");
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        $scope.tracks = tracks.scores;
                    });
                };

                var newSongCallback = function (data) {
                    console.log("newsong");
                    console.log(data);
                    loadTracks();
                };
                socket.on('songadded', newSongCallback);

                socket.emit('ready', {group: $routeParams.groupId});

                $scope.$on('socket:error', function (ev, data) {
                    console.log('socket error');
                    console.log(ev);
                    console.log(data);
                });

                function findTrackId(track) {
                    var str = track;
                    if(track.hasOwnProperty('id')) {
                        str = track.id;
                    }
                    if(track.hasOwnProperty('uri')) {
                        str = track.uri;
                    }
                    if(str.indexOf('spotify:track:') === -1) {
                        return str;
                    } else {
                        return str.split('spotify:track:')[1];
                    }
                    return str;
                }

                var voteForTrack = function(track) {
                    var trackid = findTrackId(track);
                    Track.vote({groupId: $routeParams.groupId, trackId: trackid}, function(result, response) {
                        console.log(result);
                        console.log(response);
                        track.score = parseInt(result.score);
                    });

                };
                $scope.voteForTrack = voteForTrack;
                loadTracks();
            }
        ]);
})();