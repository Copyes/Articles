### 开始

原型和原型链的理解和学习

### 正文

从一个常见的例子开始吧：

```js
function Person() {}
var person = new Person()
person.name = 'kobe'
console.log(person.name) // kobe
```

这个简单的例子就是我们定义一个构造函数，然后使用这个构造函数生成一个 person 的实例对象。给这个实例对象添加一个属性 name。接下来我们就来分析一波。

> 0、对象

浓情原型和原型链就要弄清楚对象。

* 普通对象
  * 最普通的对象：有\_\_proto\_\_属性，没有 prototype 属性
  * 原型对象
* 函数对象
  * 凡是通过 new Function()创建的都是函数对象。（拥有\_\_proto\_\_、prototype 属性（指向原型对象））

```js
//函数对象  
function F1(){}
var F2 = function(){}
var F3 = function("n1","n2","return n1+n2")
console.log(typeof F1); //function  
console.log(typeof F2); //function  
console.log(typeof F3); //function  
console.log(typeof Object); //function  
console.log(typeof Array); //function  
console.log(typeof String); //function  
console.log(typeof Date); //function  
console.log(typeof Function); //function
```

> 1、prototype

学习前端的人或多或少都听说过 prototype, 我们在很多的地方都可以看到对 prototype 的使用，就像下面的例子。

```js
function Person() {}
// prototype 本身只有函数才会有的
Person.prototype.name = 'kobe'
var person1 = new Person()
var person2 = new Person()

console.log(person1.name) // kobe
console.log(person2.name) // kobe
```

看了上面的例子，你可能会有个疑问。就是这个函数的 prototype 属性到底是指向什么地方呢？是指向这个函数的原型么？

我们可以去浏览器里面试着访问下`Person.prototype`我们就可以发现端倪。经过手动测试，我们发现函数的 prototype 是指向的一个对象，这个对象就是传说中的实例的原型，就是上面`person1`和`person2`的原型。这个对象包含两个属性：

```js
{
  contructor: xxx,
  __proto__: Object
}
```

对于我们来说，我们怎么理解这个原型对象呢？我们可以大致理解为：JavaScript 函数对象在创建的时候，都会为它关联一个对象，这个对象就是我们说的原型。

```js
// 注意：系统内置的函数对象有下面
Function, Object, Array, String, Number
Function.prototype
Object.prototype
Array.prototype
String.prototype
Number.prototype
```

下面这个图能够简单说明构造函数和实例原型对象（其实原型对象就是构造函数的一个实例对象）之间的关系。
![image](https://raw.githubusercontent.com/mqyqingfeng/Blog/master/Images/prototype1.png)

看了上面的关系后，那实例和构造函数还有实例原型的关系是什么呢？

> 2、\_\_proto\_\_

每一个 JavaScript 对象都有一个属性 \_\_proto\_\_,这个属性是指向的该对象的是原型。

```js
function Person() {}
var person = new Person()
console.log(person.__proto__ === Person.prototype) // true
```

所以根据上面的代码可以得到下面的图：

![ssss](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype2.png)

`person`就是我们通过 new 方式创建的普通对象。因此它有\_\_proto\_\_属性。根据上面的代码就可以验证上面的图了。

既然实例和构造函数都可以通过自己的方式指向原型对象，那我们的原型能够反向指向构造函数和实例么？

> 4、contructor

上面的问题的答案就是：指向实例是没有办法了，指向构造函数倒是有办法。不能指向实例主要是因为一个构造函数能够创建多个实例。

最后就有了下面的关系：

```js
function Person() {}
console.log(Person === Person.prototype.constructor) // true
```

更新下关系图：
![xxx](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype3.png)

经过上面的一系列的 操作，我们可以得出如下结论：

```js
function Person() {}

var person = new Person()

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
console.log(Person.prototype.isPrototypeOf(person)) // true
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

看了上面的一系列操作，大致的理清楚了构造函数，实例，以及原型三者之间的关系。

> 5、实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

```js
function Person() {}
Person.prototype.name = 'Curry'
var person = new Person()
person.name = 'kobe'
console.log(person.name)
delete person.name
console.log(person.name)
```

看看上面这个例子，我给实例对象 person 添加了一个属性 name，当我们打印 person.name 的时候我们就可以看到输出的是 curry。当我们把这个属性删掉的时候就会打印出 kobe 了。这就验证了上面的话，先找对象自身的属性，找不到就延原型链找，直到最后。

> 6、原型的原型

在控制台里面打印 Person.prototype 的时候我们可以看到打印出来的对象（普通对象）是有\_\_proto\_\_属性的。所以我们可以展开查看下。
![image](https://user-images.githubusercontent.com/10307282/34213261-a6fd85fa-e5d9-11e7-8f50-20c88df03abd.png)
因为原型也是一个普通对象，那么就可以通过 Object 的方式构造。下面就是构造一个对象的方式

```js
var obj = new Object()
obj.name = 'Kevin'
console.log(obj.name) // Kevin
```

原型对象是由下面的方式

```js
var Person.prototype = new Object()
Person.prototype.xxx = 'xxx'
```

所以可以理解 Person.prototype.\_\_proto\_\_指向的是 Object.prototype。
![xxx](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype4.png)

> 7、原型链与最上级

Object.prototype 的原型是啥呢？

```js
console.log(Object.prototype.__proto__ === null) // true
```

最后这个 null 是什么呢？null 值表示一个空对象指针。null 表示“没有对象”，即该处不应该有值。所以 Object.prototype.\_\_proto\_\_ 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

最后产生的原型链的图：

![xxxx](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png)

### 感谢

[深入理解原型与原型链](https://github.com/mqyqingfeng/Blog/issues/2)
[JS 重点整理之 JS 原型链彻底搞清楚](https://zhuanlan.zhihu.com/p/22787302)
《你不知道的 javascript 上卷》《javascript 高级程序设计》
