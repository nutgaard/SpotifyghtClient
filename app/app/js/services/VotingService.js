(function () {
    'use strict';

    var API_ENDPOINT = 'http://localhost:3001/';

    var votingservices = angular.module('VotingService', ['ngResource']);

    votingservices.factory('Group', ['$resource', function ($resource) {
        return $resource(API_ENDPOINT + 'group/:groupId', {}, {
            query: {method: 'GET' },
            create: {method: 'POST'}

        });
    }
    ]);

// body: { "uri": "spotify:track:0iTlGLAhCU7jojPx7zh4ap" }
    votingservices.factory('Track', ['$resource', '$routeParams', function ($resource, $routeParams) {
        return $resource(API_ENDPOINT + 'group/:groupId/tracks', {}, {
            index: {method: 'GET'},
            create: {method: 'POST'}
        });
    }
    ]);
    votingservices.factory('Vote', ['$resource', function($resource) {
        return $resource(API_ENDPOINT + '/group/:groupId/:trackId/vote', {groupId: '@groupId', track: '@trackId'}, {
            vote: {method: 'POST' }
        });
    }]);
})();