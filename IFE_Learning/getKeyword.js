
function searchKeyword(keyword){
	var page = require('webpage').create();
	var dataList = [];
	var result = {};
	var title, link, i;
	var keyword = keyword || '';
	if(!keyword){
		console.log('please enter the word');
	} else {
		page.open('http://www.baidu.com/s?wd=' + keyword, function(status){
			var startTime = Date.now();
			if(status === 'fail'){
				console.log('open the page failed!');
				result.code = 0;
				result.msg = '抓取失败！';
				phantom.exit();
			} else if(status === 'success' && page.loadingProgress >= 100) {
				console.log('open the page successfully!');
				console.log('请稍等，正在抓去数据！');
				page.includeJs('http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js', function(){
					var resultLen = page.evaluate(function(){
						return $('.result').length;
					});
					console.log(resultLen);
					for(i = 0; i < resultLen; ++i){
						link = page.evaluate(function(index){
							return $('#' + index + ' .f13>a.c-showurl').text();
						});
						title = page.evaluate(function(index){
							return $('#' + index + '>h3').text();
						});
						var info = page.evaluate(function(index){
							return $('#' + index + ' .c-abstract').text();
						});
						dataList.push({
							'title': title,
							'link': link,
							'info': info
						});
					}
				});
				var endTime = Date.now();

				result.code = 1;
				result.msg = '抓取成功';
				result.word = keyword;
				result.dataList = dataList;
				result.time = endTime - startTime + 'ms';
				console.log('抓取完毕，数据如下');
				console.log(JSON.stringify(result));
			}
			phantom.exit();
		});
	}
}

searchKeyword('vue');