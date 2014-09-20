(function () {
    'use strict';

    var SocketService = angular.module('SocketService', ['btford.socket-io']);

    SocketService.factory('socket', ['$rootScope', 'socketFactory', 'API_ENDPOINT',
        function ($rootScope, socketFactory, API_ENDPOINT) {
//            var ioSocket = io.connect('ws://localhost:3001/group/eivind');
            var ioSocket = io.connect(API_ENDPOINT);

            var mySocket = socketFactory( {
                ioSocket: ioSocket
            });
            mySocket.forward('error');
            return mySocket;
        }
    ]);

})();