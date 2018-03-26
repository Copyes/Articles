#### Vue 相关知识点总结

vue 在初始化的时候实际上执行的方法

```js
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjection(vm)
initProps(vm)
initMethods(vm)
initData(vm)
initComputed(vm)
initWatch(vm)
initPrivode(vm)
callHook(vm, 'created')
if (vm.$option.el) {
  vm.$mount(vm.$option.el)
}
```

mounted 调用逻辑判断是否存在 template 选项有的话就直接获取 dom 字符串。没有的话就是通过 el 选择器选择出 dom。在获得模版后，会将模版编译成为渲染函数。这里生成的渲染函数有两个一个是静态节点的渲染函数，一个是动态的渲染函数。最后会把渲染函数挂在 vue.$options 上面。最后就调用缓存下来的$mount
