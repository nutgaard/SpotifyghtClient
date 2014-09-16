(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', '$location', 'Group', 'Track', 'socket', 'SpotifyWebAPI', 'SongData',
            function($scope, $routeParams, $location, Group, Track, socket, SpotifyWebAPI, SongData) {
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        SongData.loadTrackInfo(tracks.scores, function(songData) {

                            $scope.trackData = songData;
                            $scope.tracks = tracks.scores;

                        });
                    });
                };

                var newSongCallback = function (data) {
                    loadTrackInfo(data, function(songData) {
                        $scope.trackData = songData;

                        $scope.$apply(function() {
                            $scope.tracks.push(data);
                        });
                    });
                };

                var updateVote = function(trackVote) {
                    if(!trackVote.hasOwnProperty('id')) {
                        return;
                    }
                    if(!trackVote.hasOwnProperty('score')) {
                        return;
                    }
                    var found = _.find($scope.tracks, { 'id': trackVote.id });
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

                var voteForTrack = function(track) {
                    var trackid = findTrackId(track);
                    Track.vote({groupId: $routeParams.groupId, trackId: trackid}, function(result, response) {
                        track.score = parseInt(result.score);
                    });

                };
                $scope.voteForTrack = voteForTrack;
                loadTracks();
            }
        ]);
})();
