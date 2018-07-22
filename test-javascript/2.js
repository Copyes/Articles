// code man 实现
function CodingMan(name) {
  function Man(name) {
    setTimeout(() => {
      console.log(`This is ${name}`)
    }, 0)
  }
  Man.prototype.sleep = function(time) {
    let now = new Date()
    let delay = time * 1000

    setTimeout(() => {
      while (new Date() - now < delay) {}
      console.log(`wake up after ${time}`)
    }, 0)
    return this
  }
  Man.prototype.eat = function(food) {
    setTimeout(() => {
      console.log(`Eat ${food}`)
    }, 0)
    return this
  }
  Man.prototype.sleepFirst = function(time) {
    let now = new Date()
    let delay = time * 1000

    while (new Date() - now < delay) {}
    console.log(`wake up after ${time}`)
    return this
  }

  return new Man(name)
}

CodingMan('Peter')
CodingMan('Peter')
  .sleep(3)
  .eat('dinner')
CodingMan('Peter')
  .eat('dinner')
  .eat('supper')
CodingMan('Peter')
  .sleepFirst(5)
  .eat('supper')

//2、实现一个compose
let fn1 = a => a + 1
let fn2 = b => b + 2
let fn3 = c => c + 3

let fnArr = [fn1, fn2, fn3]
function componse(fnArr) {
  return arg => fnArr.reduceRight((composed, fn) => fn(composed), arg)
}

console.log(componse(fnArr)(100))

// 实现bind
Function.prototype._bind = function(context) {
  let func = this // 当前上下文
  let params = [].slice.call(arguments, 1) // 参数
  return function() {
    params = params.concat([].slice.call(arguments, 0))
    func.apply(context, params)
  }
}

let obj = {
  id: '1'
}
function a() {
  console.log(this, arguments)
}

let fn = a._bind(obj, obj.id)
fn()

// 当我们使用new 关键字的时候发生了什么？
function new2(func) {
  let o = Object.create(func.prototype)
  let k = func.call(o)

  return Object.prototype.toString.call(k) === '[object Object]' ? k : o
}

// 封装一个promisify
var promisify = (func, ctx) => {
  // 返回一个新的function
  return function() {
    // 初始化this作用域
    var ctx = ctx || this
    // 新方法返回的promise
    return new Promise((resolve, reject) => {
      // 调用原来的非promise方法func，绑定作用域，传参，以及callback（callback为func的最后一个参数）
      func.call(ctx, ...arguments, function() {
        // 将回调函数中的的第一个参数error单独取出
        var args = Array.prototype.map.call(arguments, item => item)
        var err = args.shift()
        // 判断是否有error
        if (err) {
          reject(err)
        } else {
          // 没有error则将后续参数resolve出来
          args = args.length > 1 ? args : args[0]
          resolve(args)
        }
      })
    })
  }
}
var func1 = function(a, b, c, callback) {
  callback(null, a + b + c)
}
var func2 = promisify(func1)
// 调用后输出6
func1(1, 2, 3, (err, result) => {
  if (!err) {
    console.log(result) //输出6
  }
})
func2(1, 2, 3).then(console.log) //输出6
