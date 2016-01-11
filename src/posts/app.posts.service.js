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