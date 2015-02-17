'use strict';

/* Controllers */

angular.module('erpbi-adash')
  .controller('TokenSignin', ['$scope', '$modalInstance', function($scope, $modalInstance) {

	$scope.signin = function () {
	    var formData = {
            email: $scope.email,
            password: $scope.password
        }
		$modalInstance.close(formData);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
  }])
  .controller('TokenSignup', ['$scope', '$modalInstance', function($scope, $modalInstance) {

	$scope.signup = function () {
	    var formData = {
            email: $scope.email,
            password: $scope.password
        }
		$modalInstance.close(formData);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
  }])
