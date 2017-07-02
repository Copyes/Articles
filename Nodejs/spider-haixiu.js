const request = require('request');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');

const pageIndex = 0;
const pageMax = 5;

let baseUrl = 'https://www.douban.com/group/haixiuzu/discussion?start=0';
let urls = [baseUrl];
let requestOpts = []
const defaultOpts = (utl) => {
    return options = {  
        method:"GET",
        url: utl,  
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
            'Host': 'www.douban.com',
            'Referer': 'https://www.douban.com/group/search?cat=1019&q=%E8%AF%B7%E4%B8%8D%E8%A6%81%E5%AE%B3%E7%BE%9E',
            "Cookie": 'bid=vkXjYPjxO6E;ll="108258"; __utmt=1; _pk_id.100001.8cb4=01b2064f77e2447f.1498966886.1.1498966901.1498966886.; _pk_ses.100001.8cb4=*; __utma=30149280.416164627.1498966886.1498966886.1498966886.1; __utmb=30149280.29.0.1498966900716; __utmc=30149280; __utmz=30149280.1498966886.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',    
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"  
        }  
    };
}
// 初始化请求头
const initRequestOpt = (urls, options, num) => {
    urls.forWach((url) => {
        for(let i = 0; i < num; i++){
            options.push({
                method : 'GET',
                url    : url,
                qs     : {start: (i * 25).toString()},
                headers: {
                'Accept'       : '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Cookie': 'bid=vkXjYPjxO6E; ll="108258";',
                'User-Agent'   : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
                }
                // 伪造报文头部，模仿浏览器行为，否则403错误
            });
        }
    });
}
// 获取请不要害羞小组首页的需要爬的详情页的id。
const getDetailId = ({ 
    page,
    success = (data) => {}
}) => {
    console.log(`正在获取第${page}页的数据`);
    let pageData = '';
    let detailUrls = [];

    request(defaultOpts(baseUrl), (err, res, body) => {
        if(err){
            console.log(err);
        }
        let $ = cheerio.load(res.body.toString());
        let shtml = $('.olt .title a'); // a标签html
        for(let i = shtml.length - 1; i >= 0; i--){
            let href = shtml[i].attribs.href;
            let title = shtml[i].attribs.title;
            
            if(href.indexOf('https://www.douban.com/group/topic/') > -1 && title.indexOf('晒') > -1){
                detailUrls.push(href);
            }
        }
        if(!!detailUrls){
            success(detailUrls);
        }
    });
}


// 获取小组内容
const getDetail = (url) => {
    return new Promise((resolve, reject) => {
        console.log(`正在爬取${url}里面的小姐姐哦～`);
        request(defaultOpts(url), (err, res, body) => {
            let html = '';
            if(err){
                reject(err);
            }
            html = res.body.toString();
            resolve(html);
        });
    });
}

// 获取该页所有小姐姐的图片链接
const selectPic = (html) => {
    let $ = cheerio.load(html);
    let title = $('.topic-doc .from a').text().trim();
    let shtml = $('.topic-figure img'); // a标签html
    let pics = [];
    for(let i = shtml.length - 1; i >= 0; i--){
        let src = shtml[i].attribs.src;
        pics.push(src);
    }
    if(pics && pics.length > 0){
        return {
            title,
            pics
        };
    }
}
// 下载对应小姐姐的照片
const downThePics = (sisterObjs) => {
    let pics = sisterObjs.pics;
    let title = sisterObjs.title;

    pics.forEach((pic) => {
        pic = pic.replace('https', 'http');
        let nameArr = pic.split('/');
        let cutName = nameArr[nameArr.length - 1];
        let filename = `./upload/haixiu/${cutName}`;
        fs.exists(filename, (b) => {
            if(!b){
                http.get(pic, (res) => {
                    var imgData = "";
                    res.setEncoding("binary");
                    res.on('data', (chunk) => {
                        imgData += chunk;
                    });
                    res.on("end", function(){
                        let savePath = `./upload/haixiu/${cutName}`;
                        // 保存图片
                        fs.writeFileSync(savePath, imgData, "binary", (err) => {
                            if(err) {
                                console.log(err);
                            }
                        });
                    })
                });
            }else{
                console.log(3333);
            }
        }); 
    });
}
// let test = {
//         "title": "么么哒",
//         "pics": [
//             "http://img1.doubanio.com/view/group_topic/large/public/p83582358.jpg"
//         ]
//     };
// downThePics(test);
// 保存数据到本地
const saveData = (path, sisters) => {
    fs.writeFile(path, JSON.stringify(sisters, null, 4), (err) => {
        if(err){
            return console.log(err);
        }
        console.log('保存好了图片链接哦～');
    });
}
// 异步流程控制和异步并发控制
new Promise((resolve, reject) => {
    getDetailId({
        page: 0,
        success: (urls) => {
            resolve(urls);
        }
    });
}).then((data) => {
    let fetchPage = [];
    let index = 1;
    data.forEach((url) => {
        if(index < 5){
            fetchPage.push(getDetail(url));
        }
        index++;
    });
    return Promise.all(fetchPage);
}).then((pages) => {
    let objs = [];
    pages.forEach((html) => {  
        let sisterObjs = selectPic(html);//获取当前爬取的数据
        if(!!sisterObjs.pics){
            downThePics(sisterObjs);
            objs.push(sisterObjs);
        }
    });
});
