(function () {
    'use strict';
    var striptrailslash = function (site) {     
      return site.replace(/\/$/, "");
    } 

    var SocketService = angular.module('SocketService', ['btford.socket-io']);

    SocketService.factory('socket', ['$rootScope', 'socketFactory', 'API_ENDPOINT',
        function ($rootScope, socketFactory, API_ENDPOINT) {
//            var ioSocket = io.connect('ws://localhost:3001/group/eivind');
	    var url = striptrailslash(API_ENDPOINT);
            var ioSocket = io.connect(url, {'resource': 'api/socket.io' } );

            var mySocket = socketFactory( {
                ioSocket: ioSocket
            });
            mySocket.forward('error');
            return mySocket;
        }
    ]);

})();
