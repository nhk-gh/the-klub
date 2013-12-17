"use strict";

theKlubApp.directive("overlay", function($log, $timeout, $window){
    return {
        restrict: "A",
        
        link: function(scope, el,  attrs){
            var hidden = angular.element(attrs.hide);
            //$log.warn(hidden);

            var tmo = $timeout(function(){
                resizeOverlay();
            }, 500);

            $($window).resize(function(){
                resizeOverlay();
            });

            scope.$on("destroy", function(){
                $timeout.cancel(tmo);
            });

            function resizeOverlay(){
                el.css("height", 4 + parseInt(hidden.css("height")) + parseInt(angular.element("#submit").css("height")));
                el.css("width", 4 + parseInt(hidden.css("width")));
            }
        }
    }
});