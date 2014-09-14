(function() {
    "use strict";
    angular.module('spotifyghtComponents')
            .directive('searchSpotify', [function() {
                    return {
                        restrict: 'E',
                        templateUrl: 'components/searchspotify/search.html',
                        controller: 'SearchSpotifyCtrl',
                        scope: {
                            instance: '=uniqueid'
                        }
                    };
                }])
            .controller('SearchSpotifyCtrl', ['$scope', 'SpotifyWebAPI', function($scope, spotifyApi) {
                    console.log(spotifyApi);
                    $scope.search = '';
                    $scope.results = [];


                    var fetchResults = function() {
                        if ($scope.search.length === 0){
                            $scope.results = [];
                            return;
                        }
                        spotifyApi.searchTracks($scope.search)
                                .then(function(data) {
                                    $scope.results = data.tracks.items;
                                    $scope.$apply();
                                });
                    };
                    $scope.updateResults = _.debounce(fetchResults, 300);
                }]);
})();