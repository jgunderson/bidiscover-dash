'use strict';

angular.module('erpbi-chart-dir', ["erpbi-schema"])
    .service('ChartDir', function(Schema){
		this.charts = [
			{
				name: "timeseries",
				subjects: [
					{ name: "crm", title: "Customer Relationship Management", schema: "crm"},
					{ name: "sales", title: "Sales", schema: "sales"},
					{ name: "fullfillment", title: "Fullfillment & Profitability", schema: "fullfillment"},
				],
				query: "timeseries"
			},
			{
				name: "toplist",
				subjects: [
					{ name: "crm", title: "Customer Relationship Management", schema: "crm"},
					{ name: "sales", title: "Sales", schema: "sales"},
					{ name: "fullfillment", title: "Fullfillment & Profitability", schema: "fullfillment"},
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
			  var subjects = [],
				chartDetail = {};
			  _.each(this.charts, function (item) {
				if (item.name === chart) {
				  chartDetail = item;
				}
			  });
			  _.each(chartDetail.subjects, function (item) {
				subjects.push( {value: item.name, text: ("%" + item.name).toLocaleString()});
			  });
			  return subjects;
		};

		this.getQuery = function(chart) {
			  var query;
			  _.each(this.charts, function (item) {
				if (item.name === chart) {
				  query = item.query;
				}
			  });
			  return query;
		};		
    }
);