'use strict';

angular.module('erpbi-mdx', [])
    .service('Mdx', function($location){
		var baseUrl = $location.absUrl(),
		  i = baseUrl.lastIndexOf(":"),
		  // substitute mdx port - todo: generalized port number
		  mdxUrl = baseUrl.substring(0, i - 1) + ":8124?format=application/json&mdx=";  

		this.execute = function(templates, callBack) {
		  var collections = [];
		  
          _.each(templates, function () {
            this.collections.push({queryComplete: false, result: ""});
          });		  
		  
		  _.each(templates, function(template, index){

			$http.get(baseUrl + template).
			  success(function(data, status, headers, config) {
                var allComplete = true;
				collections[index].queryComplete = true;
				collections[index].result = data;
                _.each(collections, function (coll) {
                  allComplete = allComplete && coll.queryComplete();
                });
                if (allComplete) {
				  callBack(collections);
                }
			  }).
			  error(function(data, status, headers, config) {
				$rootScope.error = 'Failed to signin';
				$log.info('mdx query failed: ' + status);
			  });
		  });	  

		};	
    }
);