(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', 'Group', 'Track', 'Vote',
            function($scope, $routeParams, Group, Track, Vote) {
                console.log("loaded group");
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        console.log(tracks);
                        console.log(response);
                        $scope.tracks = tracks.scores;
                    });
                };

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
                        track.score = result.score;
                    });

                };
                $scope.voteForTrack = voteForTrack;
                loadTracks();
            }
        ]);

})();