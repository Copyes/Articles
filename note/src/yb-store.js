var plugin = function plugin(Vue) {
    return Vue.mixin({
        beforeCreate: function beforeCreate() {
            return initStore(this);
        }
    });
};
var initStore = function initStore(vm) {
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
var Computer = function Computer(key) {
    return {
        get: function get() {
            return key.split('.').reduce(function(k, v) {
                return k[v];
            }, this.$root);
        },
        set: function set(val) {
            var objArr = key.split('.');
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
export default plugin;
