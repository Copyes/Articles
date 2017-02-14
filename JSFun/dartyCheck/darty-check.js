
var Scope = function() {
	this.$watchers = []; 
}


Scope.prototype.watch = function(exp, listener) {
	this.$watchers.push({
		watchExp: exp,
		listener: listener || function() {}
	});
	console.log(this.$watchers);
}

Scope.prototype.$digest = function() {
	var dirty;

	do {
		dirty = false;
		for(var i = 0, len = this.$watchers.length; i < len; ++i){
			var newVal = this.$watchers[i].watchExp();
			var oldVal = this.$watchers[i].last;

			if(oldVal !== newVal){
				this.$watchers[i].listener(newVal, oldVal);
				dirty = true;
				this.$watchers[i].last = newVal;
			}
		}
	}while(dirty);
}


var $ = document.querySelector.bind(document);
var $input = $('#input');
var $output = $('#output');


var scope = new Scope();
scope.value = '默认值';




var bindWatch = function(scope, node){
	scope._nodes = scope._nodes || [];
	scope._nodes.push(node);
	var key = node.getAttribute('data-bind');
	if(!key){
		return console.log('no data bind the key!');
	}
	console.log(key);
	console.log(scope[key]);
	// 更新视图
	updateView(scope, scope[key]);
	scope.watch(function(){
		return scope[key];
	}, function(newVal, oldVal){
		//更新视图
		updateView(scope, newVal);
	});
}

var updateView = function(scope, newVal){
	var nodes = scope._nodes;
	console.log(nodes);
	var VALUE_NODES = ['INPUT', 'TEXTAREA'];

	nodes.forEach(function(node){
		if(VALUE_NODES.indexOf(node.tagName) !== -1){
			if(node.value !== newVal){
				node.value = newVal;
			}
		} else {
			node.innerText = newVal;
		}
	});
}	

bindWatch(scope, $input);
bindWatch(scope, $output);

$input.addEventListener('input', function(){
	scope.value = $input.value;
	scope.$digest();
});

$('#btn').addEventListener('click', function(){
	scope.value = '点击更新'  + Date.now();
	scope.$digest();
});



