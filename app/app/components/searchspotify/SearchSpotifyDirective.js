(function() {
    "use strict";
    angular.module('spotifyghtComponents')
            .directive('searchSpotify', [ '$routeParams', function($routeParams) {
                    return {
                        restrict: 'E',
                        templateUrl: 'components/searchspotify/search.html',
                        controller: 'SearchSpotifyCtrl',
                        scope: {
                            instance: '=uniqueid'
                        }
                    };
                }])
            .controller('SearchSpotifyCtrl', ['$scope', 'SpotifyWebAPI', 'Track', '$routeParams', function($scope, spotifyApi, Track, $routeParams) {
                    $scope.search = 'tore tan';
                    $scope.results = [];
                    $scope.selected = 2;

                    $scope.keyevent = function(e) {
                        if (typeof keymap[e.keyCode] !== 'undefined') {
                            keymap[e.keyCode](e);
                        }
                    };
                    $scope.selectTrack = function(track){
                        var uri = track.uri;
                        var track = new Track({uri: uri});
                        console.log('groupId: ' + $routeParams.groupId);
                        track.$create({groupId: $routeParams.groupId}, function(){
                            console.log('track callback', arguments);
                        });
                    };
                    var fetchResults = function() {
                        if ($scope.search.length === 0) {
                            $scope.results = [];
                            return;
                        }
                        spotifyApi.searchTracks('*' + $scope.search + '*')
                                .then(function(data) {
                                    $scope.results = data.tracks.items;
                                    $scope.selected = 0;
                                    $scope.$apply();
                                });
                    };
                    var keymap = {
                        38: function(e) {
                            $scope.selected--;
                            if ($scope.selected < 0) {
                                $scope.selected += $scope.results.length;
                            }
                            e.preventDefault();
                        },
                        40: function(e) {
                            $scope.selected++;
                            $scope.selected %= $scope.results.length;
                            e.preventDefault();
                        },
                        13: function(e) {
                            $scope.selectTrack($scope.results[$scope.selected]);
                        }
                    };
                    $scope.updateResults = _.debounce(fetchResults, 300);
                    fetchResults();
                }]);
})();