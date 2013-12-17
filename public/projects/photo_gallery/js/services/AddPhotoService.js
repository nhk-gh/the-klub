"use strict";

theKlubApp.factory("addPhotoService", function($http, $q, $log){
    return {
        photos: {},
        bodyParams: {},
        currentMode: undefined,

        getInitData: function(){
            var deferred = $q.defer();

            $http({method:"GET", url:"/addPhoto"})
                .success(function(data){
                    deferred.resolve(data);
                }).
                error(function(data, status){
                    $log.warn("'/addPhoto' error: " + status);
                    deferred.reject(status);
                });

            return deferred.promise;
        },

        uploadPhotos: function(form){
            var deferred = $q.defer();

            $http({method:"POST", url:"/addPhoto", data:form})
                .success(function(data){
                    deferred.resolve(data);
                }).
                error(function(data, status){
                    $log.warn("'/addPhoto' error: " + status);
                    deferred.reject(status);
                });

            return deferred.promise;
        },

        getPhotoEditData: function(id){
            var deferred = $q.defer();

            $http({method:"GET", url:"/editphoto?editphotoid=" + id + "&return=/singlephoto?viewphoto='Single'"})
                .success(function(data){
                    deferred.resolve(data);
                }).
                error(function(data, status){
                    $log.warn("'/addPhoto' error: " + status);
                    deferred.reject(status);
                });

            return deferred.promise;
        },

        newGenre: function(newGenre){
            var deferred = $q.defer();

            $http({method:"POST", url:"/newGenre?genre="+ newGenre})
                .success(function(data){
                    deferred.resolve(data);
                })
                .error(function(data, status){
                    $log.warn("'/newGenre' error: " + status);
                    deferred.reject(status);
                });

            return deferred.promise;
        }

    };
});