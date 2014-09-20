(function () {
    'use strict';


    var CallbackFactory = angular.module('CallbackFactory', []);

    CallbackFactory.factory('Callbacks', ['$routeParams', 'Track',
        function ($routeParams, Track) {
            var callbacks = {
                'addTrack': function(track) {
                    var uri = track.uri;
                    var newTrack = new Track({uri: uri});
                    return newTrack.$create({groupId: $routeParams.groupId});
                }
            };

            return {
                get: function(name){
                    var ds = callbacks[name];
                    return  ds;
                }
            };
        }
    ]);

})();