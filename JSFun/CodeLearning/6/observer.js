//  观察对象
import arrayAgumentations from './array.js';
import objectAgumentations from './object';

const ARRAY = 0;
const OBJECT = 1;

let id = 0;


function Observer(value, type){
	this.value = value;
	this.id = ++id;

	Object.defineProperty(value, '$observer', {
		value: this,
		enumerable: false,
        writable: true,
        configurable: true
	});

	if(type === ARRAY){
		
		value.__proto__ = arrayAgumentations;
		this.link(value);
	} else if (type === OBJECT) {
		value.__proto__ = objectAgumentations;
		this.walk(value);
	}
}

/**
 * 根据不同的数据类型,调用observer构造函数
 * @param value {Any} 数据
 * @returns {Observer}
 */
Observer.create = function (value) {
    if (Array.isArray(value)) {
        return new Observer(value, ARRAY);
    } else if (typeof value === 'object') {
        return new Observer(value, OBJECT);
    }
};

/**
 * 这个方法是用来处理如下情况: var ary = [1,{name:liangshaofeng}]
 * 也就是说,当数组的某些项是一个对象的时候,
 * 那么需要给这个对象创建observer监听它
 * @param items {Array} 待处理数组
 */
Observer.prototype.link = function (items) {
    items.forEach((value, index) => {
        this.observe(index, value);
    });
};

/**
 * 遍历数据对象
 * @param obj {Object} 待遍历的数据对象
 */
Observer.prototype.walk = function (obj) {
    let val;
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) return;

        val = obj[key];
        // 递归
        this.observe(key, val);

        this.convert(key, val);
    }
};
/**
 * 触发消息, 并且将消息逐层往上传播
 *
 */
Observer.prototype.notify = function (event, path, val) {
    this.emit(event, path, val);
    let parent = this.parent;
    if (!parent) return;
    let ob = parent.ob;
    ob.notify(event, path, val);
};

/**
 * 定义对象属性
 * @param key {string} 属性键名
 * @param val {Any} 属性值
 */
Observer.prototype.convert = function (key, val) {
    let ob = this;
    Object.defineProperty(this.value, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val;
        },
        set: function (newVal) {
            if (newVal === val) return;
            val = newVal;
            ob.notify('set', key, newVal);
            ob.notify(`set:${key}`, key, newVal);
        }
    });
};

/**
 * 调用创建observer函数
 * 并且判断是否有父节点,如果有,则存储父节点到自身,
 * 目的是为了方便后面事件传播使用
 * @param key {string} 键值
 * @param val {Any} 属性值
 */
Observer.prototype.observe = function (key, val) {
    let ob = Observer.create(val);
    if (!ob) return;
    ob.parent = {
        key,
        ob: this
    };
};


