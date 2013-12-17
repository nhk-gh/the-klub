"use strict";

theKlubApp.factory('singlePhotoService',
    function($http, $q, $log){
        return {
            photos: {},
            camera: "unknown",

            downloadPhoto: function(params){
                var deferred = $q.defer();

                $http({method:"GET", url:"/singlePhoto", params:params}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn(' "/singlePhoto" error: ' + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            },
            /*
            cameraType: function(){
                EXIF.getAll();

                var oImg = document.getElementById("single-photo-content");
                $log.info(oImg);

                $log.info("I was taken by a " + EXIF.getTag(oImg, "Make") + " " + EXIF.getTag(oImg, "Model"));

                return  EXIF.getTag(oImg, "Model");
            },
            */
            saveComment: function(comment){
                var deferred = $q.defer();

                $http({method:"POST", url:"/addComment", params:comment}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn(' "/addcomment" error: ' + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            },

            deletePhoto: function(id){
                var deferred = $q.defer();

                $http({method:"GET", url:"/deletePhoto", params:id}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn(' "/deletePhoto" error: ' + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            }

        }
    }
);