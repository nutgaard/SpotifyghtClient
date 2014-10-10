(function () {
    "use strict";
    angular.module('spotifyghtComponents')
        .directive('fancyButton', [function () {
            return {
                restrict: 'E',
                templateUrl: 'components/fancyinput/button/button.html',
                transclude: true,
                compile: function () {
                    return function (scope, iEl) {
                        var attrs = $(iEl).prop("attributes");
                        var $input = $(iEl).find('.catcher');
                        $.each(attrs, function(){
                            $input.attr(this.name, this.value);
                        });
                    };
                }
            };
        }]);
})();