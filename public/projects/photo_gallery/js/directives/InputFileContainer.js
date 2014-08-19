"use strict";

theKlubApp.directive("inputFileContainer", function($log, addPhotoService){
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/projects/photo_gallery/templates/directives/InputFileContainer.html",

        link: function(scope, element){
            var _ppf = element.find("#preview-photo-frame");
            var _preview = element.find("#preview-photo");
            var _browse = element.find("#file-browse");
            var _sel = element.find("#selected-photos");
            var form;

            _ppf
                .on("mouseenter", function(){
                    if ((_preview.attr('src') != '') && (_preview.attr('src') != undefined)){
                        _preview.fadeOut(4, function(){
                            _ppf.addClass('click-to-select');
                        });
                    }
                })
                .on("mouseleave", function(){
                    if ((_preview.attr('src') != '') && (_preview.attr('src') != undefined)){
                        $(this).removeClass('click-to-select');
                        _preview.fadeIn(4);
                    }
                })
                .on("click", function(e){
                    _browse.trigger("click");
                    e.preventDefault();
                });

            _browse.on("change", function(e){
                var fileName;

                _sel.empty();
                _ppf.removeClass('click-to-select');

                fileName = $.map($(this)[0].files, function(fl, ind){
                    if (ind < 10) {
                        _sel.append($('<option class="preview-option" value="' + ind + '" id="' + ind + '">' + fl.name + '</option>'));

                        addPhotoService.bodyParams[ind] = {tags:"", name: fl.name, shortName: fl.name};

                        return fl;
                    }
                });

                if (fileName.length > 0) {
                    angular.element("#overlay").css("z-index", -1);
                }
                else{
                    angular.element("#overlay").css("z-index", "100");
                }

                _sel.val('0');
                _sel.change();
                $("#0").attr("selected", "selected");
        //console.log(fileName);
                addPhotoService.photos = fileName;
            });

            _sel.on("change", function(){
                if ($(this).find('option').length > 0){
                    $("#loading-preview").addClass('bulleta');
                    _preview.fadeOut();

                    var ind = $("#selected-photos").find("option:selected").attr('value');

                    //set short name
                    //$("#shortname").val($.trim($("#preview-hidden-short-" + ind).val()));
                    $("#shortname").val(addPhotoService.bodyParams[ind].shortName);

                    // set genres
                    var inp = $("#genre-list-container").find(":checkbox");
                    inp.attr('checked', false);
                    inp.parent().css('color','');

                    var tags = [];
                    //var val = $.trim($("#preview-hidden-" + ind).val());
                    var val = addPhotoService.bodyParams[ind].tags;

                    if (val !== '') {
                        tags = val.split(',');

                        inp.each(function(){
                            if (!(tags.indexOf($(this).val()) == -1)) {
                                $(this).attr('checked', true);
                                $(this).prop('checked', true);
                                $(this).parent().css('color', 'yellow');
                            }
                        });
                    }

                    // load preview photo
                    var file = $("#file-browse")[0].files[ind];

                    var reader = new FileReader();

                    // file.target.result holds the DataURL which
                    // can be used as a source of the image:

                    //imgpreview is the id of the img tag where you want to display the image
                    reader.onload = function(fl){
                        $('#preview-photo').attr('src',  fl.target.result);

                        waitForPreviewImgComplete();

                        $("#preview-photo").fadeIn();
                        $("#loading-preview").removeClass('bulleta');
                    };

                    // Reading the file as a DataURL. When finished,
                    // this will trigger the onload function above:
                    reader.readAsDataURL(file);
                }
                else{
                    $("#preview-photo-frame").addClass('click-to-select');
                    $('#preview-photo').attr('src', '');
                    $("#preview-photo").fadeOut();
                    $("#loading-preview").removeClass('bulleta');
                }
            });
        }
    };

});

function resizePreview(img){
    var imgW;
    var imgH;

    if (navigator.appName == "Microsoft Internet Explorer") {
        imgW = EXIF.getTag(img, "PixelXDimension");
        imgH = EXIF.getTag(img, "PixelYDimension");
    }
    else {
        imgW = img.naturalWidth;
        imgH = img.naturalHeight;
    }
    var ratio = imgW/imgH;

    //alert(imgW + " x " + imgH + "; "  + ratio);
    // alert("1: " + $("#photo-frame").attr('width')+" x "+$("#photo-frame").prop('height'));

    var singlePhotoMaxSizeH = 140;
    var singlePhotoMaxSizeW = 140;

    var parentTag = $("#preview-photo");
    //alert(parentTag);

    if(imgW > imgH) {
        $(parentTag).css('width', singlePhotoMaxSizeW+'px');
        $(parentTag).css('height', singlePhotoMaxSizeW/ratio+'px');

    } else {
        //alert("h");
        $(parentTag).css('height', singlePhotoMaxSizeH+'px');
        $(parentTag).css('width', singlePhotoMaxSizeH*ratio+'px');
    }
    $(parentTag).css('top', (singlePhotoMaxSizeH - parseInt($(parentTag).css('height')))/2);

}

function waitForPreviewImgComplete() {
    var i;
    var bl = true;
    var img  = $("#preview-photo");

    //alert("0: " + $("#photo-frame").attr('width')+" x "+$("#single-photo").prop('height'));

    for (i = 0; i < img.length; i++) {
        if (navigator.appName == "Microsoft Internet Explorer") {
            bl = bl && img[i].complete;
        }
        else {
            if (typeof img[i].naturalWidth != "undefined" && img[i].naturalWidth != 0)
                bl = bl && true;
            else
                bl = bl && false;
        }
    }

    if (bl == false) {
        setTimeout('waitForPreviewImgComplete()', 500);
    }
    else {
        for (i = 0; i < img.length; i++) {
            resizePreview(img[i]);
        }
    }
}


