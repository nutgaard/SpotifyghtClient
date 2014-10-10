(function () {
    "use strict";
    angular.module('spotifyghtComponents')
        .directive('fancyTextInput', [function () {
            return {
                restrict: 'E',
                templateUrl: 'components/fancyinput/text/input.html',
                compile: function () {
                    return function (scope, iEl) {
                        var attrs = $(iEl).prop("attributes");
                        var $input = $(iEl).find('input');
                        $.each(attrs, function(){
                            $input.attr(this.name, this.value);
                        });
                    };
                },
                scope: {
                    ngModel: '='
                }
            };
        }]);
})();