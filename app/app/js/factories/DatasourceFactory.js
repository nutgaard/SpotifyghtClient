(function () {
    'use strict';


    var DatasourceFactory = angular.module('DatasourceFactory', []);

    DatasourceFactory.factory('Datasources', ['SpotifyWebAPI',
        function (spotifyApi) {
            var datasources = {
                'getTracks': function(search) {
                    return spotifyApi.searchTracks('*' + search + '*');
                }
            };

            return {
                get: function(name){
                    var ds = datasources[name];
                    return  ds;
                }
            };
        }
    ]);

})();