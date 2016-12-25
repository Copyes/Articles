function route(handle, pathname, res, postData){
	console.log("about to route a request for " + pathname);

	if(typeof handle[pathname] === 'function'){
		return handle[pathname](res, postData);
	}else{
		console.log('the router doesn`t exit!' + pathname);
		res.writeHead(404, {"Content-type": "text/plain"});
		res.write("404 not found!");
		return "404 not found!";
	}
}

exports.route = route;