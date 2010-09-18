// Load MongoDB native library
var DB = require('/Users/marc/Desktop/express/lib/mongodb').Db,
    Connection = require('/Users/marc/Desktop/express/lib/mongodb').Connection,
    Server = require('/Users/marc/Desktop/express/lib/mongodb').Server,
    BSON = require('/Users/marc/Desktop/express/lib/mongodb').BSONPure;

// Other dependencies
var sys = require('sys'), 
    http = require('http'),
    querystring = require('querystring'),
    url = require('url');

// Initalize database tracking
var db = new DB(
    'tracking', 
    new Server('127.0.0.1', 27017), 
    {native_parser: false}
);

// Connect to DB
db.open(function(err, db) {
    
    // Accept requests on localhost, port 8000
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});

        // Switch to collection trackings
        db.collection('trackings', function(err, collection) {
	
            // Parse querystring into params object
            elems = url.parse(req.url);
            params = querystring.parse(elems.query);

			// Calculate time range
			toDate = new Date().getTime();
			fromDate = toDate - 86400 * parseInt(params.days_back) * 1000;
            
            // Insert new tracking with url, site and timestamp
            collection.count({
                    site: params.site,
                    timestamp: {'$gt': fromDate, '$lt': toDate}
                }, function(err, doc) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(doc.toString());
            });
        });
    }).listen(8000);
});

sys.puts('Server running at http://127.0.0.1:8000/');
