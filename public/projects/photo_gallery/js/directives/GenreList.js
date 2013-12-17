"use strict";

theKlubApp.directive("genreList", function($log, $route, $location, addPhotoService){
/*    return {
        restrict: "E",
        replace: true,
        templateUrl: "/projects/photo_gallery/templates/directives/GenreList.html",

        link: function(scope, element, attrs){
            var _checks;

            var newg = element.find("#new-genre-anchor");

            newg.on("click", function(){
                var gName = $("#new-genre").val();

                gName = gName.charAt(0).toUpperCase() + gName.slice(1);

                if ((gName == "") || (/^[a-zA-Z1-9]*$/.test(gName) == false)){
                    $("#error-message").removeClass("invisible");
                    //$("#error-message span").text(" Genre name: one word (letters only) fifteen symbols max.! ");
                    // $("#error-message span").css({"color": "white","background-color":"red"});
                }
                else{
                    addPhotoService.newGenre(gName)
                        .then(function(){
                            switch (addPhotoService.currentMode){
                                case "add":
                                    $route.reload();
                                    break;

                                case "edit":
                                    $route.reload();
                                    break;
                            }
                        }, function(status){

                        })
                }
            });

            attrs.$observe("freak", function(){
                _checks = element.find(":checkbox");//$("input");//$("#genre-list-container").find('[type="checkbox"]');

                _checks.on("change", function(){
                    var chk = $(this);
                    var photoID;

                    switch (addPhotoService.currentMode){
                        case "add":
                            photoID = $("#selected-photos").find("option:selected").attr('id');
                            break;

                        case "edit":
                            photoID = 1;
                            break;
                    }

                    var tags = [];
                    //var val = $.trim($("#preview-hidden-" + photoID).val());
                    var val = addPhotoService.bodyParams[photoID].tags;

                    if (val !== '')
                        tags = val.split(',');

                    if (chk.attr("checked") === "checked") {
                        tags = tags.filter(function(tag){
                            if (tag != chk.val())
                                return tag;
                        });
                        chk.removeAttr("checked");
                        chk.parent().css('color','');
                    }
                    else {
                        tags.push(chk.val());
                        chk.parent().css('color','yellow');
                        chk.attr("checked", "checked");
                    }
                    //$("#preview-hidden-" + photoID).val(tags.join(','));
                    addPhotoService.bodyParams[photoID].tags = tags.join(',');
                });
            });
        }
    };*/
    return {
        restrict: "A",

        link: function(scope, element, attrs){

            element.on("change", function(){
                var chk = $(this);
                var photoID;

                switch (addPhotoService.currentMode){
                    case "add":
                        photoID = $("#selected-photos").find("option:selected").attr('id');
                        break;

                    case "edit":
                        photoID = 1;
                        break;
                }

                var tags = [];
                //var val = $.trim($("#preview-hidden-" + photoID).val());
                var val = addPhotoService.bodyParams[photoID].tags;

                if (val !== '') {
                    tags = val.split(',');
                }

                if (chk.attr("checked") === "checked") {
                    tags = tags.filter(function(tag){
                        if (tag != chk.val()) {
                            return tag;
                        }
                    });
                    chk.removeAttr("checked");
                    chk.parent().css('color','');
                }
                else {
                    tags.push(chk.val());
                    chk.parent().css('color','yellow');
                    chk.attr("checked", "checked");
                }
                //$("#preview-hidden-" + photoID).val(tags.join(','));
                addPhotoService.bodyParams[photoID].tags = tags.join(',');
            });
        }
    };
});
