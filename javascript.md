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

let Sub = function(){
  let base = new Base()
  for(let i in base){
    Sub.prototype[i] = base[i]
  }
  Sub.prototype[name] = 'Sub
}
```

首先，只有可枚举的对象类型才能使用 foreach 的方式获取到，其次，这种写法真的快绝迹了。它的优点是可以实现多继承，缺点是写起来真的难受，而且效率很低。

> 原型链的简单描述

原型链是 JavaScript 实现继承最重要的一种方式。每一个对象都有自己的原型对象，根原型对象没有原型，所以其 **proto** 属性值为 null 。在调用时，如果访问的对象属性没有找到，JavaScript 会顺着原型链继续往下找，直到触碰到根原型为止。

> ES5 和 ES6 中的继承的区别

![ES5](https://lcx960324.gitbooks.io/front-end-cheat-sheet/content/assets/es5-inherit.png)
![ES6](https://lcx960324.gitbooks.io/front-end-cheat-sheet/content/assets/es6-inherit.png)
