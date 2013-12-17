"use strict";

theKlubApp.directive('thumbnail', function ($log, $route, singlePhotoService, layoutService) {
    return {
        restrict: "E",
        replace:true,
        templateUrl: "/projects/photo_gallery/templates/directives/thumbnail.html",
        scope:{
            author: "@",
            photoid: "=",
            photoname:"=",
            link2thumb:"="
        },

        link: function(scope, element) {
            element
                .on("mouseenter", function(){
                    if (layoutService.titleBar.logged ) {
                        element.find(".thumb-photo-menu").fadeIn();
                    }
                })
                .on("mouseleave", function(){
                    element.find(".thumb-photo-menu").fadeOut();
                });

            element.find("#rrr")
                .on("click", function(){

                    //var loc = $location.path();

                    singlePhotoService.deletePhoto({id:scope.photoid})
                        .then(function(){
                            $route.reload();
                        },
                        function(status){
                            $log.warn(status);
                        });

                });
        }
    }
});