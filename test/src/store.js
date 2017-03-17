var plugin = function(Vue) {
    return Vue.mixin({
        beforeCreate: function() {
            return initStore(this);
        }
    });
};

var initStore = function(vm) {
    console.log(vm);
    if (vm.$options.stores != null) {
        if (vm.$options.computed == null) {
            vm.$options.computed = {};
        }
        if (Array.isArray(vm.$options.stores)) {
            return vm.$options.stores.forEach(function(property) {
                return vm.$options.computed[property] = new Computer(property);
            });
        } else {
            var states = [];
            for (var key in vm.$options.stores) {
                if (typeof vm.$options.stores[key] === 'function') {
                    states.push(vm.$options.computed[key] = new Computer(vm.$options.stores[key]()));
                } else if (typeof vm.$options.stores[key] === 'string') {
                    states.push(vm.$options.computed[key] = new Computer(vm.$options.stores[key]));
                } else {
                    states.push(null);
                }
            }
            return states;
        }
    }
};

var Computer = function(key) {
    return {
        get: function get() {
            console.log(this.$root);
            console.log(key);
            return key.split('.').reduce(function(k, v) {
                console.log(k[v])
                return k[v];
            }, this.$root);
        },
        set: function set(val) {
            console.log(val);
            var objArr = key.split('.');
            console.log(objArr);
            var len = objArr.length - 1;
            var i = 0;
            var j = 0;
            var root = this.$root;
            for (; 0 <= len ? j < len : j > len; i = 0 <= len ? ++j : --j) {
                if (root.hasOwnProperty(objArr[i])) {
                    root = root[objArr[i]];
                }
            }
            return root[objArr[i]] = val;
        }
    };
};
var applyMixin = function(Vue) {
    const version = Number(Vue.version.split('.')[0])
    console.log(version);
    if (version >= 2) {
        alert(2222);
        const usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1
        Vue.mixin(usesInit ? { init: bbStoreInit(Vue) } : { beforeCreate: bbStoreInit(Vue) })
    } else {
        // 待验证
        // 
        const _init = Vue.prototype._init
        Vue.prototype._init = function(options = {}) {
            options.init = options.init ? [bbStoreInit].concat(options.init) : bbStoreInit
            _init.call(this, options)
        }
    }
}

var bbStoreInit = function(){
    console.log(vm);
    if (vm.$options.stores != null) {
        if (vm.$options.computed == null) {
            vm.$options.computed = {};
        }
        if (Array.isArray(vm.$options.stores)) {
            return vm.$options.stores.forEach(function(property) {
                return vm.$options.computed[property] = new Computer(property);
            });
        } else {
            var states = [];
            for (var key in vm.$options.stores) {
                if (typeof vm.$options.stores[key] === 'function') {
                    states.push(vm.$options.computed[key] = new Computer(vm.$options.stores[key]()));
                } else if (typeof vm.$options.stores[key] === 'string') {
                    states.push(vm.$options.computed[key] = new Computer(vm.$options.stores[key]));
                } else {
                    states.push(null);
                }
            }
            return states;
        }
    }
}

var Vue;
//  判断是不是已经安装了
function install(_Vue) {
    if (Vue) {
        console.error(
            '[vuex] already installed. Vue.use(Vuex) should be called only once.'
        )
        return
    }
    Vue = _Vue
    applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}


//export default plugin;
