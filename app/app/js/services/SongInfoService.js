(function () {
    'use strict';

    var pickProps = ['id', 'uri', 'name', 'popularity', 'duration_ms'];
    var albumProps = ['name', 'uri', 'images', 'type'];
    var artistProps = ['name', 'uri', 'type'];

    var SONGCACHE = 'songCache';

    var SongInfo = angular.module('SongDataService', ['SpotifyWebAPIService', 'LocalStoreService']);

    SongInfo.factory('SongData', ['SpotifyWebAPI', 'SPOTIFY_TRACK_PREFIX', 'LocalStorage',
            function (SpotifyWebAPI, SPOTIFY_TRACK_PREFIX, LocalStorage) {
                var songCache = LocalStorage.get(SONGCACHE);
                if(!songCache) {
                    songCache = {};
                }
                console.log('loaded songCache', songCache);
                var loadTrackInfo = function (tracks, callback) {
                    var trackIds = [];

                    if (Array.isArray(tracks)) {
                        trackIds = _.map(tracks, function (t) {
                            return findTrackId(t);
                        });
                    } else {
                        trackIds.push(findTrackId(tracks));
                    }

                    var tmp = _.filter(trackIds, function (trackId) {
                        return !songCache.hasOwnProperty(SPOTIFY_TRACK_PREFIX + trackId);
                    });
                    trackIds = tmp;

                    console.log('Gonna load ids for web: ' + trackIds.length);

                    if (trackIds.length < 1) {
                        callback(songCache);
                        return;
                    }

                    SpotifyWebAPI.getTracks(trackIds).then(function (data) {
                        var filtered = {};

                        angular.forEach(data.tracks, function (obj, index) {
                            var pick = _.pick(obj, pickProps);

                            pick['album'] = _.pick(obj.album, albumProps);

                            pick['artist'] = [];
                            angular.forEach(obj.artists, function (art) {
                                pick['artist'].push(_.pick(art, artistProps));
                            });

                            filtered[pick.uri] = pick;
                        });
                        songCache = $.extend(songCache, filtered);

                        callback(songCache);
                        LocalStorage.put(SONGCACHE, songCache);
                    });
                };
                var findTrackId = function (track) {
                    var str = track;
                    if (track.hasOwnProperty('id')) {
                        str = track.id;
                    }
                    if (track.hasOwnProperty('uri')) {
                        str = track.uri;
                    }
                    if (str.indexOf(SPOTIFY_TRACK_PREFIX) === -1) {
                        return str;
                    } else {
                        return str.split(SPOTIFY_TRACK_PREFIX)[1];
                    }
                    return str;
                };

                var getSongCache = function() {
                    return songCache;
                };

                return {
                    loadTrackInfo: loadTrackInfo,
                    getSongCache: getSongCache,
                    findTrackId: findTrackId
                };
            }]
    );

})();
