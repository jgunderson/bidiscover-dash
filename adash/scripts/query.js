'use strict';

angular.module('erpbi-query', [])
    .service('Query', function(){
		this.queries = [		
		    { name: "timeseries",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[KPI]",
					   value: "IIf(IsEmpty([Measures].[$measure]), 0.000, [Measures].[$measure])"
					},
					{name: "Measures.[prevKPI]",
					   value: "([Measures].[$measure] , ParallelPeriod([$dimensionTime].[$year]))"
					},
					{name: "[Measures].[prevYearKPI]",
					   value: "iif (Measures.[prevKPI] = 0 or Measures.[prevKPI] = NULL or IsEmpty(Measures.[prevKPI]), 0.000, Measures.[prevKPI])"
					},
				  ],
				  columns: [
					"[Measures].[KPI]",
					"[Measures].[prevYearKPI]"
				  ],
				  rows: [
					"LastPeriods(12, [$dimensionTime].[$year].[$month])"
				  ],
				  cube: "$cube",
				  where: []
			    }
			  ]
			},
		  /*
		   *   Top list query.
		   *
		   *   Note we are given a dimension's level, but we want the children, so we
		   *   go back up to the hierarchy and then get the children.
		   *   
		   *   Todo:  Mondrian has trouble ordering with count measures, like "Days, Start to Actual".
		   *   So we sort in processData as the list is small.  Try this out in later releases of Mondrian:
		   *   "ORDER({filter(TopCount($dimensionHier.Hierarchy.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0) }, [Measures].[THESUM], DESC)
		   */
		    { name: "topdims",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[NAME]",
					   value: '$dimensionHier.CurrentMember.Properties("$dimensionNameProp")'
					},
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [$dimensionTime].[$year].[$month])},  [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
					"[Measures].[NAME]"
				  ],
				  rows: [
					"{filter(TopCount($dimensionHier.Hierarchy.Children, 50, [Measures].[THESUM]),[Measures].[THESUM]>0)}"
				  ],
				  cube: "$cube",
				  where: []
			    }
			  ]
			},

		    { name: "sumperiods",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity].[All Opportunities]})"
				  ],
				  cube: "$cube",
				  where: []
			    }
			  ]
			},
			
		    { name: "oppfunnel",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity].[All Opportunities]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			    {
				  members: [
				  {name: "[Measures].[THESUM]",
					 value: "SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Assigned Date.Calendar].[$year].[$month])}), " +
					" [Measures].[$measure]) "
				    },
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity].[All Opportunities]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			    {
				  members: [
				  {name: "[Measures].[THESUM]",
					 value: "SUM(CROSSJOIN({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])},{LASTPERIODS(12,[Target Date.Calendar].[$year].[$month])}), " +
					" [Measures].[$measure]) "
				    },
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity].[All Opportunities]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity.Opportunity by Status by Type].[Won]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			  ]
			},
			
		    { name: "salesfunnel",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Opportunity].[All Opportunities]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
				    "Hierarchize({[Opportunity.Opportunity by Status by Type].[Won]})"
				  ],
				  cube: "CROpportunity",
				  where: []
			    },
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Quote].[All Quotes]})"
				  ],
				  cube: "CRQuote",
				  where: []
			    },
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
				    "Hierarchize({[Quote.Quote by Status].[Converted]})"
				  ],
				  cube: "CRQuote",
				  where: []
			    },
			    {
				  members: [
					{name: "[Measures].[THESUM]",
					   value: "SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])"
					},
				  ],
				  columns: [
					"[Measures].[THESUM]",
				  ],
				  rows: [
					"Hierarchize({[Order].[All Orders]})"
				  ],
				  cube: "SOOrder",
				  where: []
			    },
			  ]
			},
			
		  /*
		   * Map Query.
		   *
		   * Note that cross joins of large dimensions like dimensionGeo are performance problems.  Check that all
		   * cross join options in mondrian.properties are set.  Make sure heap space is sufficient in start_bi.sh
		   * A cross joins of members performs well, but a cross join of children does not (mondrian bug?).
		   * "CrossJoin($dimensionHier.Children, $dimensionGeo.Members)" - bad
		   * "CrossJoin($dimensionHier.Members, $dimensionGeo.Members)" - good
		   * All queries should be written as using members.
		   */
		    { name: "mapPeriods",
			  templates: [
			    {
				  members: [
					{name: "[Measures].[TheSum]",
					   value: 'SUM({LASTPERIODS(12, [Issue Date.Calendar].[$year].[$month])}, [Measures].[$measure])'
					},
					{name: "[Measures].[Longitude]",
					   value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Longitude"))'
					},
					{name: "[Measures].[Latitude]",
					   value: 'iif ([Measures].[TheSum] is empty, null, $dimensionGeo.CurrentMember.Properties("Latitude"))'
					},
				  ],
				  columns: [
					"[Measures].[Latitude]", "[Measures].[Longitude]", "[Measures].[TheSum]",
				  ],
				  rows: [
					"CrossJoin($dimensionGeo.Members, $dimensionHier.Members)"
				  ],
				  cube: "",
				  where: []
			    }
			  ]
			},

        ];
		
		this.getTemplates = function(templates) {
		  var theItem;
		  _.each(this.queries, function (item) {
		    if (item.name === templates) {
			  theItem = item.templates;
			}
		  });
		  return theItem;
		};
		
	    /**
	      Update Query with parameters
	     */
	    this.updateQuery = function (query, cube, measure, dimensionTime, year, month) {
	      var updatedQuery;
          updatedQuery = query.replace("$cube", cube);
          updatedQuery = updatedQuery.replace(/\$measure/g, measure);
		  updatedQuery = updatedQuery.replace(/\$dimensionTime/g, dimensionTime);
          updatedQuery = updatedQuery.replace(/\$year/g, year);
          updatedQuery = updatedQuery.replace(/\$month/g, month);
          return updatedQuery;
	    },
		
		this.jsonToMDX = function (queryObj, cube, measure, dimensionTime, year, month, filters) {
		  var query = "",
		  comma = "",
		  filterSet = filters ? filters : [];

		  // WITH MEMBERS clause
		  filterSet = queryObj.where ? filters.concat(queryObj.where) : filterSet;
		  _.each(queryObj.members, function (member, index) {
			query = index === 0 ? "WITH " : query;
			query += " MEMBER " + member.name + " AS " + member.value;
		  });

		  // SELECT clause
		  query += " SELECT NON EMPTY {";
		  _.each(queryObj.columns, function (column, index) {
			comma = index > 0 ? ", " : "";
			query += comma + column;
		  });
		  query += "} ON COLUMNS, NON EMPTY {";
		  _.each(queryObj.rows, function (row, index) {
			comma = index > 0 ? ", " : "";
			query += comma + row;
		  });
		  query += "} ON ROWS";

		  // FROM clause
		  query += " FROM " + queryObj.cube;

		  // WHERE clause
		  _.each(filterSet, function (filter, index) {
			query = index === 0 ? query + " WHERE (" : query;
			comma = index > 0 ? ", " : "";
			query += comma + filter.dimension + ".[" + filter.value + "]";
		  });
		  if (query.indexOf(" WHERE (") !== -1) {
			query += ")";
		  }
		  return this.updateQuery(query, cube, measure, dimensionTime, year, month);
		};	
    }
);