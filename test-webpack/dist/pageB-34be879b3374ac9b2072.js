webpackJsonp(["pageB"],{

/***/ "645S":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "JIOT":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("lhZZ")
const sum = __webpack_require__("MvGc")
const _ = __webpack_require__("M4fF")

function component() {
  var element = document.createElement('div')

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())


/***/ }),

/***/ "MvGc":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {__webpack_require__("645S")
module.export = function sum(a, b) {
  return a + b
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("3IRH")(module)))

/***/ }),

/***/ "lhZZ":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},["JIOT"]);