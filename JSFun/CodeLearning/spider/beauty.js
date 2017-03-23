var cheerio = require('cheerio');

var http = require('http');

var fs = require('fs');

var queryHref = "http://www.haha.mx/topic/1/new/";

var querySearch = 1;

var urls = [];  // 存图片的地址


var sumConut = 0;
var reptCount = 0;		// 重复的
var downCount = 0;		// 实际下载的

var pagemax = 2;
var startIndex = 1;

// 根据url和参数获取分页内容
function getHtml(href, search){
	console.log("正在获取第"+ search + "页数据");
	var pageData = '';
	var req = http.get(href + search, function(res){
		res.setEncoding('utf8');

		res.on('data', function(chunk){
			pageData += chunk
		});

		res.on('end', function(){
			var $ = cheerio.load(pageData);

			var shtml = $(".joke-list-item .joke-main-content a img");

			for(var i = 0;  i < shtml.length; ++i){
				var src = shtml[i].attribs.src;

				if(src.indexOf("http://image.haha.mx") > -1){
					urls.push(src);
				}
			}

			if(search < pagemax){
				getHtml(href, ++search);
			} else {
				console.log("图片链接获取完毕！");
				sumConut = urls.length;
				console.log("链接总数量：" + urls.length);
				console.log(urls);
				console.log("开始下载......");
				downloadImg(urls.shift());
			}

		});
	});
}


// 下载图片
function downloadImg(imgurl){
	var narr = imgurl.replace("http://image.haha.mx/","").split("/");

	var filename = "./upload/topic1/" + narr[0]  + narr[1] + narr[2] + "_" + narr[4];

	fs.exists(filename, function(b){
		if(!b){
			http.get(imgurl.replace("/small/","/big/"), function(res){
				var imgData = "";

				res.setEncoding("binary");

				res.on("data", function(chunk){
					imgData += chunk;
				});

				res.on("end", function(){
					var savePath = "./upload/topic1/" + narr[0] + narr[1] + narr[2] + "_" + narr[4];

					// 保存图片
					fs.writeFile(savePath, imgData, "binary", function(err){
						if(err) {
							console.log(err);
						}  else {
							console.log(narr[0]  + narr[1] + narr[2] + "_" + narr[4]);
							if (urls.length > 0) {
								downloadImg(urls.shift());
								downCount++;
							}
						}
					});
				})
			});	
		}else{
			// 统计重复的图片
			console.log("该图片已经存在重复.");
			reptCount++;
			if (urls.length > 0) {
				downloadImg(urls.shift());
			}
		}
	});
	if (urls.length <= 0) {
		console.log("下载完毕");
		console.log("重复图片：" + reptCount);
		console.log("实际下载：" + downCount);
	}
}

function start(){
	console.log("开始获取图片连接");
	getHtml(queryHref, startIndex);
}

start();










