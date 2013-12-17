"use strict";

theKlubApp.directive('klbSplit', function ($log, layoutService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/projects/hall/templates/directives/klbSplit.html",

        link: function(scope, element) {

            //var tmr;
            var ul =  element.find("ul");
            var li =  element.find("li");
            var split = element.find(".split");

            split
                .on("mouseenter", function(){
                    showDropDown();
                })
                .on("mouseleave", function(){
                    //tmr = $timeout(hideDropDown, 500);
                    hideDropDown();
                })
                .on("click", function(){
                    //element.parent().children().css({"background": "none"});
                    //element.css({"background": "-webkit-radial-gradient(50% 0%, farthest-side, lawngreen, transparent)"});
                });

            /*
            li.on("mouseenter", function(){
                    angular.element(this).css({"backgroundColor": "green"});
                })
                .on("mouseleave", function(){
                    angular.element(this).css({"backgroundColor": "inherit"});
                })
            */
            function hideDropDown(){
                ul.addClass('hide-dropdown');
                ul.removeClass('show-dropdown');
                split.removeClass('dropped');
                split.parent().removeClass('menu-shadow');
                split.css({"backgroundColor": "inherit"});
            }

            function showDropDown(){
                ul.removeClass('hide-dropdown');
                ul.addClass('show-dropdown');
                split.addClass('dropped');
                split.css({"backgroundColor": layoutService.titleBar.backgroundColor});

                //$log.warn($(".title").height());

                var h = $(".title").height() + parseInt(ul.height())+ 3 + "px";
                split.parent().css('height', h);
                split.parent().addClass('menu-shadow');
            }

            (function(){
                hideDropDown();
            })();
        }
    }
});
