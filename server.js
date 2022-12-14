//Required Modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const { unescape } = require('querystring');


//Array of Mime Types
var mimeTypes = {
    "html": "text/html",
    "jpeg":"image/jpeg",
    "jpg":"image/jpeg",
    "png":"image/png",
    "js":"text/javascript",
    "css":"text/css"
};

//Create Server
http.createServer(function(req,res){
    var uri = url.parse(req.uri).pathname;
    var filename = path.join(process.cwd(),unescape(uri));
    console.log("Loading " + uri);
    var stats;

    try{
        stats = fs.lstatSync(filename);

    }
    catch{
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    //check if file/directory 
    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        res.writHead(200,{'Content-Type':mimeType});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    }
    else if(stats.isDirectory()){
        res.writeHead(302,{
            'Location': 'index.html'
        });
        res.end();
    }
    else{
        res.writHead(500, {'Content-Type':'text/plain'});
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(3000);
// http.createServer(function(req,res){
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.end('Hello World\n');
// }).listen(1337,'127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');