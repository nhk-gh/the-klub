"use strict";

theKlubApp.directive("passwordReminder",
    function($log, $timeout){
        return {
            restrict: "A",

            link: function(scope, element, attrs){
                //initial state
                $timeout(function(){
                    $("#radio1").prop('checked', true);
                    $("label#lbl-fullname").css('display', 'none');
                }, 200);

                element.find("#radio1").on("click", function(){
                    $("label#lbl-username").css('display', 'block');
                    $("label#lbl-fullname").css('display', 'none');
                })

                element.find("#radio2").on("click", function(){
                    $("label#lbl-username").css('display', 'none');
                    $("label#lbl-fullname").css('display', 'block');
                })
            }
        };
    });
