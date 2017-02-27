var page = require('webpage').create();
var system = require('system');

var time, address;

if(system.args.length === 1){
	console.log('Usage:loadspeed.js url');
	phantom.exit();
}

time = Date.now();
address = system.args[1];


page.open(address, function(status){
	if(status !== 'success'){
		console.log('fail to load the address');
	} else {
		time = Date.now() - time;
		console.log('loading ' + address);
		console.log('loading time ' + time);
	}
	phantom.exit();
});