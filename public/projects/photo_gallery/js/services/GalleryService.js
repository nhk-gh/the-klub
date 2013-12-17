"use strict";

theKlubApp.factory('galleryService',
    function($http, $q, $log){
        return {
            getLeftSideBarData: function(){
                var deferred = $q.defer();

                $http({method:"GET", url:"/sidebar"}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn("'/sidebar' error: " + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            },

            getRandomPhoto: function(){
                var deferred = $q.defer();

                $http({method:"GET", url:"/randomPhoto"}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn('"/randomPhoto" error: ' + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            }
        }
    }
);