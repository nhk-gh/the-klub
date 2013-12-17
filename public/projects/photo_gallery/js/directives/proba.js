theKlubApp.directive('file', function($log){
    return {
        restrict:"A",
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                /*$log.warn(file);
                $log.warn(scope.file);
                */

                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                /*
                $log.warn(file);
                $log.warn(scope.file);
                 */
                scope.$apply();
            });
        }
    };
});