'use strict';

angular.module('erpbi-chart-dir', [])
    .service('Chart-dir', function(){
		this.charts = [
			{
				name: "timeseries",
				subjects: [
					{ name: "crm", title: "Customer Relationship Management", schema: "crm"},
					{ name: "sales", title: "Sales", schema: "sales"},
					{ name: "delivery", title: "Delivery & Profitability", schema: "delivery"},
					{ name: "financial", title: "Financials", schema: "financial"},
				],
				query: "timeseries"
			},
			{
				name: "toplist",
				subjects: [
					{ name: "crm", title: "Customer Relationship Management", schema: "crm"},
					{ name: "sales", title: "Sales", schema: "sales"},
					{ name: "delivery", title: "Delivery & Profitability", schema: "delivery"},
					{ name: "financial", title: "Financials", schema: "financial"},
				],
				query: "topdims"
			},
			{
				name: "salesfunnel",
				subjects: [
					{ name: "crmsalesfunnel", title: "Sales Funnel", schema: "crmsalesfunnel"},
				]
			},
			{
				name: "oppfunnel",
				subjects: [
					{ name: "oppfunnel", title: "Opportunity Funnel", schema: "oppfunnel"},
				]
			},
        ];
		
		this.getSubjects = function(chart) {
			  var subjects = [];
				chartDetail = {};
			  _.each(this.charts, function (item) {
				if (item.name === chart) {
				  chartDetail = item;
				}
			  });
			  return chartDetail.subjects;
		};	
    }
);