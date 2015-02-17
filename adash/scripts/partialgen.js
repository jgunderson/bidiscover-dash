/*
 *
 * Copyright (c) 2015, Jeff Gunderson
 * Refer to included license
 *
 */
'use strict';

angular.module('erpbi-partialgen', [])

  .service('PartialGen', function() {
		
    this.getDashtabs = function() {
      return	  
	  	'<div ng-controller="TabsParentController">' +
		'<tabset>' +
			'<tab ng-repeat="workspace in workspaces"' +
				 'heading="{{workspace.name}}"' +
				 'active=workspace.active>' +
				'<div ng-controller="TabsChildController">' +
					'<div class="container">' +
					   '<adf-dashboard name="{{ $parent.workspace.name}}" collapsible="{{$parent.workspace.collapsible}}" structure="4-8" adf-model="$parent.workspace.model" />' + 
					'</div>' +
				'</div>' +     
			'</tab>' +
			'<tab select="addWorkspace()">' +
				'<tab-heading>' +
					'<i class="icon-plus-sign"></i>' +
				'</tab-heading>' +
			'</tab>' +
		'</tabset>' +
	'	</div>';  
    }	
	
  });
