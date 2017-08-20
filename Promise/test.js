var { CPromise } =  require('./Promise.js') 
// usage:
new CPromise(function(resolve, reject) { // 我们实现的Promise
    // setTimeout(function() {
    //     resolve(42)
    // }, 2000)
    resolve(42)
  }).then()
    .then()
    .then(function(val){
        console.log(val)
    })
    .done()