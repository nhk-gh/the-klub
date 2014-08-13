"use strict";

theKlubApp.controller("AddPhotoController",
    function AddPhotoController($scope, $log, $http, $timeout, $route, $rootScope,
                                addPhotoService, singlePhotoService, layoutService){

        layoutService.titleBar.foregroundColor = '#afeeee';
        layoutService.titleBar.backgroundColor = '#003333';
        layoutService.titleBar.linkColor = '#afeeee';
        layoutService.bodyColor = '#336666';

        layoutService.btnBackgrounColor = "#004444";
        layoutService.btnColor = "#00cccc"; //"#006666",
        layoutService.btnBorder = "1px solid";
        layoutService.btnBorderColor = "#009999";

        $scope.initAddPhoto = function(){
           addPhotoService.getInitData()
               .then(function(data){
                   $scope.info = data.info;
                   $scope.genres = data.genre;
                   $scope.author = data.loggedUser;

                   addPhotoService.currentMode = "add";

                   $rootScope.$broadcast('BREADCRUMB_EVT', {type:'addphoto', param: null});

               }, function(status){

               });
        };

        $scope.photo4edit = singlePhotoService.photos[1];

        $scope.initEditPhoto = function(){
            addPhotoService.getPhotoEditData($scope.photo4edit._id)
                .then(function(data){
                    $scope.info = data.info;
                    $scope.genres = data.genre;
                    $scope.photo4edit = data.photo;

                    addPhotoService.photos[1] =  $scope.photo4edit;

                    addPhotoService.bodyParams[1] = {tags:"", name: $scope.photo4edit.photoname,
                                                     shortName: $scope.photo4edit.photoname};
                    addPhotoService.currentMode = "edit";

                    var tmo = $timeout(function(){
                        // set genres
                        var inp = $("#genre-list-container").find(":checkbox");

                        var tags = [];
                        //var val = $.trim($("#preview-hidden-" + ind).val());
                        $scope.photo4edit.genres.forEach(function(objGenre, ind){
                            tags[ind] = objGenre.name;
                        });
                        addPhotoService.bodyParams[1].tags = tags.join(',');

                        inp.each(function(){
                            if (!(tags.indexOf($(this).val()) == -1)) {
                                $(this).attr('checked', 'checked');
                                $(this).parent().css('color', 'yellow');
                            }
                        });
                    }, 500);


                }, function(status){

                });
        };

        $scope.colors = function(){
            return {
                color: layoutService.titleBar.foregroundColor,
                backgroundColor: layoutService.titleBar.backgroundColor
            };
        };

        $scope.shortNameKeyUp = function(el){
            var ind = -1;

            switch (addPhotoService.currentMode){
                case "add":
                    ind = $("#selected-photos").find("option:selected").attr('value');
                    break;
                case "edit":
                    ind = 1;
                    break;
            }

            if (ind != -1)
                addPhotoService.bodyParams[ind].shortName = el.value;
            else
                addPhotoService.bodyParams[ind].shortName = "";
        };

        $scope.uploadFile = function() {
            var fd = new FormData();
            //$scope.files = addPhotoService.photos;
            $log.warn($scope.files) ;

            for (var i in addPhotoService.photos) {
                fd.append("photo", addPhotoService.photos[i]);
                fd.append(addPhotoService.bodyParams[i].name, addPhotoService.bodyParams[i].tags);
                fd.append("short-"+addPhotoService.photos[i].name, addPhotoService.bodyParams[i].shortName);
            };
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/addPhoto");
            $scope.progressVisible = true;
            xhr.send(fd);
        };

        $scope.editFile = function() {
            var fd = new FormData();
            //$scope.files = addPhotoService.photos;
            //$log.warn($scope.files) ;


            fd.append("updateid", addPhotoService.photos[1]._id);
            //fd.append("location", "");
            //fd.append("new-genre", "");
            fd.append("genres", addPhotoService.bodyParams[1].tags);

            $log.warn(addPhotoService.bodyParams[1].shortName);

            if(addPhotoService.bodyParams[1].shortName == "")
                fd.append("shortname", addPhotoService.photos[1].photoname);
            else
                fd.append("shortname", addPhotoService.bodyParams[1].shortName);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/editPhoto");
            $scope.progressVisible = true;
            xhr.send(fd);
        };

        $scope.newGenreName = "";
        $scope.showNewGenreError = false;

        $scope.newGenre = function(){
            var gName = $scope.newGenreName;

            gName = gName.charAt(0).toUpperCase() + gName.slice(1);

            if ((gName == "") || (/^[a-zA-Z1-9]*$/.test(gName) == false)){
                //$("#error-message").removeClass("invisible");
                $scope.showNewGenreError = true;
            }
            else{
                addPhotoService.newGenre(gName)
                    .then(function(){
                        switch (addPhotoService.currentMode){
                            case "add":
                                //$route.reload();
                                $scope.initAddPhoto();
                                break;

                            case "edit":
                                $route.reload();
                                break;
                        }
                    }, function(status){

                    })
            }
        };

        $scope.newGenreKeyUp = function(el){
            if ($scope.showNewGenreError)
                $scope.showNewGenreError = false;
        };

        function uploadProgress(evt) {
            $scope.$apply(function(){
                if (evt.lengthComputable) {
                    $scope.progress = Math.round(evt.loaded * 100 / evt.total);
                } else {
                    $scope.progress = 'unable to compute';
                }
            });
        };

        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
            $scope.$apply(function(){
                $scope.progressVisible = false;
                $scope.info = JSON.parse(evt.target.responseText).info;

                if (addPhotoService.currentMode == "edit"){
                    if ($scope.info == ""){
                        history.back();
                    }
                }
            })
        }

        function uploadFailed(evt) {
            $scope.$apply(function(){
                $scope.progressVisible = false;
                $scope.info = "There was an error attempting to upload the file.";
            });
        }

        function uploadCanceled(evt) {
            $scope.$apply(function(){
                $scope.progressVisible = false;
                $scope.info = "The upload has been canceled by the user or the browser dropped the connection.";
            })
        }
    }
);
