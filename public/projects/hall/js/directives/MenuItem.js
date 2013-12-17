"use strict";

theKlubApp.directive('horMenuItem', function ($log) {
    return {
        restrict: "A",

        link: function(scope, element) {

            var anchor =  angular.element(element.children()[0]);//same as: element.find("a");

            anchor
                .on("mouseenter", function(){
                    anchor.css({"background": "-webkit-radial-gradient(50% 0%, farthest-side, yellow, transparent)"});
                    anchor.css({"background": "-moz-radial-gradient(50% 0%, farthest-side, yellow, transparent)"});

                    /* Firefox 3.6+
                    anchor.css({"background": "-moz-radial-gradient(circle, yellow, transparent)"});
                    */
                    /* IE 10
                    anchor.css({" background": "-ms-radial-gradient(circle, #1a82f7, #2F2727)"});*/
                })
                .on("mouseleave", function(){
                    anchor.css({"background": "none"});
                })
                .on("click", function(){
                    //element.parent().children().css({"background": "none"});
                    //element.css({"background": "-webkit-radial-gradient(50% 0%, farthest-side, lawngreen, transparent)"});
                });


        }
    }
});

theKlubApp.directive('vertMenuItem', function ($log) {
    return {
        restrict: "A",

        link: function(scope, element) {

            var anchor =  angular.element(element.children()[0]);//same as: element.find("a");

            anchor
                .on("mouseenter", function(){
                    anchor.css({"background": "-webkit-radial-gradient(90% 50%, farthest-corner, yellow, transparent)"});
                    anchor.css({"background": "-moz-radial-gradient(90% 50%, farthest-corner, yellow, transparent)"});
                })
                .on("mouseleave", function(){
                    anchor.css({"background": "none"});
                })
                .on("click", function(){
                    //element.parent().children().css({"background": "none"});
                    //element.css({"background": "-webkit-radial-gradient(50% 0%, farthest-side, lawngreen, transparent)"});
                });


        }
    }
});