#### 浏览器相关知识点总结

> 1、浏览器进程

* 主进程：只有一个主要是负责各个进程之间的调控
* gpu 进程：只要是用于 3d 渲染
* 后台修复进程
* tab 进程（浏览器渲染进程）：开多个 tab 的时候相互之间不会受到影响。控制各个 tab 自己的渲染，脚本执行，事件处理等等事情。
* 插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建

> 2、多线程的浏览器渲染进程

* GUI 渲染线程
* JS 引擎线程（单线程）
* 事件触发线程
* 定时器线程
* 网络请求线程

> 3、网络请求都是单独的线程

每次网络请求时都需要开辟单独的线程进行，譬如如果 URL 解析到 http 协议，就会新建一个网络线程去处理资源下载

因此浏览器会根据解析出得协议，开辟一个网络线程，前往请求资源（这里，暂时理解为是浏览器内核开辟的，如有错误，后续修复）

> 4、tcp/ip 并发限制

浏览器在同一域名下的并发 tcp 链接限制一般是 2 到 10 个。

> 5、performance

```js
// 计算加载时间
function getPerformanceTiming() {
  var performance = window.performance

  if (!performance) {
    // 当前浏览器不支持
    console.log('你的浏览器不支持 performance 接口')
    return
  }

  var t = performance.timing
  var times = {}

  //【重要】页面加载完成的时间
  //【原因】这几乎代表了用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart

  //【重要】解析 DOM 树结构的时间
  //【原因】反省下你的 DOM 树嵌套是不是太多了！
  times.domReady = t.domComplete - t.responseEnd

  //【重要】重定向的时间
  //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
  times.redirect = t.redirectEnd - t.redirectStart

  //【重要】DNS 查询时间
  //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
  // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart

  //【重要】读取页面第一个字节的时间
  //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
  // TTFB 即 Time To First Byte 的意思
  // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
  times.ttfb = t.responseStart - t.navigationStart

  //【重要】内容加载完成的时间
  //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
  times.request = t.responseEnd - t.requestStart

  //【重要】执行 onload 回调函数的时间
  //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
  times.loadEvent = t.loadEventEnd - t.loadEventStart

  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart

  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart

  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart

  return times
}
```

> 6、性能优化

* DNS 查询 ============

1、控制域名数量，推荐是两个。

2、使用缓存 Last-Modified，If-Modified-Since，ETag，If-None-Match，Expires，Cache-Control。

3、使用 CDN，提高缓存命中率。

4、服务根据需要设置合理的 TTL。

5、DNS 的预解析。

* 建立连接=================

1、合并请求，减少请求次数。

2、持久连接 keep-alive，避免重新建立连接。

3、避免重定向。

* 发送请求 ===================

1、请求数据最小化。

2、避免重定向。

* 接收数据================

1、使用缓存 Last-Modified，If-Modified-Since，ETag，If-None-Match，Expires，Cache-Control

2、降低传输数据量，避免冗余的数据，适当的压缩后再进行传输。

3、传输过程中的压缩。

4、使用 CDN，缩短传输链路。

* 解析 DOM 树 ===================

1、简化 DOM 结构，嵌套不要太深。

2、css 放头部，js 放底部（？有争议~）

3、延迟或者异步加载资源。

4、按照规范书写 html 文档，浏览器会有很多容错机制，但是这些会带来一些额外的消耗。所以没有必要的情况下，请严格按照 html 规范来。

5、同步加载的 js 除了会阻塞页面的解析，如果其中有修改 DOM 结构的相关代码，还会导致 DOM 重新解析，非常划不来。

* DOMContentLoaded 事件耗时

1、避免多余操作，延迟加载或者按需加载。

2、精简代码。

3、提高执行效率。



优化方向

优化手段

请求数量

合并脚本和样式表，CSS Sprites，拆分初始化负载，划分主域

请求带宽

开启GZip，精简JavaScript，移除重复脚本，图像优化

缓存利用

使用CDN，使用外部JavaScript和CSS，添加Expires头，减少DNS查找，配置ETag，使AjaX可缓存

页面结构

将样式表放在顶部，将脚本放在底部，尽早刷新文档的输出

代码校验

避免CSS表达式，避免重定向
