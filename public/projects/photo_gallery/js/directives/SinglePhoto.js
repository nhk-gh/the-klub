theKlubApp.directive('exifData', function ($timeout) {
    return {
        restrict: "E",
        /*replace: true,
        transclude: true,
        template: "<div class='exif-data'>" +
                       "<div ng-transclude>" +
                       "</div>"  +
                  "</div>", */

        link: function(scope, element) {
            element.on("mouseover", function(){
                scope.$emit("kkk", true);
            });

        }

    }
});

/*
theKlubApp.directive('viewPhotoFrame', function ($log, singlePhotoService) {
    return {
        restrict: "E",
        replace: true,
        template: '<img id="single-photo-content" class="klb-fit-screen single-photo" ng-src="{{source}}"  view-photo exif="true"/>',
        scope: {
            source: "="
        },

        link: function(scope, element) {


        }
    }
});
*/

theKlubApp.directive('viewPhoto', function () {
    return {
        restrict: "A",

        link: function(scope, element) {
            element.on("load", function() {
                waitForImgComplete();
            });

            function msieversion(){
                // from microsoft support
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf ( "MSIE " );

                if ( msie > 0 )      // If Internet Explorer, return version number
                    return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
                else                 // If another browser, return 0
                    return 0;
            }

            function resizePhoto(img){
                var imgW;
                var imgH;
                //var size;

                if (navigator.appName == "Microsoft Internet Explorer") {
                    if (msieversion() < 10){
                        imgW = EXIF.getTag(img, "PixelXDimension");
                        imgH = EXIF.getTag(img, "PixelYDimension");
                    }
                    else{
                        imgW = img.naturalWidth;
                        imgH = img.naturalHeight;
                    }
                }
                else {
                    imgW = img.naturalWidth;
                    imgH = img.naturalHeight;
                }
                var ratio = imgW/imgH;

                var singlePhotoMaxSizeH = 486;//550;
                var singlePhotoMaxSizeW = 650;

                var $spc = $("#single-photo-content");
                $spc.css('visibility', 'visible');

                if(imgW > imgH) {
                    //alert("w");
                    $spc.css('width', singlePhotoMaxSizeW +'px');
                    $spc.css('height', singlePhotoMaxSizeW/ratio +'px');
                } else {
                    //alert("h");
                    $spc.css('height', singlePhotoMaxSizeH +'px');
                    $spc.css('width', singlePhotoMaxSizeH*ratio +'px');
                }

                var l = (parseInt($("#photo-frame").css('width')) - parseInt($spc.css('width'))-10)/2 + 'px';
                $spc.css('left', l);

                $("#prev-photo").css('height', $spc.css('height'));
                $("#next-photo").css('height', $spc.css('height'));

                $("#photo-frame").css('height', $spc.css('height'));
                var h = parseInt($spc.css('height'))+2*parseInt($spc.css('outline-width')) + 50 + 'px';
                $("#photo-container").css('height', h);

                $("#leftsidebar").css('height', $("#single-wrapper").css('height'));

                scope.$emit("kkk", false);
            }

            function waitForImgComplete() {
                var i;
                var bl = true;
                var img  = $(".single-photo");

                //alert("0: " + $("#photo-frame").attr('width')+" x "+$("#single-photo").prop('height'));

                for (i = 0; i < img.length; i++) {
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        bl = bl && img[i].complete;
                    }
                    else {
                        bl = bl && img[i].complete;
                        /*
                        if (typeof img[i].naturalWidth != "undefined" && img[i].naturalWidth != 0)
                            bl = bl && true;
                        else
                            bl = bl && false;
                        */
                    }
                }

                if (bl == false) {
                    setTimeout('waitForImgComplete()', 500);
                }
                else {
                    for (i = 0; i < img.length; i++) {
                        resizePhoto(img[i]);
                        $('.klb-fit-screen').klbFitScreen();
                        //img.fadeIn(500);
                    }
                }
            }
        }
    };
});

theKlubApp.directive('scrollImage', function () {
    return {
        restrict: "A",

        link: function(scope, element, attr) {
            element.on("mouseenter", function(){
                $(this).css({"opacity": 1});
                $(this).css({"filter": "alpha(opacity=100)"});  /* For IE8 and earlier */
            })
            .on("mouseleave", function(){
                $(this).css({"opacity": 0.5});
                $(this).css({"filter": "alpha(opacity=50)"});  /* For IE8 and earlier */
            })
            .on("click", function(){
                //$("#single-photo-content").fadeOut(600);

                /*$("#photo-frame").append('<img id="single-photo-content" class="klb-fit-screen single-photo"' +
                    'ng-src="{{ photos[1].link }}"  view-photo exif="true"/>"');
                  */
                scope.$emit("getPhoto", attr.id)
            });
        }
    };
});

