#### 概念

发布-订阅模式又称为观察者模式，它定义的是一种一对多的依赖关系，当一个状态发生改变的时候，所有以来这个状态的对象都会得到通知。

#### 生活中的发布-订阅模式

上面事发布-订阅模式的一个比较正式的解释，可能这个解释不大好理解。所以我们通过实际生活中的例子来理解。

比如看中了一套房子，等到去了售楼处的说以后才被告知房子已经售罄了。但是售楼小姐告知，将来会有尾盘推出。具体什么时候推出，目前没人知道。

但是买家又不想频繁的跑，于是就把自己的电话号码登记在售楼处，在登记的花名册上有很多类似的买家。售楼小姐答应买家，新的房源一出来就一一通知买家。

所以上面就是一个发布订阅模式的简单例子。购房者（订阅者）订阅房源信息，售楼处（发布者）发布新房源消息给购房者（订阅者），购房者（订阅者）接收到消息后作出相应的反应。

#### 适用性

* 发布订阅模式可以广泛的应用于异步编程中。
* 发布订阅模式可以取代对象之间的硬编码通知机制。

#### 典型实现例子

> 1、售楼处的例子

一步步实现发布订阅模式：

* 首先指定好谁充当发布者（售楼处）
* 然后给发布者添加一个缓存列表，用语存放回调函数，以便通知订阅者（售楼处花名册）。
* 最后发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者的回调函数。

```js
let salesOffices = {} // 售楼处
salesOffices.books = [] // 缓存列表，存放订阅者的回调函数。
// 增加订阅者
salesOffices.listen = function(fn) {
  this.books.push(fn) // 订阅的消息添加近缓存列表里面
}
salesOffices.trigger = function() {
  // 发布消息
  for (let i = 0, fn; (fn = salesOffices.books[i++]); ) {
    fn.apply(this, arguments) // arguments 是发布消息的时候带上的参数
  }
}

salesOffices.listen(function(price, squareMeter) {
  // 购买者a
  console.log(`价格是：${price}`)
  console.log(`面积大小：${squareMeter}`)
})
salesOffices.listen(function(price, squareMeter) {
  // 购买者b
  console.log(`价格是：${price}`)
  console.log(`面积大小：${squareMeter}`)
})

salesOffices.trigger(2000000, 88)
salesOffices.trigger(3000000, 128)
```

上面实现了一个最简单的发布订阅模式。肯定还有很多问题的，例如订阅者只订阅了某一个消息，但是上面会把所有消息发给每一个订阅者。所以还得通过其他的方式让订阅者只订阅自己感兴趣的消息。

> 2、vue 对发布订阅模式的使用

我们都知道 Vue 有个最显著的特性，便是侵入性不是很强的响应式系统。这个特性就是对发布订阅模式非常好的应用。我们接下来就来看看这个特性是怎么应用的。

vue 的数据初始化：

```js
var v = new Vue({
  data() {
    return {
      a: 'hello'
    }
  }
})
```

这个初始化的代码的背后包含着发布订阅模式的思想，接下来看看官网的一个图

