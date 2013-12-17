"use strict";

theKlubApp.directive('resizableThumb', function () {
    return {
        link: function(scope, element) {

            element.bind("load" , function(){

                // success, "onload" catched
                // now we can do specific stuff:
                var imgW;
                var imgH;
                var img = element[0];

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

                var singlePhotoMaxSizeH = 120;
                var singlePhotoMaxSizeW = 120;


                var parentTag = angular.element(element).parent().parent().get(0); //it's '#thumb-frame-content' object!!
                var frameTag = angular.element(element).parent().parent().parent().get(0); //it's '#thumb-frame' object!!
                // console.log(parentTag);

                if(imgW > imgH) {
                    $(parentTag).css('width', singlePhotoMaxSizeW+'px');
                    $(parentTag).css('height', singlePhotoMaxSizeW/ratio+'px');
                    $(parentTag).css('top', (singlePhotoMaxSizeH - parseInt($(parentTag).css('height')))*2/3);
                } else {
                    $(parentTag).css('height', singlePhotoMaxSizeH+'px');
                    $(parentTag).css('width', singlePhotoMaxSizeH*ratio+'px');
                }

                var dur = Math.floor(Math.random()*3) + 1;
                $(frameTag).css("-webkit-animation-duration",dur+'s');
                $(frameTag).css("-moz-animation-duration",dur+'s');
                $(frameTag).css("-o-animation-duration",dur+'s');
                $(frameTag).css("animation-duration",dur+'s');

                var delay = Math.floor(Math.random()*3) + 1;
                $(frameTag).css("-webkit-animation-duration", delay+'s');
                $(frameTag).css("-moz-animation-duration", delay+'s');
                $(frameTag).css("-o-animation-duration", delay+'s');
                $(frameTag).css("animation-duration", delay+'s');

                $(frameTag).addClass('animated swing');
            });

        }
    }
});