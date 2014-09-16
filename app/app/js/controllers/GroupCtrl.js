(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', '$location', 'Group', 'Track', 'socket', 'SpotifyWebAPI',
            function($scope, $routeParams, $location, Group, Track, socket, SpotifyWebAPI) {
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        loadTrackInfo(tracks.scores);
                        $scope.tracks = tracks.scores;
                    });
                };

                var newSongCallback = function (data) {
                    console.log("newsong");
                    console.log(data);
                    loadTracks();
                };
                var updateVote = function(trackVote) {
                    if(!trackVote.hasOwnProperty('id')) {
                        return;
                    }
                    if(!trackVote.hasOwnProperty('score')) {
                        return;
                    }
                    var found = _.find($scope.tracks, { 'id': trackVote.id });
                    console.log('found');
                    console.log(found);
                    found.score = parseInt(trackVote.score);
                };

                var trackDeleted = function(data) {
                    console.log('deleted: ' + data);
                    var index = _.findIndex($scope.tracks, { 'id': data.id });
                    if(index > -1) {
                        $scope.tracks.splice(index, 1);
                    }
                };

                var deleteTrack = function (trackIndex) {
                    console.log('delete');
                    var track = $scope.tracks[trackIndex];
                    console.log(track);
                    Track.delete({groupId: $routeParams.groupId, trackId: findTrackId(track.id)},
                            function(result, response) {
                                console.log(result);
                                console.log(response);
                                $scope.tracks.splice(trackIndex, 1);
                            }
                    );
                };
                $scope.deleteTrack = deleteTrack;

                socket.on('songadded', newSongCallback);

                socket.on('change:vote', updateVote);

                socket.on('track:deleted', trackDeleted);

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

                function loadTrackInfo(tracks) {
                    var trackIds = [];

                    if(Array.isArray(tracks)) {
                        trackIds = _.map(tracks, function (t) { return findTrackId(t); });
                    } else {
                        trackIds.push(findTrackId(tracks));
                    }

                    console.log(trackIds);
                    SpotifyWebAPI.getTracks(trackIds).then(function(data) {
                        console.log(data);
                        var pickProps = ['id', 'uri', 'name', 'popularity', 'duration_ms'];
                        var albumProps = ['name', 'uri', 'images', 'type'];
                        var artistProps = ['name', 'uri', 'type'];
                        var filtered = {};

                        angular.forEach(data.tracks, function(obj, index) {
                            var pick = _.pick(obj, pickProps);
                            pick['album'] = _.pick(obj.album, albumProps);
                            pick['artist'] = [];
                            angular.forEach(obj.artists, function (art) {
                                pick['artist'].push(_.pick(art, artistProps));
                            });
                            filtered[pick.uri] = pick;
                        });
                        $scope.trackData = $.extend($scope.trackData, filtered);

                        $scope.$apply();
                        console.log('after filter');
                        console.log($scope.trackData);

                    });
                }

                $scope.addTrack = addTrack;

                function addTrack(uri) {
                    var newTrack = new Track({uri: uri});
                    Track.$create(function (t, postResponseHeaders) {
                        loadTrackInfo(t);
                        $scope.tracks.push(t);
                    });
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