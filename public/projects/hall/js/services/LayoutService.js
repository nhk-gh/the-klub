"use strict";

theKlubApp.factory('layoutService', function($http, $q, $log){
    return {
        /* default values */
        titleBar:{
            promoMsg: 'Hall of Passions',
            promoImg: '/images/gentleman-club-concept-3.jpg',
            promoHref: '/',
            logged: false,
            foregroundColor: '#ffdd86',
            backgroundColor: '#070707',
            linkColor: 'sandybrown',
            subTitle: "Select your passion"
        },
        bodyColor: 'tan',
        selectedKlub: "hall",

        btnBackgrounColor: "saddlebrown",
        btnColor: "khaki",//"#6a4229",
        btnBorder: "1px solid",
        btnBorderColor: "khaki",

        deleteAllUserPhotos: function(user){
          var deferred = $q.defer();

          $http({method:"GET", url:"/deleteAllUserPhotos", params:user}).
            success(function(data){
              deferred.resolve(data);
            }).
            error(function(data, status){
              $log.error(' "/deleteAllUserPhotos" error: ' + status);
              deferred.reject(status);
            });

          return deferred.promise;
        }
    }
});