var server = require("./node.js");
var router = require("./router.js");
var handler = require("./handler.js");

var handle = {

};

handle['/'] = handler.start;
handle['/start'] = handler.start;
handle['/upload'] = handler.upload;


server.start(router.route, handle);