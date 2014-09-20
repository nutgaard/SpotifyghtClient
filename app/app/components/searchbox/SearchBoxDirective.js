(function () {
    "use strict";
    angular.module('spotifyghtComponents')
        .directive('searchBox', ['$routeParams', function ($routeParams) {
            return {
                restrict: 'E',
                templateUrl: 'components/searchbox/search.html',
                controller: 'SearchBoxCtrl',
                scope: {
                    datasource: '@',
                    callback: '@',
                    limitTo: '@'
                }
            };
        }])
        .controller('SearchBoxCtrl', ['$scope', 'Datasources', 'Callbacks', function ($scope, Datasoures, Callbacks) {
            $scope.search = '';
            $scope.results = [];
            $scope.selected = 0;
            $scope.dropdownVisible = false;

            checkNecessaryHTMLParams();

            $scope.datasourceImpl = Datasoures.get($scope.datasource);
            $scope.callbackImpl = Callbacks.get($scope.callback);

            $scope.keyevent = function (e) {
                if (typeof keymap[e.keyCode] !== 'undefined') {
                    keymap[e.keyCode](e);
                }
            };
            $scope.selectElement = function (element) {
                $scope.callbackImpl(element).then(function(){
                    $scope.selected = 0;
                    $scope.results = [];
                    $scope.dropdownVisible = false;
                });
            };
            $scope.hover = function (index) {
                $scope.selected = index;
            };
            $scope.showDropdown = function () {
                $scope.dropdownVisible = true;
            };
            $scope.isDropdownVisible = function () {
                return $scope.dropdownVisible && $scope.results.length > 0;
            };
            var fetchResults = function () {
                if ($scope.search.length < 3) {
                    $scope.results = [];
                    return;
                }
                $scope.datasourceImpl($scope.search)
                    .then(function (data) {
                        $scope.results = data.tracks.items;
                        $scope.selected = 0;
                        $scope.dropdownVisible = true;
                        $scope.$apply();
                    });
            };
            var keymap = {
                38: function (e) {
                    $scope.selected--;
                    if ($scope.selected < 0) {
                        $scope.selected += $scope.results.length;
                    }
                    e.preventDefault();
                },
                40: function (e) {
                    $scope.selected++;
                    $scope.selected %= $scope.results.length;
                    e.preventDefault();
                },
                13: function (e) {
                    $scope.selectElement($scope.results[$scope.selected]);
                },
                27: function () {
                    $scope.dropdownVisible = false;
                }
            };
            function checkNecessaryHTMLParams() {
                if (typeof $scope.datasource === 'undefined' || typeof Datasoures.get($scope.datasource) === 'undefined'){
                    throw 'Datasource not defined';
                }
                if (typeof $scope.callback === 'undefined' || typeof Callbacks.get($scope.callback) === 'undefined'){
                    throw 'Callback not defined';
                }
                $scope.limitToValue = $scope.limitTo || 10;

                console.log($scope.limitToValue);
            }

            $scope.updateResults = _.debounce(fetchResults, 300);
            fetchResults();
        }]);
})();