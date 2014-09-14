(function () {
    'use strict';

    angular.module('spotifyghtAppControllers')
        .controller('GroupCtrl', ['$scope', '$routeParams', 'Group', 'Track',
            function($scope, $routeParams, Group, Track) {
                console.log("loaded group");
                var loadTracks = function () {
                    Track.index({groupId: $routeParams.groupId}, function(tracks, response) {
                        console.log(tracks);
                        console.log(response);
                        $scope.tracks = tracks.scores;
                    });
                };
                loadTracks();
            }
        ]);

})();