"use strict";

theKlubApp.controller('ThumbsController',
    function ThumbsController($scope, $log, $rootScope, thumbsService, layoutService, $route){

        $scope.initThumbs = function(){
            thumbsService.getThumbs($route.current.params)
                .then(function(data){
                    $scope.gallery = data.gallery;
                    $scope.currentPage = data.page;
                    $scope.totalPages = data.pages;
                    $scope.thumbs = data.thumbs || [];
                    //$log.info($scope.thumbs)
                    $rootScope.$broadcast('BREADCRUMB_EVT', {type:'thumb', param:$route.current.params});

                }, function(status){
                    $log.warn(status);
                });
        };

        $scope.nextPage = function(){
            $route.current.params.pagenumber = parseInt($scope.currentPage) + 1;
           // $log.info($route.current.params);

            thumbsService.getThumbs($route.current.params)
                .then(function(data){
                    $scope.gallery = data.gallery;
                    $scope.currentPage = data.page;
                    $scope.totalPages = data.pages;
                    $scope.thumbs = data.thumbs || [];

                    //$log.warn(data);

                }, function(status){
                    $log.warn(status);
                });
        };

        $scope.prevPage = function(){
            $route.current.params.pagenumber = parseInt($scope.currentPage) - 1;
           // $log.info($route.current.params);

            thumbsService.getThumbs($route.current.params)
                .then(function(data){
                    $scope.gallery = data.gallery;
                    $scope.currentPage = data.page;
                    $scope.totalPages = data.pages;
                    $scope.thumbs = data.thumbs || [];

                    //$log.warn(data);

                }, function(status){
                    $log.warn(status);
                });
        };

        $scope.colors = function(){
            return {
                color: layoutService.titleBar.foregroundColor,
                backgroundColor: layoutService.titleBar.backgroundColor
            };
        };

        $scope.linkToPhoto = function(photo){
            return ("/singlephoto?viewphoto='Single'&id=" + photo.photoid);
        };

        $scope.enableThumbNextBtn = function(){
            return $scope.currentPage < $scope.totalPages;
        };

        $scope.enableThumbPrevBtn = function(){
            return $scope.currentPage > 1;
        };

        $scope.transparateThumbNextBtn = function(){
            return $scope.currentPage < $scope.totalPages ? "enabledObject" : "disabledObject";
        };

        $scope.transparateThumbPrevBtn = function(){
            return $scope.currentPage > 1 ? "enabledObject" : "disabledObject";
        };
    }
);