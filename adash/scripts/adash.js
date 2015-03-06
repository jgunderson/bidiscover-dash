/*
 *
 * Copyright (c) 2015, Jeff Gunderson
 * Refer to included license
 *
 */
'use strict';

var app = angular.module('erpbi-adash', [
  'adf', 'erpbi-model', 'erpbi-token',  
  'sample.widgets.news', 'sample.widgets.randommsg',
  'sample.widgets.weather', 'sample.widgets.markdown',
  'sample.widgets.linklist', 'sample.widgets.github',
  'sample.widgets.version', 'sample.widgets.timeseries', 'LocalStorageModule',
  'structures', 'sample-01', 'sample-02', 'sample-03',
  'ngRoute', 'ngStorage' /* added for signin/out */
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

	//
	// We only have one page but more pages can be added here.  Be carefull losing scope when new page is loaded.
	//
    $routeProvider.
        when('/', {
            //templateUrl: 'adash/partials/dashtabs.html',
            //controller: 'TabsParentController'
            templateUrl: 'adash/partials/partials.html',
            controller: 'PartialsCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
		
    $httpProvider.interceptors.push(['$q', '$rootScope', function($q, $rootScope) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($rootScope.token) {
                        config.headers.Authorization = 'Bearer ' + $rootScope.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        //$location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }
]);

app.controller('PartialsCtrl', function($rootScope){
  if ($rootScope.token) {
	$rootScope.partialurl = 'adash/partials/dashtabs.html';
  }
  else {
  	$rootScope.partialurl = 'adash/partials/welcome.html';
  }
})


app.controller('navigationCtrl', function($scope, $location){

  $scope.navCollapsed = true;

  $scope.toggleNav = function(){
    $scope.navCollapsed = !$scope.navCollapsed;
  };

  $scope.$on('$routeChangeStart', function() {
    $scope.navCollapsed = true;
  });

  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'Sample 01';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };

});

app.controller("TabsParentController", function ($scope, $rootScope, localStorageService, Model) {
 
    var setAllInactive = function() {
        angular.forEach($scope.workspaces, function(workspace) {
            workspace.active = false;
        });
    };
 
    var addNewWorkspace = function() {
	  var name = "Welcome",
	    model = Model.factory(name, $rootScope.myDetails.data.email);

	  $scope.workspaces.push({
		name: name,
		model: model,
		collapsible: false,
		active: true
	  });
		
	  $scope.$on('adfDashboardChanged', function (event, name, model) {
	  
	    //
		// Store the model updated.  We get the object id back which we must
		// set in a new workspace.  It must in the model so the id can be used
		// by saveModel in the server.
		//
		var atStoreComplete = function(id) {
			var foundIt = false,
			  index;
			for (index = 0; index < $scope.workspaces.length; index++) {
			  if ($scope.workspaces[index].model.id === id) {
				foundIt = true;
			  }
			}
			if (foundIt === false) {
			  for (index = 0; index < $scope.workspaces.length; index++) {
				if ($scope.workspaces[index].model.id === "") {
				  $scope.workspaces[index].model.id = id;
				}
			  }
			}
		}		
        Model.store(model, atStoreComplete);	
      });		
    };
		
	var atFindComplete = function(models) {
	
		//
		// When findModels completes we create workspaces.
		//
	    var index;
	    for (index = 0; index < models.length; ++index) {
			$scope.workspaces.push({
				name: models[index].model.name,
				model: models[index].model,
				collapsible: false,
				active: true
			});			
        }

	};
  
    $scope.workspaces =
    [
    ];
 
    $scope.addWorkspace = function () {
        setAllInactive();
        addNewWorkspace();
    };

	// Populate workspaces with save models.
	Model.findModels($rootScope.myDetails.data.email, atFindComplete);
 
});

app.controller ("TabsChildController", function($scope, $log){
  
});

app.controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Token', '$modal', function($rootScope, $scope, $location, $localStorage, Token, $modal) {
		
        $scope.signinbutton = function() {
			
			var modalInstance = $modal.open({
				templateUrl: 'adash/partials/signin.html',
				controller: 'TokenSignin',
			});
			
			// The controller will call $modalInstance.close() and pass the parameter to result			
			modalInstance.result.then(function (formData) {
				Token.signin(formData, function(res) {
					if (res.type == false) {
						alert(res.data)    
					} else {
						$localStorage.token = res.data.token;
						$rootScope.token = $localStorage.token;
						$rootScope.partialurl = 'adash/partials/dashtabs.html'; 						
						Token.me(function(res) {
							$rootScope.myDetails = res;
							}, function() {
								$rootScope.error = 'Failed to fetch details';
						});												
					}
				}, function() {
					$rootScope.error = 'Failed to signin';
				});		
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};
		
        $scope.signupbutton = function() {
			
			var modalInstance = $modal.open({
				templateUrl: 'adash/partials/signup.html',
				controller: 'TokenSignup',
			});
			
			// The controller will call $modalInstance.close() and pass the parameter to result			
			modalInstance.result.then(function (formData) {
				Token.save(formData, function(res) {
					if (res.type == false) {
						alert(res.data)    
					} else {
						//$localStorage.token = res.data.token;
						//$scope.token = $localStorage.token; 
					}
				}, function() {
					$rootScope.error = 'Failed to signin';
				});				
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};

        $scope.me = function() {
            Token.me(function(res) {
                $rootScope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logoutbutton = function() {
            Token.logout(function() {
			    $rootScope.token = $localStorage.token;
				$rootScope.partialurl = 'adash/partials/welcome.html';
                //window.location = "/"
            }, function() {
                alert("Failed to logout!");
            });
        };
		// If we want to use the localstorage token, persisted across browser starts
        //$scope.token = $localStorage.token;

}]);
