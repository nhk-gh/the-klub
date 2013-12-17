"use strict";

theKlubApp.directive("klbAfterError",function($log){
    return {
        restrict: "A",

        link: function(scope, element){
            var inputs = element.find("input");

            inputs.on("keypress", function(){
                $(this).css("backgroundColor","white");
            });
       }
    }

});
