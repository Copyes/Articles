var cheerio = require('cheerio');

var http = require('http');

var iconv = require('iconv-lite');

var url  =  "http://www.dytt8.net/index.htm";
// 获取最新电影标题
function getMoviesTitle(url){
	http.get(url, function(res){
		var chunks = [];
		res.on('data', function(chunk){
			chunks.push(chunk);
		});

		res.on('end', function(){
			var titles = [];

			var shtml = iconv.decode(Buffer.concat(chunks), 'gb2312');
			var $ = cheerio.load(shtml, { decodeEntities: false });

			$(".co_content8 .inddline").each(function(index, element){
				var $element = $(element);
				console.log($element[0]);

				if($element[0].attribs.width == "85%"){
					var str = $element.text();
					var newStr = str.replace(/\r\n/g,'');
					titles.push({
						title: newStr
					});
				}
			});

			console.log(titles);
		});
	});
}
// 获取最新电影的bt
function getMovieBt(){

}

getMoviesTitle(url);
