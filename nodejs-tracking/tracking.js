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

            if (params.url === undefined || params.site === undefined) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end();
                return;
            }
            
            // Insert new tracking with url, site and timestamp
            collection.insert({
                    url: params.url,
                    site: params.site,
                    timestamp: new Date().getTime()
                }, function(err, docs) {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end();
            });
        });
    }).listen(8000);
});

sys.puts('Server running at http://127.0.0.1:8000/');
