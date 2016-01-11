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