### webpack 相关知识点总结

**chunkid 和 moduleid**

* 每个 chunkid 对应的是一个 js 文件
* 每个 moduleid 对应的是一个个 js 文件的内容的模块（一个 js 文件里面可以 require 多个资源，每 个资源分配一个 moduleid）
