"use strict";

var theKlubApp;
theKlubApp = angular.module("theKlubApp", ["ui.bootstrap"],
    function ($dialogProvider) {
        $dialogProvider.options({dialogFade: true});

    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "/projects/hall/templates/hall.html",
                controller: "HallController"
            })

            .when("/gallery",
            {
                templateUrl: "/projects/photo_gallery/templates/galleryHome.html",
                controller: "GalleryController"
            })

            .when("/genre",
            {
                templateUrl: "/projects/photo_gallery/templates/thumbs.html",
                controller: "ThumbsController"
            })

            .when("/singlephoto",
            {
                templateUrl: "/projects/photo_gallery/templates/singlePhoto.html",
                controller: "SinglePhotoController"
            })

            .when("/addPhoto",
            {
                templateUrl: "/projects/photo_gallery/templates/addPhoto.html",
                controller: "AddPhotoController"
            })

            .when("/editPhoto",
            {
                templateUrl: "/projects/photo_gallery/templates/editPhoto.html",
                controller: "AddPhotoController"
            })

            .when("/proba",
            {
                templateUrl: "/projects/photo_gallery/templates/proba.html",
                controller: "probaController"
            })

            .otherwise({redirectTo:"/"});

        $locationProvider.html5Mode(true);
    });