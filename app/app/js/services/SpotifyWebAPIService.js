(function(){
    "use strict";
    var apiService = angular.module('SpotifyWebAPIService', []);
    
    apiService.service('SpotifyWebAPI', SpotifyWebApi);
})();