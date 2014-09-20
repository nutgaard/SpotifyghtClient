(function () {
    'use strict';

    var LocalStoreService = angular.module('LocalStoreService', []);

    LocalStoreService.factory('LocalStorage', ['SPOTIFY_TRACK_PREFIX',
            function (SPOTIFY_TRACK_PREFIX) {

                var getKey = function (key) {
                    var value = null;
                    try {
                        if(localStorage.hasOwnProperty(key)) {
                            value = angular.fromJson(localStorage[key]);
                        }
                    } catch (err) {
                        console.error('error loading ' + key + ' from localStorage', err);
                    }
                    return value;
                };
                var putKey = function (key, value) {
                    try {
                        localStorage.setItem(key, angular.toJson(value));
                    } catch (err) {
                        console.error('error saving key: ' + key + ' value: ', value);
                    }
                };


                return {
                    getKey: getKey,
                    putKey: putKey
                };
            }]
    );

})();
