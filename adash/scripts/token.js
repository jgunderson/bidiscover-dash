'use strict';

angular.module('erpbi-token', [])
    .factory('Token', ['$http', '$localStorage', '$location', function($http, $localStorage, $location){

		//
		// Sometimes there is /#/ and sometimes a / at the end of the URL to strip off	
		//
		var theUrl = $location.absUrl().replace("/#/", ""),
		  baseUrl;
		if (theUrl.substring(theUrl.length - 1, theUrl.length) == "/") {
		  baseUrl = theUrl.substring(0, theUrl.length - 1)
		  }
		else {
		  baseUrl = theUrl;
		}

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            signin: function(data, success, error) {
			    console.log("used is: " + baseUrl);
                $http.post(baseUrl + '/authenticate', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);