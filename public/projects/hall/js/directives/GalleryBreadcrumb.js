/**
 * Created by nhk on 8/11/14.
 */

theKlubApp.directive('galleryBreadcrumb', function ($log, $rootScope) {
  return {
    restrict: "EA",

    link: function(scope, element) {
      var href2gallery;

      $rootScope.$on('BREADCRUMB_EVT', function(evt, params){

        var crumbs = element.find('li');

        if (params === null){
          crumbs[0].children[0].removeAttribute('href');
          $(crumbs[0].children[0]).css('color', '#afeeee');
          $(crumbs[1]).attr('style','display:none');
          $(crumbs[2]).attr('style','display:none');
        }
        else {
          $(crumbs[0].children[0]).attr('href','/gallery');
          $(crumbs[0].children[0]).css('color', 'white');

          switch (params.type){
            case 'thumb':
              $(crumbs[1]).attr('style','display:inline-block');
              crumbs[1].children[0].removeAttribute('href');
              $(crumbs[1].children[0]).css('color', '#afeeee');
              $(crumbs[2]).attr('style','display:none');

              scope.gallery = params.param.gallery;

              href2gallery = '/genre?selectionMode=' + params.param.selectionMode +
                '&genre=' + params.param.genre + '&gallery=' + params.param.gallery;

              break;

            case 'single':
              $(crumbs[1]).attr('style','display:inline-block');
              $(crumbs[1].children[0]).attr('href', href2gallery);
              $(crumbs[1].children[0]).css('color', 'white');
              $(crumbs[2]).attr('style','display:inline-block');
              $(crumbs[2].children[0]).attr('href', '/genre?selectionMode=author&gallery=' + params.param.authorname);

              scope.photo = params.param.photoname
              scope.author = params.param.authorname;

              break;

            case 'addphoto':
              $(crumbs[1]).attr('style','display:none');
              $(crumbs[2]).attr('style','display:none');

              break;
          }
        }
      });
    }
  }
});


