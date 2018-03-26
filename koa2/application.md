#### 关于 koa2 的源码学习总结

通过一个简单的例子来看看 koa2 的源码
**示例**

原生 http 请求方式

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(3000)
```

koa2 使用方式

```js
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'Hello Koa'
})

app.listen(3000)
```

> 1、构造函数 `application.js`

这个文件里面主要是在做`new` 一个`koa`实例的初始化工作，以及收集中间件等操作。关键操作就是下面这几步。

```js
this.middleware = [] // 用于存储中间件的数组
this.context = Object.create(context) // 创建上下文
this.request = Object.create(request) // 创建request
this.response = Object.create(response) // 创建response
```

> 2、注册中间件

```js
use(fn) {
  if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
  if (isGeneratorFunction(fn)) {
    deprecate('Support for generators will be removed in v3. ' +
              'See the documentation for examples of how to convert old middleware ' +
              'https://github.com/koajs/koa/blob/master/docs/migration.md');
    fn = convert(fn);
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);
  return this;
}
```

初始化构造函数完成后，如果我们有很多中间件的话，那么这个时候就是调用 use 来注册中间件了。上面就是注册中间件的方法。这个方法里面主要就是判断，传进来的是不是一个函数，如果是一个迭代器函数，那么会调用 convert 方法，将迭代器函数转化成为普通的函数，当然还会提示你不要用迭代器了。最后就是将传进来的函数存在构造函数里面声明的 middleware 数组中。

> 3、调用 listen 方法

```js
listen(...args) {
  debug('listen');
  const server = http.createServer(this.callback());
  return server.listen(...args);
}
```

在构造函数里面初始化完成后，按照我们的使用方式就是注册中间件，然后在最后的时候调用 listen 方法。这个方法很简单，就是以向原生 http.createServer 传入一个函数的形式来创建自身的一个实例。listen 方法就做了这么简单的一个事。

> 4、在看 this.callback()

看到这里我们就明白我们实际上最关心的就是这个 this.callback 函数。其实这个也是 koa2 的核心所在。

```js
callback() {
  const fn = compose(this.middleware);
  // 这里是调用Emitter类里面的方法
  if (!this.listeners('error').length) this.on('error', this.onerror);
  // 包装函数，将ctx和中间件和并函数传给内部
  const handleRequest = (req, res) => {
    // 基于req和req封装出我们使用的ctx对象。
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}
```

this.callback 执行的结果是一个函数，这个函数的主要作用就是根据 req 获取请求信息，然后向 res 中写入返回内容。具体做法就是在一开始的时候合并中间件返回一个函数。然后基于 res 和 req 封装出我们平时使用的 ctx 对象。接着就是调用 koa 自己的 handleRequest 方法，将合并好的中间件函数和刚生成的 ctx 对象传入。

> 5、创建 ctx---createContext

前面已经说过了 ctx 这个对象就是基于 res 和 res 封装来的，接下来就看看是怎么封装的。

```js
createContext(req, res) {
  const context = Object.create(this.context);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.originalUrl = request.originalUrl = req.url;
  context.cookies = new Cookies(req, res, {
    keys: this.keys,
    secure: request.secure
  });
  request.ip = request.ips[0] || req.socket.remoteAddress || '';
  context.accept = request.accept = accepts(req);
  context.state = {};
  return context;
}
```

上面的主要操作就是创建了三个对象 context，request，response

> 6、关于 handleRequest 函数

上面我们知道传进 handleRequest 方法的参数就是经过封装的 ctx 和合并后的中间件函数。并且将他们的原型指定为我们 app 中对应的对象，然后将原生的 req 和 res 赋值给相应的属性，就完成了。

```js
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res;
  res.statusCode = 404;
  const onerror = err => ctx.onerror(err);
  // response 辅助函数
  const handleResponse = () => respond(ctx);
  // onFinished 是确保一个流在关闭、完成和报错时都会执行相应的回调函数
  onFinished(res, onerror);
  return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}
```

这里做的主要是将封装的 ctx 传给合并后的中间件函数 fnMiddleware，中间件函数返回的是一个 promise。resolve 的话就调用 handleResponse，reject 的话就调用 onerror。handleResponse 里面主要做的操作就是通过 ctx 中的信息向 res 中写入信息。

> 7、respond 的分析

respond 方法就是一个辅助方法，主要作用就是根据 ctx 中的相关信息向 res 中写入信息。

```js
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return

  const res = ctx.res
  if (!ctx.writable) return

  let body = ctx.body
  const code = ctx.status

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null
    return res.end()
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body))
    }
    return res.end()
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code)
    if (!res.headersSent) {
      ctx.type = 'text'
      ctx.length = Buffer.byteLength(body)
    }
    return res.end(body)
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body)
  if ('string' == typeof body) return res.end(body)
  if (body instanceof Stream) return body.pipe(res)

  // body: json
  body = JSON.stringify(body)
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body)
  }
  res.end(body)
}
```
