function parse(obj, exp) {
  exp
    .replace('[', '.')
    .replace(']', '')
    .split('.')
    .map(ele => (obj = obj[ele.trim()]))
  return obj || undefined
}
var object = {
  b: { c: 4 },
  d: [{ e: 5 }, { e: 6 }]
}

function getNthFibonacci(count) {
  if (count < 0) return 0
  if (count <= 1) return 1
  let first = 1
  let second = 1
  let third = 0
  for (let i = 2; i < count; i++) {
    third = first + second
    first = second
    second = third
  }
  return third
}

function sum() {
  let result = 0
  for (let i = 0; i < arguments.length; i++) {
    result += (!isNaN(arguments[i]) && parseFloat(arguments[i])) || 0
  }
  return result.toFixed(3) * 1000 / 1000
}

// 数组去重
function unique(array) {
  let res = []
  for (let i = 0, l = array.length - 1; i < l; ++i) {
    var current = array[i]
    if (res.indexOf(current) === -1) {
      res.push(current)
    }
  }

  return res
}
function unique2(array) {
  var res = array.filter((item, index, arr) => {
    return array.indexOf(item) !== index
  })
  return res
}

function unique3(array) {
  return array
    .concat()
    .sort()
    .filter((item, index, array) => {
      return !index || item !== array[index - 1]
    })
}

function unique4(array) {
  return [...new Set(array)]
  //return Array.from(new Set(array))
}

function debounce(func, wait, immediate) {
  let timer = null
  return function() {
    let context = this
    let args = arguments
    if (timer) clearTimeout(timer)
    if (immediate) {
      var callNow = !timer
      timer = setTimeout(function() {
        timer = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(function() {
        func.apply(context, args)
      }, wait)
    }
  }
}

function throttle1(func, wait) {
  var context, args
  var previous = 0
  return function() {
    var now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

function throttle(func, wait) {
  var timer = null
  var context, args
  return function() {
    context = this
    args = arguments

    if (!timer) {
      timer = setTimeout(function() {
        timer = null
        func.apply(context, args)
      }, wait)
    }
  }
}

function shallowCopy(obj) {
  if (typeof obj !== 'object') return
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

function deepCopy(obj) {
  if (typeof obj !== 'object') return
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}
