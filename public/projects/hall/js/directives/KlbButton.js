"use strict";

theKlubApp.directive('klbButton', function ($log, layoutService) {
    return {
        restrict: "A",

        link: function(scope, element) {
            //$log.warn(element);

            element.css({"backgroundColor":layoutService.btnBackgrounColor});
            element.css({"borderColor":layoutService.btnBorderColor});
            element.css({"color":layoutService.btnColor});

            var shadow =  "0 0 5px 2px " + layoutService.btnBorderColor;

            element.css({"box-shadow":shadow});
            element.css({"-moz-box-shadow":shadow});
            element.css({"-webkit-box-shadow":shadow});
            element.css({"-o-box-shadow":shadow});

            element.css({"border":" none"});
            element.css({"-webkit-border-radius":"5px"});
            element.css({"-moz-border-radius":" 5px"});
            element.css({"border-radius":" 5px"});

            element.on("mouseenter", function(){
                if (element.attr("disabled") == undefined)  {
                    element.css({"box-shadow":"0 0 5px 3px #ccc"});
                    element.css({"-moz-box-shadow":"0 0 5px 3px #ccc"});
                    element.css({"-webkit-box-shadow":"0 0 5px 3px #ccc"});
                    element.css({"-o-box-shadow":"0 0 5px 3px #ccc"});
                }
            });

            element.on("mouseleave", function(){
                element.css({"box-shadow":shadow});
                element.css({"-moz-box-shadow":shadow});
                element.css({"-webkit-box-shadow":shadow});
                element.css({"-o-box-shadow":shadow});            });

        }
    }
});

