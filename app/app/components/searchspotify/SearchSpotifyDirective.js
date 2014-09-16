(function() {
    "use strict";
    angular.module('spotifyghtComponents')
            .directive('searchSpotify', ['$routeParams', function($routeParams) {
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
                    $scope.search = '';
                    $scope.results = [];
                    $scope.selected = 0;
                    $scope.dropdownVisible = false;

                    $scope.keyevent = function(e) {
                        if (typeof keymap[e.keyCode] !== 'undefined') {
                            keymap[e.keyCode](e);
                        }
                    };
                    $scope.selectTrack = function(track) {
                        var uri = track.uri;

                        var newTrack = new Track({uri: uri});
                        newTrack.$create({groupId: $routeParams.groupId}, function() {
                            $scope.selected = 0;
                            $scope.results = [];
                            $scope.dropdownVisible = false;
                        });
                    };
                    $scope.hover = function(index) {
                        $scope.selected = index;
                    };
                    $scope.showDropdown = function(){
                        $scope.dropdownVisible = true;
                    };
                    $scope.isDropdownVisible = function() {
                        return $scope.dropdownVisible && $scope.results.length > 0;
                    }
                    var fetchResults = function() {
                        if ($scope.search.length < 3) {
                            $scope.results = [];
                            return;
                        }
                        spotifyApi.searchTracks('*' + $scope.search + '*')
                                .then(function(data) {
                                    $scope.results = data.tracks.items;
                                    $scope.selected = 0;
                                    $scope.dropdownVisible = true;
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
                        },
                        27: function() {
                            $scope.dropdownVisible = false;
                        }
                    };
                    $scope.updateResults = _.debounce(fetchResults, 300);
                    fetchResults();
                }]);
})();