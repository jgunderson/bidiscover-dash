'use strict';

angular.module('erpbi-schema', [])
    .service('Schema', function(){
 
    /*
     * Get measures for this cube.
     */
    this.getMeasures = function (schema, cube) {
      var measures = [],
	    schemaObj = {},
        cubeSchema = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.measures, function (item) {
        measures.push(item.title);
		measures.push( {value: item.name, text: ("%" + item.title).toLocaleString()});
      });
      return measures;
    },
    /*
     *  Get measure name for measure title in a cube.
     */
    this.getMeasureName = function (schema, cube, title) {
      var measure = "",
	    schemaObj = {},
        cubeSchema = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.measures, function (item) {
        if (item.title === title) {
          measure = item.name;
        }
      });
      return measure;
    },
    /*
     *  Get measure title for measure name in a cube.
     */
    this.getMeasureTitle = function (schema, cube, name) {
      var measure = "",
	    schemaObj = {},
        cubeSchema = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.measures, function (item) {
        if (item.name === name) {
          measure = item.title;
        }
      });
      return measure;
    },
    /*
     * Get dimensions for this cube.
     */
    this.getDimensions = function (schema, cube) {
      var dimensions = [],
	    schemaObj = {},
        cubeSchema = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.dimensions, function (item) {
        dimensions.push(item.title);
      });
      return dimensions;
    },
    /*
     *  Get dimension name property for dimension title in a cube.
     */
    this.getDimensionNameProp = function (schema, cube, title) {
      var dimension = "";		
	    schemaObj = {},
        cubeSchema = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.dimensions, function (item) {
        if (item.title === title) {
          dimension = item.nameProperty;
        }
      });
      return dimension;
    },
    /*
     *  Get dimension code hierarchy for dimension title in a cube.
     */
    this.getDimensionHier = function (schema, cube, title) {
      var cubeSchema = {},
        dimHier = "",		
	    schemaObj = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      _.each(cubeSchema.dimensions, function (item) {
        if (item.title === title) {
          dimHier = item.codeHier;
        }
      });
      return dimHier;
    },
    /*
     *  Get time dimension for this cube.
     */
    this.getDimensionTime = function (schema, cube) {
      var cubeSchema = {},	  
	    schemaObj = {};
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
        if (item.name === cube) {
          cubeSchema = item;
        }
      });
      return cubeSchema.timeDimension;
    }
	
    /*
     *  Get schemas.
     */
    this.getSchemas = function () {
      var theSchemas = [];
      _.each(this.schemas, function (item) {
		theSchemas.push( {value: item.name, text: ("%" + item.name).toLocaleString()});
      });
      return theSchemas;
    }
	
    /*
     *  Get cubes.
     */
    this.getCubes = function (schema) {
      var theCubes = [],
	    schemaObj;
      _.each(this.schemas, function (item) {
        if (item.name === schema) {
          schemaObj = item;
        }
      });
      _.each(schemaObj.cubes, function (item) {
		theCubes.push( {value: item.name, text: ("%" + item.name).toLocaleString()});
      });
      return theCubes;
    }

  this.schemas = [
    {  name: "crm",
       cubes: [
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amountOpportunity", name: "Amount, Opportunity Gross"},
                     {title: "countOpportunities", name: "Count, Opportunities"},
                     {title: "percentProbabilityOpportunity", name: "Percent, Probability Opportunity"},
                     {title: "amountOpportunityWeighted", name: "Amount, Opportunity Weighted"},
                     {title: "averageOpportunity", name: "Average, Opportunity Gross"},
                     {title: "averageOpportunityWeighted", name: "Average, Opportunity Weighted"},
                     {title: "daysStartToAssigned", name: "Days, Start to Assigned"},
                     {title: "daysStartToTarget", name: "Days, Start to Target"},
                     {title: "daysStartToActual", name: "Days, Start to Actual"}],
          dimensions: [{title: "account", name: "CRM Account", nameProperty: "CRM Account Name", codeHier: "[CRM Account.CRM Accounts by Code].[CRM Account Code]"},
                     {title: "user", name: "User", nameProperty: "User Name", codeHier: "[User.Users by Code].[User Code]"},
                     {title: "opportunity", name: "Opportunity", nameProperty: "Opportunity Name", codeHier: "[Opportunity].[Opportunity]"}],
          timeDimension: {name: "Issue Date.Calendar", year: "[Issue Date.Calendar Months].[Year]", month: "[Issue Date.Calendar Months].[Month]"}
        },
        {name: "CRQuote", //Quote
          measures: [{title: "amountQuote", name: "Amount, Quote Gross"},
                     {title: "countQuotes", name: "Count, Quotes"},
                     {title: "amountQuoteDiscount", name: "Amount, Quote Discount"},
                     {title: "averageQuote", name: "Average, Quote Gross"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code].[Account Rep Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code].[Product Code]"},
                     {title: "quote", name: "Quote", nameProperty: "Quote Name", codeHier: "[Quote]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region].[Region Code]"}],
          timeDimension: {name: "Issue Date.Calendar", year: "[Issue Date.Calendar Months].[Year]", month: "[Issue Date.Calendar Months].[Month]"}
        },
        {name: "CROpportunityAndOrder",
          measures: [{title: "ratioConversion", name: "Ratio, Conversion"},
                     {title: "ratioConversionWeighted", name: "Ratio, Conversion Weighted"}],
          dimensions: [],
          timeDimension: {name: "Issue Date.Calendar", year: "[Issue Date.Calendar Months].[Year]", month: "[Issue Date.Calendar Months].[Month]"}
        },
        {name: "CROpportunityForecast",  //OpportunityForecast
          measures: [{title: "amountOpportunityForecast", name: "Amount, Opportunity Forecast"},
                     {title: "amountOpportunityForecastWeighted", name: "Amount, Forecast Weighted"},
                     {title: "percentOpportunityForecastProbability", name: "Percent, Forecast Probability"},
                     {title: "countForecastOpportunities", name: "Count, Opportunities"}],
          dimensions: [],
          timeDimension: {name: "Period.Fiscal Period CL", year: "[Fiscal Period.Fiscal Period CL].[Fiscal Year]", month: "[Fiscal Period.Fiscal Period CL].[Fiscal Period]"}
        },
      ],
    },
	
    {
	  name: "crmsalesfunnel",
	  cubes: [
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amountOpportunity", name: "Amount, Opportunity Gross"},
                     {title: "countOpportunities", name: "Count, Opportunities"},
                     {title: "amountOpportunityWeighted", name: "Amount, Opportunity Weighted"},
                     {title: "averageOpportunity", name: "Average, Opportunity Gross"},
                     {title: "averageOpportunityWeighted", name: "Average, Opportunity Weighted"}],
          dimensions: [{title: "account", name: "CRM Account", nameProperty: "CRM Account Name", codeHier: "[CRM Account.CRM Accounts by Code].[CRM Account Code]"},
                     {title: "user", name: "User", nameProperty: "User Name", codeHier: "[User.Users by Code].[User Code]"},
                     {title: "opportunity", name: "Opportunity", nameProperty: "Opportunity Name", codeHier: "[Opportunity].[Opportunity]"}],
        },
      ],
    },
  
    {
	  name: "crmoppfunnel",
	    cubes: [
        {name: "SOOrder", //Booking
          measures: [{title: "amount", name: "Amount, Order Gross"},
                     {title: "count", name: "Count, Orders"},
                     {title: "average", name: "Average, Order Gross"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code].[Product Code]"},
                     {title: "booking", name: "Order", nameProperty: "Order Name", codeHier: "[Order].[Order]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region", codeHier: "[Bill City.Bill Region].[Region Code]"}],
        },
        {name: "CROpportunity",  //Opportunity
          measures: [{title: "amount", name: "Amount, Opportunity Gross"},
                     {title: "count", name: "Count, Opportunities"},
                     {title: "average", name: "Average, Opportunity Gross"}],
          dimensions: [{title: "account", name: "CRM Account", nameProperty: "CRM Account Name", codeHier: "[CRM Account.CRM Accounts by Code].[CRM Account Code]"},
                     {title: "user", name: "User", nameProperty: "User Name", codeHier: "[User.Users by Code].[User Code]"},
                     {title: "opportunity", name: "Opportunity", nameProperty: "Opportunity Name", codeHier: "[Opportunity].[Opportunity]"}],
        },
        {name: "CRQuote", //Quote
          measures: [{title: "amount", name: "Amount, Quote Gross"},
                     {title: "count", name: "Count, Quotes"},
                     {title: "average", name: "Average, Quote Gross"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code].[Product Code]"},
                     {title: "quote", name: "Quote", nameProperty: "Quote Name", codeHier: "[Quote]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Ship Region", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Ship Region", codeHier: "[Bill City.Bill Region].[Region Code]"}],
        },
	  ]
	},
		
    {
	  name: "sales",		
		cubes: [
        {name: "SOOrder", //Booking
          measures: [{title: "amountBooking", name: "Amount, Order Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "amountBookingDiscount", name: "Amount, Order Discount"},
                     {title: "averageBooking", name: "Average, Order Gross"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code].[Account Rep Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code].[Product Code]"},
                     {title: "booking", name: "Order", nameProperty: "Order Name", codeHier: "[Order].[Order]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region].[Region Code]"}],
          timeDimension: {name: "Issue Date.Calendar", year: "[Issue Date.Calendar Months].[Year]", month: "[Issue Date.Calendar Months].[Month]"}
        },
      ]
	},
	
    {
	  name: "fullfillment",		
		cubes: [
        {name: "SOByPeriod",  //Backlog
          measures: [{title: "balanceBacklog", name: "Balance, Orders Unfulfilled"},
                     {title: "daysBookingToShipment", name: "Days, Order to Delivery"},
                     {title: "interestB2SImpact", name: "Interest, O2D Impact"},
                     {title: "countBacklog", name: "Count, Orders"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code].[Account Rep Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "booking", name: "Order", nameProperty: "Order Name", codeHier: "[Order].[Order]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region].[Region Code]"}],
          timeDimension: {name: "Fiscal Period.Fiscal Period CL", year: "[Fiscal Period.Fiscal Period CL].[Fiscal Year]", month: "[Fiscal Period.Fiscal Period CL].[Fiscal Period]"},
        },
        
        {name: "SODelivery", //Shipment
          measures: [{title: "amountShipment", name: "Amount, Delivery Gross"},
                     {title: "amountCost", name: "Amount, Cost Gross"},
                     {title: "countBookings", name: "Count, Orders"},
                     {title: "countShipments", name: "Count, Deliveries"},
                     {title: "amountProfit", name: "Amount, Profit Gross"},
                     {title: "amountShipmentDiscount", name: "Amount, Delivery Discount"},
                     {title: "percentageMargin", name: "Percentage, Gross Margin"}],
          dimensions: [{title: "salesRep", name: "Account Rep", nameProperty: "Account Rep Name", codeHier: "[Account Rep.Account Reps by Code].[Account Rep Code]"},
                     {title: "customer", name: "Customer", nameProperty: "Customer Name", codeHier: "[Customer.Customer Code].[Customer Code]"},
                     {title: "item", name: "Product", nameProperty: "Product Name", codeHier: "[Product.Product Code].[Product Code]"},
                     {title: "shipment", name: "Delivery", nameProperty: "Delivery Name", codeHier: "[Delivery].[Delivery]"},
                     {title: "productCategory", name: "Product.Products by Category by Code", nameProperty: "Category Name", codeHier: "[Product.Products by Category by Code].[Category]"},
                     {title: "classCode", name: "Product.Products by Class by Code", nameProperty: "Class Name", codeHier: "[Product.Products by Class by Code].[Class]"},
                     {title: "itemType", name: "Product.Products by Type by Code", nameProperty: "Type Name", codeHier: "[Product.Products by Type by Code].[Type]"},
                     {title: "shipRegion", name: "Ship City", nameProperty: "Region Name", codeHier: "[Ship City.Ship Region].[Region Code]"},
                     {title: "billRegion", name: "Bill City", nameProperty: "Region Name", codeHier: "[Bill City.Bill Region].[Region Code]"}],
          timeDimension: {name: "Delivery Date.Calendar", year: "[Delivery Date.Calendar Months].[Year]", month: "[Delivery Date.Calendar Months].[Month]"}
        },
      ]
	}
	
  ];
  
});