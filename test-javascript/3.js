const destructuringArray = (values, keys) => {
  try {
    const obj = {}
    if (typeof keys === 'string') {
      keys = JSON.parse(keys.replace(/\w+/g, '"$&"'))
    }
    const iterate = (values, keys) => {
      keys.forEach((key, i) => {
        if (Array.isArray(key)) iterate(values[i], key)
        else obj[key] = values[i]
      })
    }
    iterate(values, keys)
    return obj
  } catch (e) {
    console.log(e)
  }
}

// 将 destructuringArray([1, [2, 3], 4], "[a, [b], c]") => {a: 1, b: 2, c: 4}
const targetArray = [1, [2, 3], 4]
const formater = '[a, [b], c]'
//console.log(destructuringArray(targetArray, formater))

// 数组展平，主要利用map返回新的数组
const flatten = arr => {
  return [].concat(
    ...arr.map(item => (Array.isArray(item) ? flatten(item) : item))
  )
}

//console.log(flatten([[1, 2], 3, [[[4], 5]]]))

// 二分查找，非递归手段
function binarySearch(arr, dest) {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)
    if (dest > arr[mid]) {
      low = mid + 1
    } else if (dest < arr[mid]) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -1
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8]
//console.log(binarySearch(arr, 3)) // 2

// 找出数组中重复出现的元素
// 例如：[1，2，4，4，3，3，1，5，3]
// 输出：[1，3，4]
let arr1 = [1, 2, 4, 4, 3, 3, 1, 5, 3]

function findRepeat(arr) {
  var result = [],
    map = {}
  arr.forEach(item => {
    if (map[item] === 1) result.push(item)
    map[item] = (map[item] || 0) + 1
  })
  return result
}
//console.log(findRepeat(arr1))

function createArray(len, arr = []) {
  if (len > 0) {
    arr[--len] = len
    createArray(len, arr)
  }
  return arr
}

function findDocList(docs, keys) {
  let result = []
  docs.forEach(doc => {
    keys.forEach(key => {
      doc.words.indexOf(key) > -1 && result.push(doc.id)
    })
  })
  return result
}
var docs = [
  {
    id: 1,
    words: ['hello', 'world']
  },
  {
    id: 2,
    words: ['hello', 'hihi']
  },
  {
    id: 3,
    words: ['haha', 'hello']
  },
  {
    id: 4,
    words: ['world', 'nihao']
  }
]
//console.log(findDocList(docs, ['hello'])) // 文档id1，文档id2，文档id3
//findDocList(docs, ['hello', 'world']) // 文档id1

class EventEmitter {
  constructor() {
    this.events = {}
    this.onceEvents = {}
  }

  on(event, fn) {
    let callback = this.events[event] || []
    callback.push(fn)
    this.events[event] = callback
  }
  fire(obj) {
    let { type, value } = obj
    let handle = function(list) {
      for (let i in list) {
        if (i === type) {
          for (let j in list[i]) {
            list[i][j](value)
          }
        }
      }
    }
    handle(this.events)
    handle(this.onceEvents)
  }
  off(event, fn) {
    let callback = this.events[event]
    let index = callback.indexOf(fn)
    index > -1 && callback.splice(index, 1)
  }
  once(event, fn) {
    let callback = this.onceEvents[event] || []
    callback.push(fn)
    this.onceEvents[event] = callback
  }
}

const cycleObj = {
  foo: {
    name: 'foo',
    bar: {
      name: 'bar',
      baz: {
        name: 'baz',
        aChild: null
      }
    }
  }
}
cycleObj.foo.bar.baz.aChild = cycleObj.foo
function cycleDetector(obj) {
  let res = false
  let stack = []
  // 判断是不是在栈中
  let inCycle = function(item) {
    if (stack.indexOf(item) > -1) {
      return true
    }
    return false
  }
  // panduan
  let read = function(_obj) {
    for (let prop in _obj) {
      if (Object.prototype.toString.call(_obj[prop]) === '[object Object]') {
        if (!inCycle(_obj[prop])) {
          stack.push(_obj[prop])
          read(_obj[prop])
        } else {
          res = true
        }
      }
    }
  }
  read(obj)
  return res
}
// console.log(cycleDetector(cycleObj))

function template(str) {
  let replace = {}
  var result
  var reg = new RegExp('\\<\\%\\=\\w+\\%\\>', 'g')
  while ((result = reg.exec(str))) {
    let _re = new RegExp('\\w+', 'g')
    var item = result[0].match(_re)[0]
    replace[item] = {}
    replace[item].origin = result[0]
  }
  return function(obj) {
    for (let i in obj) {
      if (replace[i]) {
        str = str.replace(replace[i].origin, replace[i])
      }
    }
    return str
  }
}

function parseUrl(url) {
  let obj = {}
  let index = url.indexOf('?')
  if (index > -1) {
    let param = url.substring(index + 1, url.length).split('&')
    for (let i = 0, l = param.length; i < l; ++i) {
      let arr = param[i].split('=')
      obj[arr[0]] = arr[1]
    }
  }
  return obj
}

// crash
class Cash {
  constructor(num) {
    this.num = num
  }
  init(args) {
    if (args.length === 1) {
      if (typeof args[0] === 'number') {
        const num = (this.num || 0) + args[0]

        return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num %
          10}分`
      }

      if (typeof args[0] === 'object' && args[0] instanceof Cash) {
        const num = this.num + args[0].num

        return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num %
          10}分`
      }
    }

    if (args.length > 1) {
      let num = 0

      args.forEach(item => (num += item))

      return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num % 10}分`
    }
  }
  add(...args) {
    return this.init(args)
  }

  static add(...args) {
    if (args.length === 1) {
      if (typeof args[0] === 'number') {
        const num = (this.num || 0) + args[0]

        return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num %
          10}分`
      }

      if (typeof args[0] === 'object' && args[0] instanceof Cash) {
        const num = this.num + args[0].num

        return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num %
          10}分`
      }
    }

    if (args.length > 1) {
      let num = 0

      args.forEach(item => (num += item))

      return `${parseInt(num / 100)}元${parseInt(num / 10) % 10}角${num % 10}分`
    }
  }

  valueOf() {
    return this.num
  }
}

const cash1 = new Cash(105)
const cash2 = new Cash(66)
const cash3 = cash1.add(cash2)
const cash4 = Cash.add(cash1, cash2)
const cash5 = Cash.add(cash1 + cash2)
console.log(`${cash3}`, `${cash3}`, `${cash3}`)

function isDuplicate() {
  let n = arguments.length
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      if (arguments[i] === arguments[j]) {
        return true
      }
    }
  }
  return false
}

// console.log(isDuplicate(1, 2, 3, 2))
