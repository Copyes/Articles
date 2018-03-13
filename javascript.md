### JavaScript 相关知识总结

> JavaScript 的基本数据类型和引用数据类型分别有哪些？

* 基本类型的数据：Undefined, Null, String, Number, Boolean, Symbol(ES6 新增)
* 引用类型的数据：Object, Array, RegExp, Date, Function, 基本包装类型（Boolean, Number, String 这是三种特殊的引用类型，也可以算作基本类型）
* 需要注意的是，typeof 的返回值（number, boolean, string, object, function, undefined, symbol）和 JS 的基本类型不一样。

> JavaScript 哪些类型存在堆上，哪些存在栈上？

* 栈：原始数据类型

  原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；

* 堆：引用数据类型

  * 引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能
  * 引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

> JavaScript 继承有的方式总结

* 原型继承

  ```js
  let Base = function() {
    this.name = 'base'
    this.toString = function() {
      return this.name
    }
  }

  let Sub = function() {}
  Sub.prototype = new Base()
  Sub.name = 'Sub'

  let a = new Sub()
  console.log(a instanceof Sub) // true
  console.log(a instanceof Base) // true
  ```

  原型链继承是一种非常传统的继承方式。如果从 instanceof 关键字来看，实例既是父类的实例，也是子类的实例。但是这样的继承也有一个明显的问题：子类区别于父类的属性和方法需要在完成原型链继承之后再进行，同时，由于使用了 prototype ，无法实现多重继承

* 构造继承

```js
let Base = function() {
  this.name = 'Base'
  this.toString = function() {
    return this.name
  }
}

let Sub = function() {
  Base.call(this)
  this.name = 'Sub'
}
```

这种继承解决了原型链继承的问题，但它也有一些问题：使用 instanceof 运算符的时候会发现，它的实例并不是父类的实例（因为父类没有在它的原型链上）

* 实例继承

```js
let Base = function() {
  this.name = 'Base'
  this.toString = function() {
    return this.name
  }
}
let Sub = function() {
  let instance = new Base()
  instance.name = 'Sub'

  return instance
}
```

这种继承方法只能强行被归类为继承。因为它实际上是返回了一个父类的实例，与子类可以说毫无关系。同样，这种方法也不支持多继承。

* 拷贝继承

```js
let Base = function() {
  this.name = 'Base'
  this.toString = function() {
    return this.name
  }
}

let Sub = function() {
  let base = new Base()
  for (let i in base) {
    Sub.prototype[i] = base[i]
  }
  Sub.prototype[name] = 'Sub'
}
```

首先，只有可枚举的对象类型才能使用 foreach 的方式获取到，其次，这种写法真的快绝迹了。它的优点是可以实现多继承，缺点是写起来真的难受，而且效率很低。

> 原型链的简单描述

* 判断某个对象是不是另一个对象的原型

```js
// ES3
Object.prototype.isPrototypeOf(o) // 返回true值可以确定Object.prototype就是o对象的原型
// ES5
Object.getPrototypeOf(o) === Object.prototype
// ES6
o.__proto__ === Object.prototype
// 设置一个原型
Object.setPrototypeOf(Child.prototype, Father.prototype) // 将父类的原型设置为子类的原型
```

原型链是 JavaScript 实现继承最重要的一种方式。每一个对象都有自己的原型对象，根原型对象没有原型，所以其 **proto** 属性值为 null 。在调用时，如果访问的对象属性没有找到，JavaScript 会顺着原型链继续往下找，直到触碰到根原型为止。

> ES5 和 ES6 中的继承的区别

![ES5](https://user-images.githubusercontent.com/10307282/37136881-681c1d28-22de-11e8-946e-03983e9e4426.png)
![ES6](https://user-images.githubusercontent.com/10307282/37136911-818dac0e-22de-11e8-9990-483273493e92.png)

> JavaScript 垃圾回收机制

**标记清除**

这是 JavaScript 最常见的垃圾回收方式，当变量进入执行环境的时候，比如函数中声明一个变量，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”。至于怎么标记有很多种方式，比如特殊位的反转、维护一个列表等，这些并不重要，重要的是使用什么策略，原则上讲不能够释放进入环境的变量所占的内存，它们随时可能会被调用的到。

垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的变量了，因为环境中的变量已经无法访问到这些变量了，然后垃圾回收器相会这些带有标记的变量机器所占空间。

**引用计数**

在低版本 IE 中经常会出现内存泄露，很多时候就是因为其采用引用计数方式进行垃圾回收。引用计数的策略是跟踪记录每个值被使用的次数，当声明了一个变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加 1，如果该变量的值变成了另外一个，则这个值得引用次数减 1，当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的空间。

> JavaScript 内存泄漏

* 全局变量引起的内存泄漏

```js
function leaks() {
  leak = 'xxxxxx' //leak 成为一个全局变量，不会被回收
}
```

* 闭包引起的内存泄漏

```js
var leaks = (function() {
  var leak = 'xxxxxx' // 被闭包所引用，不会被回收
  return function() {
    console.log(leak)
  }
})()
```

* dom 清空或删除时，事件未清除导致的内存泄漏

```html
<div id="container">  
</div>
```

```js
$('#container')
  .bind('click', function() {
    console.log('click')
  })
  .remove() // 未把事件移除
```

* 子元素存在引用引起的内存泄漏

> AMD,CMD,CommonJs, ES6 module 各种模块规范

* AMD：requirejs 在推广过程中对模块定义的规范化产出，提前执行，推崇依赖前置
* CMD：seajs 在推广过程中对模块定义的规范化产出，延迟执行，推崇依赖就近
* CommonJs：模块输出的是一个值的 copy，运行时加载，加载的是一个对象（module.exports 属性），该对象只有在脚本运行完才会生成
* ES6 Module：模块输出的是一个值的引用，编译时输出接口，ES6 模块不是对象，它对外接口只是一种静态定义，在代码静态解析阶段就会生成。

> Hybrid 应用知识点总结
