(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', '$location', 'Group', 'Track', 'socket', 'SpotifyWebAPI', 'SongData',
            function($scope, $routeParams, $location, Group, Track, socket, SpotifyWebAPI, SongData) {
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        SongData.loadTrackInfo(tracks.scores, function(songData) {
                            console.log('callback songdata');
                            console.log(songData);
                            $scope.trackData = songData;
                            $scope.$apply();
                        });
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

                var findTrackId = SongData.findTrackId;

                var loadTrackInfo = SongData.loadTrackInfo;

                $scope.addTrack = addTrack;

                function addTrack(uri) {
                    var newTrack = new Track({uri: uri});
                    newTrack.$create({groupId: $routeParams.groupId}, function (t, postResponseHeaders) {
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