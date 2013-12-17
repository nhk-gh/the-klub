"use strict";

theKlubApp.controller('LayoutController',
    function LayoutController($scope, $log, layoutService){
        $scope.titleBar = layoutService.titleBar;

        $scope.linkColor = function(){
            return  {color: layoutService.titleBar.linkColor};
        };

        $scope.backgroundColor = function(){
            return {backgroundColor: layoutService.titleBar.backgroundColor};
        };

        $scope.foregroundColor = function(){
            return {color: layoutService.titleBar.foregroundColor};
        };

        $scope.bodyColor = function(){
            return {
                backgroundColor: layoutService.bodyColor
            };
        };

        $scope.colors = function(){
            return {
                color: layoutService.titleBar.foregroundColor,
                backgroundColor: layoutService.titleBar.backgroundColor
            };
        };

        $scope.showHallMenu = function(){
            return layoutService.selectedKlub === "hall";

        };

        $scope.showGalleryMenu = function(){
           return layoutService.selectedKlub === "gallery";

        };

        $scope.showGenreMenu = function(){

        };

        /*
        $scope.initLeftSideBar = function(){
            galleryService.getLeftSideBarData()
                .then(function(data){
                    $scope.viewMode = data.sidemenu.viewMode;
                    $scope.authors = data.sidemenu.authors;
                    $scope.genres = data.sidemenu.genres;
                    $scope.totalAuthors = data.allAuthors;
                    $scope.totalPhotos = data.allPhotos;
                }, function(status){
                    $log.warn(status);
                });
        };
        */
    }
);
