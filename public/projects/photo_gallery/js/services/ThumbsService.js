"use strict";

theKlubApp.factory('thumbsService',
    function($http, $q, $log){
        return {
            getThumbs: function(params){
                var deferred = $q.defer();

                $http({method:"GET", url:"/thumbs", params:params}).
                    success(function(data){
                        deferred.resolve(data);
                    }).
                    error(function(data, status){
                        $log.warn('error: ' + status);
                        deferred.reject(status);
                    });

                return deferred.promise;
            }

        }
    }
);