async函数是generator函数的语法糖

同样的一个函数用async替换的时候只需要吧 function*(){}替换成 async 把yield替换成await即可

但是async函数有4点改进

1. 内置执行器 (generator需要用co模块)
2. 更好的语义 await表示需要等待异步结果
3. 更广的适用性
4. 返回值与generator不同返回Promise对象(即使你返回的是一个值也会被包装成Promise.resolve(值))

async返回的是Promise对象,可以再被await做为参数

async函数可以放在对象,类,表达式,函数声明,箭头函数中

async的错误机制是个难点

> async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。

async函数返回的promise对象,必须等return前的所有await的promise执行完成之后才会执行

unhandledRejection事件可以捕获错误

await后面是一个promise对象如果不是会立即被转化成一个resolve的promise对象

await中的任何一个promise被reject之后都会中断后续执行,如果不想因为其中一个reject就影响后面的执行可以使用try...catch,或者还有一种方法是对await的promise直接调用.catch

在async函数中如果两个异步可以并行,就不要写成串行,并行不一定非要用promise.all



注意点:
- [ ] yield 和 await 后面可以是原始类型的值(string,number,boolean)(实际测试能返回任何值)或者promise对象, 但是co模块约定yield后面只能返回Thunk函数或Promise对象
- [ ] async 函数执行过程如果报错可以在最后返回的promise里.catch捕获错误
- [ ] async 函数在执行的时候一旦遇到await就会返回Promise


