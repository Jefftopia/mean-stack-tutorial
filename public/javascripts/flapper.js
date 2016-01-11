/*
(function() {
    'use strict';
    
    angular.module('app.core', []);
    
    console.log(angular.module('app.core'));
    
})();
*/
(function() {
   'use strict';
   
   angular.module('app', [

    ]);
    
    console.log(angular.module('app'));
     
})();
(function() {
    'use strict';

    console.log('controller');
    
    angular.module('app')
        .controller('PostsController', PostsController);
    
    PostsController.$inject = ['postService'];
    
    function PostsController(postService) {
        
        console.log(postService);
        
        var vm = this;
        vm.posts = postService.posts;
        vm.min = postService.min;
        vm.max = postService.max;
        vm.addPost = postService.createPost;
        vm.random = 'Random text';
        
    }
    
    console.log('posts-controller');

})();
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
(function() {
   'use strict';
   
   angular.module('app')
        .factory('postService', postService);
    
    function postService() {
        
        var _posts = [{
            title: 'Harry Potter',
            body: 'Some text here'
        }];
        
        var _min = 0;
        var _max = 100;
        
        var service = {
            posts: _posts,
            min: _min,
            max: _max,
            createPost: createPost
        }
        
        return service;
        
        function createPost() {
            
            _posts.push({ title: 'test title', body: 'test body' });
            
        }
        
    }
    
    console.log('posts-service');
    
})();