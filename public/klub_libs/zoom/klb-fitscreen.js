/**
 * Created with JetBrains WebStorm.
 * User: nhk
 * Date: 6/17/13
 * Time: 2:43 PM
 * To change this template use File | Settings | File Templates.
 */


(function($){
    jQuery.fn.klbFitScreen = function(options){
        options = $.extend({
            backColor: 'white',
            clickable: false
        }, options);

        //alert(this.get(0).tagName);
        $('.klb-fit-screen').each(function() {
            //alert(this.is('img'));
            var me = $(this);
            var zoomed;

            var oH = $(window).height();
            var oW = $(window).width();

            // get size of the original image to fit to the screen size
            var iW = document.getElementById(me.attr('id')).naturalWidth;
            var iH = document.getElementById(me.attr('id')).naturalHeight;

            me.click(function(e){
                //alert('oops... '+iW+'x'+iH +', '+oW+'x'+oH);

                if(me.css('cursor') != 'default'){
                    //alert(me.attr('src'));
                    showBigPhoto();
                }
                //e.preventDefault();
            });

            me.mouseover(function(){
                if(iW>oW && iH>oH){
                    me.css('cursor', 'url(../images/zoom_in_24x24.png) 0 0, pointer');
                }  else {
                    me.css('cursor', 'default');
                }
            });

            $('body').on('click', '.klb-fit-container', function(){
                removeBigPhoto();
            });

            $(window).resize(function(){
                //alert($('#klb-fit-img') == undefined);
                if (zoomed){
                    removeBigPhoto();
                    //showBigPhoto();
                }
            });

            $(window).scroll(function(){
                //alert('ll');
                removeBigPhoto();

            });

            function showBigPhoto(){
                // When the image is too small so, do nothing
                var oH = $(window).height();
                var oW = $(window).width();

                // get size of the original image to fit to the screen size
                var iW = document.getElementById(me.attr('id')).naturalWidth;
                var iH = document.getElementById(me.attr('id')).naturalHeight;

                if(iW>oW && iH>oH){
                    // add semitransparent background
                    $('body').append('<div class="klb-fit-backgrnd"></div>');
                    var bg = $('.klb-fit-backgrnd');

                    // add photo container
                    $('body').append('<div class="klb-fit-container"></div>');
                    var bph =  $('.klb-fit-container');
                    bph.css('display', 'inline-block');

                    // add image
                    bph.append('<img id="klb-fit-img" />');
                    var img = $('#klb-fit-img');
                    img.attr('src', me.attr('src'));

                    bg.css('position', 'absolute');
                    bg.css('left', '0px');
                    bg.css('top', '0px');
                    bg.css('width', $(window).width());
                    bg.css('height',  $(window).height());
                    bg.css('top', $(window).scrollTop());
                    bg.css('left', $(window).scrollLeft());
                    bg.css('display', 'block');
                    bg.css('opacity', '0.8');
                    bg.css('background-color', options.backColor);
                    bg.css('z-index', bph.css('z-index')-1);


                    // Otherwise, proportionate the image relative
                    // to its container
                    if(oH/iH > oW/iW){
                        bph.css("width", oW+'px');
                        bph.css("height", iH*(oW/iW)-10+'px')
                    } else {
                        bph.css("height", oH-10 +'px');
                        bph.css("width", iW*(oH/iH)+'px');
                    }

                    bph.css('left', $(window).scrollLeft() + (oW - parseInt(bph.css("width")))/2);
                    bph.css('top', $(window).scrollTop() + (oH-10 - parseInt(bph.css("height")))/2);

                    zoomed = true;
                }
            }

            function removeBigPhoto(){
                $('.klb-fit-backgrnd').remove();
                $('.klb-fit-container').remove();
                zoomed = false;
            }
        });

    };

})(jQuery);

