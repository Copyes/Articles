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
