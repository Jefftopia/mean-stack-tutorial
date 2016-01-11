var app = angular.module('flapperNews', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	$stateProvider
    	.state('home', {
      		url: '/home',
      		templateUrl: '/home.html',
      		controller: 'MainController',
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
    	})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsController',
			resolve: {
				postPromise: ['$stateParams', 'posts', function($stateParams, posts) {
					return posts.get($stateParams.id);
				}]
			}
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthController',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthController',
			onEnter: ['$state', 'auth', function($state, auth) {
				
				console.log('login route', auth);
				
				if (auth.isLoggedIn())
					$state.go('home');
			}]
		});

  $urlRouterProvider.otherwise('home');
  
}]);

app.controller('PostsController', [
	'$scope',
	'posts',
	'post',
	'auth',
	function($scope,posts,post,auth) {
		
		$scope.post = post;
		
		$scope.isLoggedIn = auth.isLoggedIn;
		
		$scope.addComment = function() {
			
		if ($scope.body === '')
			return;
			
			posts.addComment(post._id, {
				body: $scope.body,
				author: 'user'
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
			
			$scope.body = '';
			
		}
		
		$scope.incrementUpvotes = function(comment) {
			
			posts.upvoteComment(post,comment);
			
		};
				
	}
])

app.controller('MainController', [
	'$scope',
	'posts',
	'auth',
	function($scope,posts,auth) {
		
		$scope.isLoggedIn = auth.isLoggedIn;
		
		$scope.posts = posts.posts;
		
		$scope.addPost = function() {
				
			if (!$scope.title || $scope.title == '')
				return;
			
			posts.create({
				title: $scope.title,
				link: $scope.link
			});
			
			$scope.title = '';

			$scope.link = '';
				
		};		
		
		$scope.incrementUpvotes = function(post) {
			
			posts.upvote(post);
			
		};
		
	}
	
]);

app.factory('posts', 'auth', ['$http', 'auth', function($http, auth) {
	
	var o = {
		
		posts: [],
		
	};

	o.getAll = function() {
			
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
			
	}
	
	o.create = function(post) {
		
		return $http.post('/posts', post, {
			headers: { Authorization: 'Bearer' + auth.getToken() }
		}).success(function(data) {
			o.posts.push(data);
		});
		
	}
	
	o.upvote = function(post) {
		
		return $http.put('/posts/' + post.id + '/upvote', null, {
			headers: { Authorization: 'Bearer' + auth.getToken() }
		}).success(function(data) {
			post.upvote += 1;
		});
		
	}
	
	o.get = function(id) {
		
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
		
	}
	
	o.addComment = function(id, comment) {
		
		return $http.post('/posts/' + id + '/comments', comment, {
			headers: { Authorization: 'Bearer' + auth.getToken() }
		});
		
	};
	
	o.upvoteComment = function(post, comment) {
		
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
			headers: { Authorization: 'Bearer' + auth.getToken() }
		})
		.success(function(data) {
			comment.upvotes += 1;
		});
		
	}

	
	return o;
	
}]);

app.factory('auth', ['$window', '$http', function($window,$http) {
	
	var auth = {};
	
	auth.saveToken = function(token) {
		$window.localStorage['flapper-news-token'] = token;	
	};
	
	auth.getToken = function() {
		
		return $window.localStorage['flapper-news-token'];
		
	};
	
	auth.isLoggedIn = function() {
	
		console.log('auth.isLoggedIn');
	
		var token = auth.getToken();
		
		if(token) {

			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			return payload.exp > Date.now() / 1000;
			
		} else {
			
			return false;
			
		}
		
	};
	
	auth.currentUser = function() {

		console.log('auth.currentuser');
		
		if (auth.isLoggedIn()) {
			
			var token = auth.getToken();
			
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			return payload.username;
			
		}	
		
	};
	
	auth.register = function(user) {
		
		console.log(user, 'auth.register');
		
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
		
	};
	
	auth.login = function(user) {
		
		console.log(user, 'auth.login');
		
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
		
	};
	
	auth.logOut = function() {
		
		return $window.localStorage.removeItem('flapper-news-token');
		
	} 
	
	return auth;
	
}]);

app.controller('AuthController', ['$scope','$state','auth', function($scope,$state,auth) {
	
	console.log('AuthController', auth);
	
	$scope.user = {};
	
	$scope.register = function() {
	
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
		
	};
	
	$scope.login = function() {
	
		auth.login($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		})
		
	};
	
}]);

app.controller('NavController', ['$scope', 'auth', function($scope,auth){
	
	console.log('NavController', auth);
	
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
	
}]);