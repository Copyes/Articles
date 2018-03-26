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

//CodingMan('Peter')
// CodingMan('Peter')
//   .sleep(3)
//   .eat('dinner')
// CodingMan('Peter')
//   .eat('dinner')
//   .eat('supper')
// CodingMan('Peter')
//   .sleepFirst(5)
//   .eat('supper')

// 2、实现一个compose
let fn1 = a => a + 1
let fn2 = b => b + 2
let fn3 = c => c + 3

let fnArr = [fn1, fn2, fn3]
function componse(fnArr) {
  return arg => fnArr.reduceRight((composed, fn) => fn(composed), arg)
}

// console.log(componse(fnArr)(100))
