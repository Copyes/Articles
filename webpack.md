### webpack 相关知识点总结

**chunkid 和 moduleid**

* 每个 chunkid 对应的是一个 js 文件
* 每个 moduleid 对应的是一个个 js 文件的内容的模块（一个 js 文件里面可以 require 多个资源，每 个资源分配一个 moduleid）

**compiler 和 compilation**

* compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

* compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。
