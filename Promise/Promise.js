/**
 * the constructor of CPromise
 * @param {*} executor a callback
 */
function CPromise(executor){
    var self = this
    this.status = 'pending'
    this.data = undefined
    // when promise resolved, the collections contains more than one callback,
    // and two callback at most
    this.onResolvedCallback = []
    this.onRejectedCallback = []

    // the status is fulfilled
    function resolve(value){
        if(self.status === 'pending'){
            self.status = 'resolved'
            self.data = value
            for(var i = 0; i < self.onResolvedCallback.length; i++){
                self.onResolvedCallback[i](value)
            }
        }
    }
    // the status is rejection
    function reject(reason){
        if(self.status === 'pending'){
            self.status = 'rejected'
            self.data = reason
            for(var i = 0; i < self.onRejectedCallback.length; i++){
                self.onRejectedCallback[i](reason)
            }
        }
    }
    // executor may be wrong, so we must catch the mistake
    try {
        executor(resolve, reject)
    }catch(e){
        reject(e)
    }
}
// a method named then that mounted on the CPromise.prototype
CPromise.prototype.then = function(onResolved, onRejected){
    var self = this
    var otherPromise
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) { return v }
    onRejected = typeof onRejected === 'function' ? onRejected : function(r) { return e }
    if(self.status === 'resolved'){
        return otherPromise = new CPromise(function(resolve, reject){
            try{
                var temp = onResolved(self.data)
                temp instanceof CPromise && temp.then(resolve, reject)
                resolve(temp)
            }catch(err){
                reject(err)
            }
        })
    }

    if(self.status === 'rejected'){
        return otherPromise = new CPromise(function(resolve, reject){
            try{
                var temp = onRejected(self.data)
                temp instanceof CPromise && temp.then(resolve, reject)
            }catch(err){
                reject(err)
            }
        })
    }
    // if the status is always pending, 
    // the callback is pushed to the corresponding array
    if(self.status === 'pending'){
        return otherPromise = new CPromise(function(resolve, reject){
            // resolved callback array, return a promise
            self.onResolvedCallback.push(function(value){
                try{
                    var temp = onResolved(self.data)
                    temp instanceof CPromise && temp.then(resolve, reject)
                    resolve(temp)
                }catch(err){
                    reject(err)
                }
            })
            // rejected callback array
            self.onRejectedCallback.push(function(){
                try{
                    var temp = onRejected(self.data)
                    temp instanceof CPromise && temp.then(resolve, reject)
                }catch(err){
                    reject(err)
                }
            })
        })
    }
}
// a method named catch that mounted on the CPromise.prototype
CPromise.prototype.catch = function(onRejected){
    return this.then(null, onRejected)
}
// when a big error happened, run stop ,
// the function will stop the next action
CPromise.prototype.stop = function(){
    return new CPromise(function(){})
}
CPromise.prototype.done = function(){
    return this.catch(function(err){
        console.log(err)
    })
}

module.exports = {
    CPromise
}


  
