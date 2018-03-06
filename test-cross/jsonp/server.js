const url = require('url')
const http = require('http')
http
  .createServer((req, res) => {
    const data = {
      a: 10
    }

    const callback = url.parse(req.url, true).query.callback
    res.writeHead(200)
    res.end(`${callback}(${JSON.stringify(data)})`)
  })
  .listen(3000, '127.0.0.1')
console.log('服务启动，监听127.0.0.1')
