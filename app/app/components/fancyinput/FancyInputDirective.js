(function () {
    "use strict";
    angular.module('spotifyghtComponents')
        .directive('fancyInput', [function () {
            return {
                restrict: 'E',
                templateUrl: 'components/fancyinput/input.html',
                controller: 'FancyInputCtrl',
                compile: function (tEl, tAttrs) {
                    return function (scope, iEl, tAttrs) {
                        var attrs = $(iEl).prop("attributes");
                        var $input = $(iEl).find('input');
                        $.each(attrs, function(){
                            $input.attr(this.name, this.value);
                        });
                    };
                },
                scope: {
                    onSubmit: '&',
                    ngModel: '='
                }
            };
        }])
        .controller('FancyInputCtrl', ['$scope', function ($scope) {
            $scope.text = $scope.model;
            $scope.onSubmit();
            $scope.submit = function (event) {
                $scope.onSubmit(event);
            };
        }]);
})();