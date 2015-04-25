/*
 * The MIT License
 * 
 * Copyright (c) 2013, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.timeseries', ['adf.provider', 'erpbi-mdx', 'erpbi-schema', 'erpbi-query'])
  .value('weatherServiceUrl', 'http://api.openweathermap.org/data/2.5/weather?units=metric&callback=JSON_CALLBACK&q=')
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('timeseries', {
        title: 'Time Series',
        description: 'Time Series Chart',
        templateUrl: 'adash/scripts/widgets/timeseries/timeseries.html',
        controller: 'chartCtrl',
        reload: true,
        resolve: {
          serviceResult: function(chartService, config){
            if (config.subject && config.cube && config.measure){
			  return chartService.get(config);
            }
          }
        },
        edit: {
          templateUrl: 'adash/scripts/widgets/timeseries/edit.html'
		  // see linklist edit controller for controller example
        }
      });
  })
  .service('chartService', function($q, $http, Mdx, Query){
    return {
      get: function(config){
        var deferred = $q.defer();
		var executeComplete = function(collections) {
		  deferred.resolve({ collections: collections, config: config}); //OK
		  //deferred.reject();      //not OK
		};
		var templatesObj = Query.getTemplates("timeseries");
		var query = Query.jsonToMDX(templatesObj[0], "SOByPeriod", "Days, Order to Delivery", "Fiscal Period.Fiscal Period CL", "2015", "3", []);
		// "WITH  MEMBER [Measures].[KPI] AS IIf(IsEmpty([Measures].[Days, Order to Delivery]), 0.000, [Measures].[Days, Order to Delivery]) MEMBER Measures.[prevKPI] AS ([Measures].[Days, Order to Delivery] , ParallelPeriod([Fiscal Period.Fiscal Period CL].[2015])) MEMBER [Measures].[prevYearKPI] AS iif(Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI]) SELECT NON EMPTY {[Measures].[KPI], [Measures].[prevYearKPI]} ON COLUMNS, NON EMPTY {LastPeriods(12, [Fiscal Period.Fiscal Period CL].[2015].[3])} ON ROWS FROM SOByPeriod"
		var templates = [
			{query: query}
			];
		// use the config.cube, measure, filters to update query
		Mdx.execute(templates, executeComplete);
		return deferred.promise;
      }
    };
  })
  .controller('chartCtrl', function($scope, serviceResult, Schema){
  
	var processedData =[];
  
    function processData(collections, config) {
      var processedData = [];
      var collection = collections[0].result;
	  var yearDim = Schema.getDimensionTime(config.subject, config.cube).year + ".[MEMBER_CAPTION]";
	  var periodDim = Schema.getDimensionTime(config.subject, config.cube).month + ".[MEMBER_CAPTION]";
	  //var measure = Schema.getMeasureName(config.subject, config.cube, config.measure);
      
      if (collection.data.length > 0) {
      
        // Construct the values using the 
        // *  concatenation of dimensions for the Period
        // *  measure value as Measure
        // *  measure name as MeasureYear
        // Set chart title
        var values = [],
          year = "",
          period = "";
        for (var i = 0; i < collection.data.length; i++) {
          period = collection.data[i][periodDim];
          period = Number(period) < 10 ? "0" + period : period;
          year = collection.data[i][yearDim];
          var entry = { "Period" : year + '-' + period,
                        "Measure" : collection.data[i]["[Measures].[KPI]"],
                        "Measure Name" : ("%" +  config.measure).toLocaleString()};
          values.push(entry);
          entry = { "Period" : year + '-' + period,
                    "Measure" : collection.data[i]["[Measures].[prevYearKPI]"],
                    "Measure Name" : "%previousYear".toLocaleString()};
          values.push(entry);
        }
        processedData.push({ values: values, measures: [ ("%" +  config.measure).toLocaleString(), "Previous Year"]});
      }
      //this.$.chartTitle.setContent(this.makeTitle()); // Set the chart title
      //this.$.chartSubTitle.setContent(this.getChartSubTitle()); // Set the chart sub title
      //this.setProcessedData(formattedData); // This will drive processDataChanged which will call plot
	  return processedData;
    }
	
	function plot(type, processedData) {
	
	  function chartType(type) {
        switch (type) {
        case "barChart":
          return dimple.plot.bar;
        case "bubbleChart":
          return dimple.plot.bubble;
        case "lineChart":
          return dimple.plot.line;
        case "areaChart":
          return dimple.plot.area;
        }
      }

      if (processedData.length > 0) {
    	//
    	// Chart width and height the size of #chartContainer
    	var chartElem = angular.element(document.querySelector("#chartContainer")),
          chartWidth = chartElem[0].offsetWidth,
          chartHeight = chartWidth/2;
    	
        //
        // Make dimple chart in svg area
        
        var svg = dimple.newSvg("#chartContainer", chartWidth, chartHeight),
          myChart = new dimple.chart(svg, processedData[0].values);
        //myChart.setBounds(60, 30, this.getPlotWidth(), this.getPlotHeight());
        //
        // Define chart axis
        //
        var x = myChart.addCategoryAxis("x", ["Period", "Measure Name"]),
          y = myChart.addMeasureAxis("y", "Measure");
        //
        // Create dimple series based on type
        //
        var chart = chartType(type),
          series = myChart.addSeries("Measure Name", chart),
          legend = myChart.addLegend(65, 10, 400, 20, "center", series);
        x.addOrderRule("Period");  // order by periods (needed by firefox)
        //
        // draw chart
        //
        myChart.draw();
        //
        // after chart is drawn, use d3 to change axis text colors
        //
        x.shapes.selectAll("text").attr("fill", "#000000");
        //x.titleShape.text("Days");
        x.titleShape.attr("fill", "#000000");
        y.shapes.selectAll("text").attr("fill", "#000000");
        //y.titleShape.text("Measure");
        y.titleShape.attr("fill", "#000000");
        legend.shapes.selectAll("text").attr("fill", "#000000");
        
        //series.shapes.selectAll("rect").on("click", function (bar, index) {
        //  var newbar = bar;
        //});
        //d3.select("#" + divId).selectAll("rect").on("click", function (bar, index) {
        //  that.clickDrill(undefined, bar);
        //});
        //d3.select("#" + divId).selectAll("circle").on("click", function (circle, index) {
        //  that.clickDrill(undefined, circle);
        //});
      }
    }
	
	$scope.config.subject = "fullfillment";
	$scope.config.cube = "SOByPeriod";
	$scope.config.measure = "daysBookingToShipment";	
	
	if (serviceResult && serviceResult.collections) {
	  $scope.chartReady = true;
	  processedData = processData(serviceResult.collections, serviceResult.config);
	  plot("barChart", processedData);
	}

    //$scope.collections = collections;
  });