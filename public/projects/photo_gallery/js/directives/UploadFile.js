"use strict";

theKlubApp.directive("uploadfiles", function($log){
    return {
        restrict: "A",

        link: function(scope, element){
            element.on("change", function(event){
                /*
                scope.uploadfiles = event.target.files;
                scope.$apply();
                */
                //scope.$emit("FILES_SELECTED", event.target.files);
                /*
                if (event.target.files.length > 0) {
                    angular.element("#overlay").css("z-index", -1);
                }
                else{
                    angular.element("#overlay").css("z-index", "100");
                }
                */
            });
        }
    }
});