![响应式系统](https://vuefe.cn/images/data.png)

接下来就是网友的一个图：[@xuqiang521](https://github.com/xuqiang521)
![响应系统源码版](https://pic4.zhimg.com/v2-c5581c68ade5d3503d9791ca1be4010f_b.jpg)

##### 1. 数据劫持

从上图可以看到，数据劫持的核心方法就是使用`Object.defineProperty`把属性转化成`getter/setter`。（因为这个是 ES5 中的方法，所以这也是 Vue 不支持 ie8 及以下浏览器的原因之一。）在数据传递变更的时候，会进入到我们封装的`Dep`和`Watcher`中进行处理。

##### 1.1 遍历劫持

数据不紧紧是基本类型的数据，也有可能是对象或者数组。基本类型的数据和对象的处理起来比较简单。

```js
walk(obj) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; ++i) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}
```

核心的劫持相关函数以及属性的订阅和发布

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  /*在闭包中定义一个dep对象*/
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  /*如果之前该对象已经预设了getter以及setter函数则将其取出来，新定义的getter/setter中会将其执行，保证不会覆盖之前已经定义的getter/setter。*/
  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  /*对象的子对象递归进行observe并返回子节点的Observer对象*/
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /*如果原本对象拥有getter方法则执行*/
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        /*进行依赖收集*/
        dep.depend()
        if (childOb) {
          /*子对象进行依赖收集，其实就是将同一个watcher观察者实例放进了两个depend中，一个是正在本身闭包中的depend，另一个是子元素的depend*/
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {
          /*是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归。*/
          dependArray(value)
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      /*通过getter方法获取当前值，与新值进行比较，一致则不需要执行下面的操作*/
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        /*如果原本对象拥有setter方法则执行setter*/
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      /*新的值需要重新进行observe，保证数据响应式*/
      childOb = observe(newVal)

      /*dep对象通知所有的观察者*/
      dep.notify()
    }
  })
}
```

最开始在初始化的时候是对 data 里面的数据就开始劫持监听了。初始化的时候就调用了`observe`方法

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
/*
 尝试创建一个Observer实例（__ob__），如果成功创建Observer实例则返回新的Observer实例，如果已有Observer实例则返回现有的Observer实例。
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  /*判断是否是一个对象*/
  if (!isObject(value)) {
    return
  }
  let ob: Observer | void

  /*这里用__ob__这个属性来判断是否已经有Observer实例，如果没有Observer实例则会新建一个Observer实例并赋值给__ob__这个属性，如果已有Observer实例则直接返回该Observer实例*/
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    /*这里的判断是为了确保value是单纯的对象，而不是函数或者是Regexp等情况。*/
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    /*如果是根数据则计数，后面Observer中的observe的asRootData非true*/
    ob.vmCount++
  }
  return ob
}
```

##### 1.2 返回值

上面的数据`observe`之后返回的就是一个 `Observer` 的实例

```js
ob = new Observer(value)

return ob
```

##### 2."中转站"

在第一步数据劫持的时候，数据的获取或者修改的时候，都会做出对应的操作。这些操作的目的很简单，就是“通知”到“中转站”。这个“中转站”主要就是对数据的变更起通知作用以及存放依赖这些数据的“地方”。

这个"中转站"就是由"Dep"和“Watcher” 类构成的。每个被劫持的数据都会产生一个这样的“中转站”

##### 2.1 Dep

Dep，全名 Dependency，从名字我们也能大概看出 Dep 类是用来做依赖收集的，但是也有通知对应的订阅者的作用 ，让它执行自己的操作，具体怎么收集呢？

```js
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /*添加一个观察者对象*/
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  /*移除一个观察者对象*/
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  /*依赖收集，当存在Dep.target的时候添加观察者对象*/
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  /*通知所有订阅者*/
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
/*依赖收集完需要将Dep.target设为null，防止后面重复添加依赖。*/
const targetStack = []
export function pushTarget(_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  // 改变目标指向
  Dep.target = _target
}

export function popTarget() {
  // 删除当前目标，重算指向
  Dep.target = targetStack.pop()
}
```

代码很简短，但它做的事情却很重要

* 定义 subs 数组，用来收集订阅者 Watcher
* 当劫持到数据变更的时候，通知订阅者 Watcher 进行 update 操作

##### 2.2 Watcher

Watcher 就是订阅者（观察者）。 主要的作用就是就是订阅 Dep(每个属性都会有一个 dep)，当 Dep 发出消息传递（notify）的时候，所以订阅着 Dep 的 Watchers 会进行自己的 update 操作。

```js
export default class Watcher {
  vm: Component
  expression: string
  cb: Function
  id: number
  deep: boolean
  user: boolean
  lazy: boolean
  sync: boolean
  dirty: boolean
  active: boolean
  deps: Array<Dep>
  newDeps: Array<Dep>
  depIds: ISet
  newDepIds: ISet
  getter: Function
  value: any

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    /*_watchers存放订阅者实例*/
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression =
      process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    // parse expression for getter
    /*把表达式expOrFn解析成getter*/
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function() {}
        process.env.NODE_ENV !== 'production' &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.',
            vm
          )
      }
    }
    this.value = this.lazy ? undefined : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  /*获得getter的值并且重新进行依赖收集*/
  get() {
    /*将自身watcher观察者实例设置给Dep.target，用以依赖收集。*/
    pushTarget(this)
    let value
    const vm = this.vm

    /*
    执行了getter操作，看似执行了渲染操作，其实是执行了依赖收集。
    在将Dep.target设置为自生观察者实例以后，执行getter操作。
    譬如说现在的的data中可能有a、b、c三个数据，getter渲染需要依赖a跟c，
    那么在执行getter的时候就会触发a跟c两个数据的getter函数，
    在getter函数中即可判断Dep.target是否存在然后完成依赖收集，
    将该观察者对象放入闭包中的Dep的subs中去。
    */
    if (this.user) {
      try {
        value = this.getter.call(vm, vm)
      } catch (e) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      }
    } else {
      value = this.getter.call(vm, vm)
    }
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    /*如果存在deep，则触发每个深层对象的依赖，追踪其变化*/
    if (this.deep) {
      /*递归每一个对象或者数组，触发它们的getter，使得对象或数组的每一个成员都被依赖收集，形成一个“深（deep）”依赖关系*/
      traverse(value)
    }

    /*将观察者实例从target栈中取出并设置给Dep.target*/
    popTarget()
    this.cleanupDeps()
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  /*添加一个依赖关系到Deps集合中*/
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  /*清理依赖收集*/
  cleanupDeps() {
    /*移除所有观察者对象*/
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  /*
  调度者接口，当依赖发生改变的时候进行回调。
  */
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      /*同步则执行run直接渲染视图*/
      this.run()
    } else {
      /*异步推送到观察者队列中，由调度者调用。*/
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  /*
        调度者工作接口，将被调度者回调。
        */
  run() {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        /*
          即便值相同，拥有Deep属性的观察者以及在对象／数组上的观察者应该被触发更新，因为它们的值可能发生改变。
        */
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        /*设置新的值*/
        this.value = value

        /*触发回调渲染视图*/
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  /*获取观察者的值*/
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  /*收集该watcher的所有deps依赖*/
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  /*将自身从所有依赖收集订阅列表删除*/
  teardown() {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      /*从vm实例的观察者列表中将自身移除，由于该操作比较耗费资源，所以如果vm实例正在被销毁则跳过该步骤。*/
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```

通过上面对 vue 的响应系统的  学习，就可以了解到这个发布订阅模式就是这样的：

* Dep 负责收集所有相关的的订阅者 Watcher ，具体谁不用管，具体有多少也不用管，只需要根据 target 指向的计算去收集订阅其消息的 Watcher 即可，然后做好消息发布 notify 即可。
* Watcher 负责订阅 Dep ，并在订阅的时候让 Dep 进行收集，接收到 Dep 发布的消息时，做好其 update 操作即可。

> 3、vue 中更多的应用

vue 中还有个组件之间的时间传递也是用到了发布订阅模式。
$emit 负责发布消息， $on  负责消费消息（执行 cbs 里面的事件）

```js
Vue.prototype.$on = function(
  event: string | Array<string>,
  fn: Function
): Component {
  const vm: Component = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$on(event[i], fn)
    }
  } else {
    ;(vm._events[event] || (vm._events[event] = [])).push(fn)
  }
  return vm
}

Vue.prototype.$emit = function(event: string): Component {
  const vm: Component = this
  let cbs = vm._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    for (let i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(vm, args)
    }
  }
  return vm
}
```

#### 总结

本文通过对 vue 相关源码的学习，了解了发布订阅模式（观察者模式）的概念和应用。还了解了该模式的  一些优缺点：

* 时间上的解耦，对象之间的解耦。
* 创建订阅者本身会消耗一定的时间和内存，并且订阅者订阅一个消息后，该消息一直不发生的话，那么该订阅者  会一直存在在内存中

#### 感谢

[从源码角度再看数据绑定](https://github.com/answershuto/learnVue/blob/master/docs/%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%92%E5%BA%A6%E5%86%8D%E7%9C%8B%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A.MarkDown)

《javascript 设计模式与开发实践》
