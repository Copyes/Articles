const http = require('http')
http
  .createServer((req, res) => {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
      'Content-Type': 'text/html;charset=utf-8'
    })
    res.end('这是你要的数据：1111')
  })
  .listen(3000, '127.0.0.1')
console.log('The server is listening to 127.0.0.0')
