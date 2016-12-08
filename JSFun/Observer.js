var data = {
    name: 'fanchao',
    user: {
        nick: '我是你爸爸'
    }
};
observe(data);
data.name = 'QAQ'; // 哈哈哈，监听到值变化了 fanchao --> QAQ
data.user.nick = '帅哥';

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(function(key) {
        console.log(key);
        defineVue(data, key, data[key]);
    });
}

function defineVue(data, key, val) {
	//每个属性都要一个消息订阅器
	var dep = new Dep();

    !val && typeof val === 'object' || observe(val);

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
            //console.log(val);
            return val;
        },
        set: function(newVal) {
        	if (newVal === val) return;
            console.log('监听到值已经发生了变化了。', val, '------>', newVal);
            val = newVal;
            //属性的值发生了变化的时候订阅器就要给所有的订阅者发出通知。
            dep.notify();
        }
    });
}
//消息订阅器，用来维护订阅者
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    nootify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};