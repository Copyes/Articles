var page = require('webpage').create();
page.open('http://ife.baidu.com', function(){
	page.render('ife.png');
	phantom.exit();
});