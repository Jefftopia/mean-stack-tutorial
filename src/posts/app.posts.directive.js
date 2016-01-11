(function(){
    'use strict';
    
    angular.module('app')
        .directive('postsDirective', postsDirective);
        
    function postsDirective() {
        
        var directive = {
            //use link for ng-DOM manipulation services
            link: linkFunc,
            //use default is EA in ng-1.4
            restrict: 'EA',
            templateUrl: '/html/app.posts.directive.html',
            //not sure about scope yet
            scope: {
               max: '='
            },
            controller: 'PostsController',
            controllerAs: 'vm',
            //use bind for isolated scopes
            bindToController: true
        }
        
        return directive;
        
        function linkFunc(scope, el, attr, ctrl) {
            console.log('LINK: scope.min = %s *** should be undefined', scope.min);
            console.log('LINK: scope.max = %s *** should be undefined', scope.max);
            console.log('LINK: scope.vm.min = %s', scope.vm.min);
            console.log('LINK: scope.vm.max = %s', scope.vm.max);
        }
        
    }
    
    console.log('posts-directive');
    
})();