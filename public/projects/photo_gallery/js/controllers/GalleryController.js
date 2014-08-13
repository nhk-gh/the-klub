"use strict";

theKlubApp.controller('GalleryController',
    function GalleryController($scope, $log, $timeout, $location, $rootScope, layoutService, galleryService){

        layoutService.titleBar.promoMsg = "Photo Gallery";
        layoutService.titleBar.promoImg = '/images/images-transp.png';
        layoutService.titleBar.promoHref = '/gallery';

        layoutService.titleBar.foregroundColor = '#afeeee';
        layoutService.titleBar.backgroundColor = '#003333';
        layoutService.titleBar.linkColor = '#afeeee';
        layoutService.bodyColor = '#336666';
        //layoutService.titleBar.subTitle = "Timeline";
        layoutService.selectedKlub = "gallery";

        layoutService.btnBackgrounColor = "#00cccc";
        layoutService.btnColor =  "#006666"; //,"#0044ff";
        layoutService.btnBorder = "1px solid";
        layoutService.btnBorderColor = "#006666";

        $scope.foregroundColor = function(){
            return {color: layoutService.titleBar.foregroundColor};
        };

        $scope.colors = function(){
            return {
                color: layoutService.titleBar.foregroundColor,
                backgroundColor: layoutService.titleBar.backgroundColor
            };
        };


        $scope.tip = "open menu";

        $scope.randomPhoto = "/images/BirchThicket.jpg";

        var rndPhoto;
        function getRandomPhoto(interval){
            rndPhoto = $timeout(function(){
                galleryService.getRandomPhoto()
                    .then(function(data){
                        if (data.photo)
                            $scope.randomPhoto = data.photo.link;

                        //getRandomPhoto(5000);

                    }, function(status){
                        $timeout.cancel(rndPhoto);
                    })
            }, interval);
        }

        (function(){

            galleryService.getLeftSideBarData()
                .then(function(data){
                    $scope.viewMode = data.sidemenu.viewMode;
                    $scope.authors = data.sidemenu.authors;
                    $scope.genres = data.sidemenu.genres;
                    $scope.totalAuthors = data.allAuthors;
                    $scope.totalPhotos = data.allPhotos;
                }, function(status){

                });

            $rootScope.$broadcast('BREADCRUMB_EVT', null);

            getRandomPhoto(0);
        })();

        $scope.$on("$destroy", function(){
            $timeout.cancel(rndPhoto);
        });

        /*
        $scope.$watch("$location.path()", function(){
            $("[hor-menu-item]").css("background", "none");
        });
        */


    }
);