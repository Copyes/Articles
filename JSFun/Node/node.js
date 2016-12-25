var http = require('http');
var url = require('url');

function start(route, handle){
	function onRequerst(req, res){
		var pathname = url.parse(req.url).pathname;
		var postData = '';
		console.log('Request recevied' + pathname);

		req.setEncoding('utf8');

		req.on('data', function(postDataChunk){
			postData += postDataChunk;
			console.log("Received POST data chunk '"+ postDataChunk + "'.");
      	});
		//res.writeHead(200, {"Content-type": "text/plain"});
		//var content = route(handle, pathname, res);
		//res.write(content);
		//res.end();
		req.on('end', function(){
			route(handle, pathname, res, postData);
		});
	}
	var server = http.createServer(onRequerst);
	server.listen(1234);

	console.log('Server has started');
}

exports.start = start;

