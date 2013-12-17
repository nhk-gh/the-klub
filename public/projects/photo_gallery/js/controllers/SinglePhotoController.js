"use strict";

theKlubApp.controller('SinglePhotoController',
    function SinglePhotoController($scope, $log, $route, $location, singlePhotoService, userService){

        function ex(){
            var oImg = document.getElementById("single-photo-content");

            //$log.info("I was taken by a " + EXIF.getTag(oImg, "Make") + " " + EXIF.getTag(oImg, "Model"));

            return EXIF.getTag(oImg, "Model") +", F: " + EXIF.getTag(oImg, "FNumber") + ", Exposure: " +
                EXIF.getTag(oImg, "ExposureTime");
        }

        $scope.getExifData = function(){
            $scope.$emit("kkk", true);
        };

        $scope.$on("kkk", function(evnt, param){
            if (!$scope.$$phase){
                $scope.$apply(function(){
                    //$scope.camera = "";

                    if(!param) {
                        EXIF.getAll();
                    }
                    else {
                        $scope.camera = ex();
                    }

                 });
            }
            else {
                $scope.camera = ex();
            }
        });

        function setScopeData(data){
            $scope.photos = data.photos;
            $scope.title = data.photos[1].link;
            $scope.nextPhotoID = data.photos[2] ? data.photos[2]._id : null;
            $scope.prevPhotoID = data.photos[0] ? data.photos[0]._id : null;
            $scope.comments = data.comments;
            $scope.currentComment = 0;

            singlePhotoService.photos = data.photos;

            /*
            $scope.camera = singlePhotoService.camera;
            $log.info("$scope.camera  = " + $scope.camera);
            */
        }

        $scope.initSinglePhoto = function() {
            singlePhotoService.downloadPhoto($route.current.params)
                .then(function(data){
                    setScopeData(data);
                },
                function(status){
                    $log.warn(status);
                });
        };



        $scope.$on("getPhoto", function(evnt, param){
            var id;

            if  (param === "prev-photo") {
                id = $scope.prevPhotoID;
            }
            else {
                id = $scope.nextPhotoID;
            }

            if (!$scope.$$phase){
                $scope.$apply(function(){
                    $scope.getPhoto(id);
                    console.log("apply");
                });
            }
            else {
                $scope.getPhoto(id);
                console.log("not apply");
            }
        });

        $scope.getPhoto = function(param) {
            singlePhotoService.downloadPhoto({"viewphoto":"Single","id": param})
                .then(function(data){
                    setScopeData(data);
                },
                function(status){
                    $log.warn(status);
                });
        };

        $scope.deletePhoto = function(){
            singlePhotoService.deletePhoto({id:$scope.photos[1]._id})
                .then(function(){
                    if (($scope.photos[0] == null) && ($scope.photos[2] == null))
                    // the only photo in selected genre
                        $location.path("/gallery");
                    else if($scope.photos[2] == null)
                    // last photo in the list deleted
                        $scope.getPhoto($scope.photos[0]._id);
                    else
                        $scope.getPhoto($scope.photos[2]._id);
                },
                function(status){
                    $log.warn(status);
                });
        };

        $scope.enableSinglePhotoMenu = function(){
            if ($scope.photos === undefined)
                return false;
            return userService.user.logged  & ( $scope.photos[1].author == userService.user.name );
        };

        $scope.showPrevScroll = function(){
            if ($scope.prevPhotoID == null) {
                return {
                    "visibility": "hidden"
                };
            }
            return {
                "visibility": "visible"
            };
        };

        $scope.showNextScroll = function(){
            if ($scope.nextPhotoID == null)
                return {
                    "visibility": "hidden"
                };
            return {
                "visibility": "visible"
            };
        };

        /////////////////////////////////////////
        //
        //    all about comments
        //
        /////////////////////////////////////////
        $scope.getCommentInd = function(){
            if($scope.comments){
                if ($scope.comments.length > 0)
                    return $scope.currentComment + 1;
            }
            return  0;
        };

        $scope.currentCommentAuthor = function(){

            try{//if($scope.comments){
                return "By " + $scope.comments[$scope.currentComment].author;
            }
            catch(e){
                return "";
            }
        };

        $scope.currentCommentDate = function(){
            var val = "";

            try{
                var d = new Date($scope.comments[$scope.currentComment].date).toLocaleDateString();

                if (d !== "Invalid Date")
                    val = "on  " + d;
            }
            catch(e){}

            return val;
        };

        $scope.nextComment = function(){
            //if ($scope.currentComment < ($scope.comments.length -1)){
                $scope.currentComment++;
            //}
        };

        $scope.prevComment = function(){
            //if ($scope.currentComment > 0){
                $scope.currentComment--;
            //}
        };

        $scope.enablePrevCommentBtn = function(){
            if($scope.comments){
                if (($scope.comments.length > 1) && ($scope.currentComment > 0)){
                    return {"visibility":"visible"};
                }
            }
            return {"visibility":"hidden"};
        };

        $scope.enableNextCommentBtn =function(){
            if($scope.comments){
                if ($scope.currentComment < $scope.comments.length - 1){
                    return {"visibility":"visible"};
                }
            }
            return {"visibility":"hidden"};
        };

        $scope.showCommentControls = function(){
            return userService.user.logged;
        };

        var maxCommentLength = 1000;
        $scope.commentWritable = false;
        $scope.newCommentText = "";
        $scope.leftSymbols = maxCommentLength;

        function initNewCommentVars()
        {
            $scope.newCommentText = "";
            $scope.leftSymbols = maxCommentLength;
        }

        $scope.writeComment = function(){
            $scope.commentWritable = true;
            initNewCommentVars();
        };

        $scope.saveComment = function(){
            $scope.commentWritable = false;

            var comment = {
                photoid: $scope.photos[1]._id,
                comment: $scope.newCommentText,
                user: userService.user.username
            };
            singlePhotoService.saveComment(comment)
                .then(function(data){
                    $scope.comments = data[1];
                    $scope.currentComment = 0;

                },
                function(status){
                    $log.warn(status);
                });
            initNewCommentVars();
        };

        $scope.cancelComment = function(){
            $scope.commentWritable = false;
            initNewCommentVars();
        };

        $scope.showLeftSymbols = function(){
            $scope.leftSymbols = maxCommentLength - $scope.newCommentText.length;
        };

    }
);