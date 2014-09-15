(function () {
    'use strict';

    var votingservices = angular.module('VotingService', ['ngResource']);

    votingservices.factory('Group', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
            return $resource(API_ENDPOINT + 'group/:groupId', {}, {
                query: { method: 'GET' },
                create: { method: 'POST'}
            });
        }
    ]);

    // body: { "uri": "spotify:track:0iTlGLAhCU7jojPx7zh4ap" }
    votingservices.factory('Track', ['$resource', '$routeParams', 'API_ENDPOINT', function ($resource, $routeParams, API_ENDPOINT) {
        return $resource(API_ENDPOINT + 'group/:groupId/tracks', {}, {
            index: { method: 'GET' },
            create: { method: 'POST' },
            vote: { method: 'POST', url: API_ENDPOINT + 'group/:groupId/:trackId/vote',
                    params: { groupId:'@groupId', trackId: '@trackId' }
            },
            delete: { method: 'DELETE', url: API_ENDPOINT + 'group/:groupId/:trackId',
                params: { groupId:'@groupId', trackId: '@trackId' }
            }
        });
    }
    ]);

})();