var page = require('webpage').create();	
page.open('http://ife.baidu.com', function(status){
	if(status !== 'success'){
		console.log('the page fail to load');
	} else {
		var title = page.evaluate(function(){
			return document.title;
		});
	}

	console.log('Page title is ', title);
	phantom.exit();
});