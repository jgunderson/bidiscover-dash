/************************************************************************
    Copyright 2015 Jeff Gunderson
		See included license
	Copyright 2012 Roland Bouman.
		Under the terms of the GNU Lesser General Public License
*************************************************************************/
var config = require("./config"),
    http = require("http"),
    url = require("url"),
    xmla = require('xmla4js'),
	sstatic = require('node-static'),
	express = require("express"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	jwt = require("jsonwebtoken"),
	mongoose = require("mongoose"),
	User = require('./models/User'),
	Model = require('./models/Model'),
	expressServer = express(),
    X = xmla.Xmla,
    discoverRequestTypes = [
        null,
        {name: X.DISCOVER_DATASOURCES, key: "DataSourceName", property: X.PROP_DATASOURCEINFO},
        {name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", property: X.PROP_CATALOG},
        {name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", property: X.PROP_CUBE},
        {name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME"},
        {name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME"},
        {name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME"},
        {name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME"},
        {name: X.MDSCHEMA_PROPERTIES}
    ]
;

/*******************************************
 * Connect to Mongo                        *
 ******************************************/
mongoose.connect(config.config.mongoUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

/*******************************************
 * Functions for XMLA Server               *
 ******************************************/

 function rowsetToCsv(xmlaRowset) {
    var i, n = xmlaRowset.fieldCount(), text = "",
        linesep = "\r\n", fieldsep = ",", value, row
    ;
    for (i = 0; i < n; i++) {
        if (i) text += fieldsep;
        text += xmlaRowset.fieldName(i);
    }
    text += linesep;
    while (row = xmlaRowset.fetchAsArray()){
        for (i = 0; i < n; i++) {
            if (i) text += fieldsep;
            value = row[i];
            if (value === null) text += "";
            else
            if (typeof(value)==="string") text += "\"" +  value.replace(/"/g, "\"\"") +"\""
            else text += value
            ;
        }
        text += linesep;
    }
    return text;
}

function datasetToCsv(dataset) {
}

function toCsv(xmla, xmlaRequest, xmlaResponse, requestUrl){
    var text;
    if (xmlaResponse instanceof X.Rowset) {
        text = rowsetToCsv(xmlaResponse);
    }
    else
    if (xmlaResponse instanceof X.Dataset) {
        text = datasetToCsv(xmlaResponse);
    }
    return text;
}

function discoverRowsetToHtml(xmla, xmlaRequest, xmlaRowset, requestUrl) {
    var thead = "", tbody = "", i, n, row, href, links = "",
        fieldName, keyIndex = -1, keyValue,
        search = requestUrl.search.replace(/&/g, "&amp;"),
        fragments = requestUrl.fragments,
        decodedFragments = requestUrl.decodedFragments,
        numFragments = fragments.length,
        requestTypeIndex, requestType
    ;
    requestTypeIndex = (numFragments === 2) && (fragments[1] === "") ? 1 : numFragments;
    requestType = discoverRequestTypes[requestTypeIndex];
    n = xmlaRowset.fieldCount();
    for (i = 0; i < n; i++) {
        fieldName = xmlaRowset.fieldName(i);
        if (fieldName === requestType.key) keyIndex = i;
        thead += "<th>" + xmlaRowset.fieldDef(fieldName).label + "</th>";
    }
    links = (numFragments === 2) && (fragments[1] === "") ? "" : fragments.join("/");
    while (row = xmlaRowset.fetchAsArray()) {
        if (keyIndex!==-1) {
            keyValue = row[keyIndex];
            row[keyIndex] = "<a rel=\"next\"" +
                              " title=\"" + discoverRequestTypes[numFragments + 1].name + "\"" +
                              " href=\"" + links + "/" + encodeURIComponent(keyValue) + search + "\">" +
                              keyValue +
                              "</a>"
            ;
        }
        tbody += "<tr>\n<td>" + row.join("</td>\n<td>") + "</td>\n</tr>";
    }
    links = "";
    for (i = 2; i <= numFragments; i++) {
        links += "\n<li><a title=\"" + discoverRequestTypes[i].name + "\"" +
                   " href=\"" + fragments.slice(0, i).join("/") + search + "\">" +
                 decodedFragments[i-1] +
                 "</a></li>"
        ;
    }
    links = "<ul><li><a title=\"" + discoverRequestTypes[1].name + "\" rel=\"prev\" href=\"/" + search + "\">/</a></li>" + links + "</ul>";
    return {
        title: requestType.name,
        heading: requestType.name,
        links: links,
        data: [
          "<table border=\"1\">",
            "<caption>",
            "</caption>",
            "<thead>",
              "<tr>",
                thead,
              "</tr>",
            "</thead>",
            "<tbody>",
              tbody,
            "</tbody>",
          "</table>"
        ].join("\n")
    };
}

function toHtml(xmla, xmlaRequest, xmlaResponse, requestUrl){
    var rendition;
    switch (xmlaRequest.method) {
        case X.METHOD_EXECUTE:
            heading = xmlaRequest.method;
            break;
        case X.METHOD_DISCOVER:
            rendition = discoverRowsetToHtml(xmla, xmlaRequest, xmlaResponse, requestUrl);
            break;
        default:
            throw "Invalid method " + xmlaRequest.method;
    }
    var html = [
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "<html xmlns=\"http://www.w3.org/1999/xhtml\">",
          "<head>",
            "<meta http-equiv=\"content-type\" content=\"application/xhtml+xml;charset=UTF-8\" />",
            "<title>",
              rendition.title,
            "</title>",
            "<style type=\"text/css\">",
            "td {white-space:nowrap;}",
            "ul {margin: 0; padding: 0;}",
            "ul li {display: inline;}",
            "ul li:before {content: \"\\0020 \\00BB \\0020\";}",
            "</style>",
          "</head>",
          "<body>",
            rendition.links,
            "<h1>",
              rendition.heading,
            "</h1>",
            rendition.data,
          "</body>",
        "</html>"
    ];
    return html.join("\r\n");
}

function toXml(xmla, xmlaRequest, xmlaResponse, requestUrl){
    return xmla.responseText;
}

function toJson(xmla, xmlaRequest, xmlaResponse, requestUrl){
    var obj;
    switch (xmlaRequest.method) {
        case X.METHOD_EXECUTE:
            obj = xmlaResponse.fetchAsObject();
            break;
        case X.METHOD_DISCOVER:
            obj = xmlaResponse.fetchAllAsObject();
            break;
        default:
            throw "Invalid method " + xmlaRequest.method;
    }
    return JSON.stringify(obj);
}

function toJavaScript(xmla, xmlaRequest, xmlaResponse, requestUrl){
    var json = toJson(xmla, xmlaRequest, xmlaResponse, requestUrl),
        callback = requestUrl.query["callback"] || "callback"
    ;
    return callback + "(" + json + ")";
}

function httpError(response, errorCode, message){
    response.writeHead(errorCode, message, {"Content-Type": "text/plain"});
    if (message) response.write(message);
    response.end();
}

function decodeFragments(fragments) {
    var decodedFragments = [], i, n = fragments.length;
    for (i = 0; i < n; i++) {
        decodedFragments.push(decodeURIComponent(fragments[i]));
    }
    return decodedFragments;
}

function getOutputHandler(request, requestUrl, response){
    var accept = request.headers["accept"],
        i, n, outputHandler,
        contentType,
        outputHandlers = ({
            "text/csv": toCsv,
            "text/plain": toCsv,
            "text/html": toHtml,
            "application/xhtml+xml": toHtml,
            "text/xml": toXml,
            "application/xml": toXml,
            "text/json": toJson,
            "application/json": toJson,
            "text/javascript": toJavaScript,
            "application/javascript": toJavaScript
        })
    ;
    if (requestUrl.query.format && outputHandlers[requestUrl.query.format]) {
        contentType = requestUrl.query.format;
    }
    else
    if (accept) {
        accept = accept.split(";")[0].split(",");
        n = accept.length;
        for (i = 0; i < n; i++){
            contentType = accept[i];
            if (outputHandlers[contentType]) {
                response.setHeader("Vary", "Accept");
                break;
            }
        }
    }
    if (outputHandler = outputHandlers[contentType]) {
        response.setHeader("Content-Type", contentType);
    }
    return outputHandler;
}

/*******************************************
 * XMLA Server                             *
 ******************************************/

http.createServer(function (request, response) {

    //Check http method
    var httpMethod = request.method;
    if (!({
        "GET": true,
        "HEAD": true
    })[httpMethod]) {
        httpError(response, 405, "Method must be GET or HEAD");
        return;
    }

    //Analyze request
    var requestUrl = url.parse(request.url, true),
        query = requestUrl.query,
        xmlaUrl = query.url,
		contentType = query.format,
        outputHandler
    ;
	
    if (typeof(xmlaUrl) === "undefined") {
		xmlaUrl = config.config.biUrl;
    }

    outputHandler = getOutputHandler(request, requestUrl, response);

    if (typeof(outputHandler)!=="function") {
        httpError(response, 406);
        return;
    }
	
	console.log("hear");

 	var xmlaConnect = new xmla.Xmla({
		async: true,
		properties: {
			DataSourceInfo: "Provider=Mondrian;DataSource=Pentaho",
			Catalog: "xTuple",
		  },
		  listeners: {
			events: xmla.Xmla.EVENT_ERROR,
			handler: function (eventName, eventData, xmla) {
				console.log(
					"xmla error occurred: " + eventData.exception.message + " (" + eventData.exception.code + ")" 
					);
			  }
		  }
	  });
  
	xmlaConnect.executeTabular({
        statement: query.mdx,
        url : config.config.biUrl,
        success: function (xmla, options, xmlaResponse) {
			var obj = xmlaResponse.fetchAllAsObject();
			obj = {data :  obj};
			console.log("\nolapdata query result: " + JSON.stringify(obj));
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.write(JSON.stringify(obj));
			response.end();
          },
      });

}).listen(config.config.port);

console.log("XMLA Server running on port " + config.config.port);

/*******************************************
 * Functions for Express Server            *
 ******************************************/

// Provides req.body parsing 
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(bodyParser.json());

// Enable Cross Origin Access Control
expressServer.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

expressServer.post('/authenticate', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    });
});

expressServer.post('/signin', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, 'mysecret');
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

// The me route must be authorized with a token
expressServer.get('/me', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

expressServer.post('/saveModel', ensureAuthorized, function(req, res) {

	if (req.body.id === "") {
		var dashModel = new Model();
		dashModel.user = req.body.model.user;
		dashModel.model = req.body.model;
		dashModel.save(function(err, dashmodel) {
			if (err) {
				console.log("save err: " +err);
				res.json({type: false, data: "Error occured: " + err});
			}
			else {
			    //
				// After we save a new model we must update its saved id
				//
				console.log("save success " + dashmodel);
				dashmodel.model.id = dashmodel._id
				Model.update({'_id': dashmodel._id}, {$set: {model: dashmodel.model}}, function(err, numberUpd){
					if (err) {
						console.log("upd err: " +err);
						res.json({type: false, data: "Error occured: " + err});
					}
					else {
						console.log("updated this many " + numberUpd);
						res.json({id: dashmodel._id});
					}
				});
			}
		});
	}
	else {
		Model.findById(req.body.id, function (err, dashmodel) {
		    console.log("find id: " + req.body.id);
			if (err) {
				console.log("first err: " +err);
				res.json({type: false, data: "Error occured: " + err});
			}
			if ( dashmodel) {
				Model.update({'_id': dashmodel._id}, {$set: {model: req.body.model}}, function(err, numberUpd){
					if (err) {
						console.log("upd err: " +err);
						res.json({type: false, data: "Error occured: " + err});
					}
					else {
						console.log("update success " + numberUpd);
						res.json({id: dashmodel._id});
					}
				});
			}
			else {
				console.log("cant find: " + req.body.id);
				res.json({type: false, data: "cant find: " + req.body.id});
			}			
		});
	}
});

expressServer.post('/findModels', ensureAuthorized, function(req, res) {

		Model.find({user: req.body.user}, function (err, dashmodels) {
			if (err) {
				console.log("find err: " + err);
				res.json({type: false, data: "Error occured: " + err});
			}
			if ( dashmodels) {
				console.log("find success " + dashmodels);
				res.json(dashmodels);
			}
			else {
				console.log("cant find models for: " + req.body.user);
				res.json({type: false, data: "cant find models for: " + req.body.user});
			}			
		});

});

// The dashtabs must be authorized with a token to show a dashboard
expressServer.get("/adash/partials/dashtabs.html", ensureAuthorized, function(req, res) {
	console.log("sending adash/partials/dashtabs.html");
	res.sendFile(__dirname + "/adash/partials/dashtabs.html");
});

// Serve all other static content without authorization (routes are checked first)
expressServer.use(express.static(__dirname + '/'));

/*******************************************
 * Express Server                          *
 ******************************************/
 
expressServer.listen(config.config.sport, function () {
    console.log( "Express server listening on port " + config.config.sport);
});


