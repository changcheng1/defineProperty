function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter () {
                //放在get里面是为了让watcher初始化时触发
                if (Dep.target) { 
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function setter (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

function Dep () {
    this.subs = [];
}
Dep.prototype = {
    // 增加订阅者
    addSub: function(sub) {
        this.subs.push(sub);
    },
    // 通知订阅者更新
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;
