(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', '$location', 'Group', 'Track', 'socket', 'SpotifyWebAPI',
            function($scope, $routeParams, $location, Group, Track, socket, SpotifyWebAPI) {
                console.log("loaded group");
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        var trackIds = _.map(tracks.scores, function (t) { return findTrackId(t); });
                        console.log(trackIds);
                        SpotifyWebAPI.getTracks(trackIds).then(function(data, info) {
                            console.log(data);
                            console.log(info);
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
                    loadTracks();
                };

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