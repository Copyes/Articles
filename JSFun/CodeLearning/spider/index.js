'use strict'

let fs = require("fs");
let cheerio = require("cheerio");
let async = require("async");

let request = require("superagent");
require('superagent-charset')(request);

// 基本信息
const Config = {
	startPage: 1,
	endPage: 1,
	downloadImg: true,
	downloadConcurrent: 10,
	currentImgType: "scy" //  当前爬虫要爬的图片的类型
};
// 图片类型
const ImgType = {
	ecy: "http://tu.hanhande.com/ecy/ecy_", //二次元   总页码: 50
    scy: "http://tu.hanhande.com/scy/scy_", //三次元   总页码: 64
    cos: "http://tu.hanhande.com/cos/cos_", //cosPlay 总页码: 20
}
// 异步获取html内容
let getHtmlAsync = function(url){
	return new Promise(function(resolve,reject){
		request.get(url).charset('gbk').end(function(err, res){
			err ? reject(err) : resolve(cheerio.load(res.text));
		});
	});
}

let getAlbumsAsync = function(){
	return new Promise(function(resolve, reject){
		console.log('start albums');
		let  albums = [];
		let q = async.queue(async function(url, taskDone){
			try {
				let $ = await getHtmlAsync(url);

				console.log(`download ${url} success`);

				$('.picList em a').each(function(index, element){
					albums.push({
						title: element.children[1].attribs.alt,
						url: element.attribs.href,
						imgList: []
					});
				});

			} catch(err){
				console.log(`Error: get album list - download ${url} err : ${err} `);
			} finally {
				taskDone();
			}
		}, 10);

		// 所有的任务都执行完了以后调用下面的函数
		q.drain = function(){
			console.log(`Get album list complete`);
			resolve(albums);
		}

		let pageUrls = [];
		let imageTypeUrl = ImgType[Config.currentImgType];
		for(let i = Config.startPage; i < Config.endPage; i++){
			pageUrls.push(imageTypeUrl + `${i}.shtml`);
		}

		q.push(pageUrls);
	})
}

let getImageListAsync = function(albumList){
	return new Promise(function(resolve, reject){
		console.log('start get album`s imgList');

		let q = async.queue(async function({url: albumuRL, title: albumTitle, imgList}, taskDone){
			try {
                let $ = await getHtmlAsync(albumUrl);
                console.log(`get album ${albumTitle} image list done`);
                $('#picLists img').each(function (idx, element) {
                    imgList.push(element.attribs.src);
                });
            } catch (err) {
                console.log(`Error :get image list - download ${albumUrl} err : ${err}`);
            }
            finally {
                taskDone();// 一次任务结束
            }
		}, 10);

		q.drain = function () {
            console.log('Get image list complete');
            resolve(albumsList);
        }

        //将所有任务加入队列
        q.push(albumsList);
	});
}

// 保存图册信息到json文件
function writeJsonToFile(albumList){
	let folder = `json-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`;
	fs.mkdirSync(folder);

	let filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.json`;
	fs.writeFileSync(filePath, JSON.stringify(albumsList));


	let simpleAlbums = [];

	const sliceLen = "http://www.hanhande.com/upload/".length;
	albumList.forEach(function({ title:albumTitle, url: albumUrl, imgList}){
		let imgListTemp = [];

		imgList.forEach(function(url){
			imgListTemp.push(url.slice(sliceLen));
		});
		simpleAlbums.push({ title: albumTitle, url: albumUrl, imgList: imgListTemp});

	});

	filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.min.json`;

	fs.writeFileSync(filePath, JSON.stringify(simpleAlbums));
}







