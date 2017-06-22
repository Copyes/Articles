var _ = require('./util') ;
// 构造dom节点对象
function Element(tagName, props, children){
	// 判断当前对象是不是Element
	if(!(this instanceof Element)){
		// 如果children不是数组的话，那么就先在这里把对象转换成数组
		if(!_.isArray(children) && children !== null){
			children = _.slice(arguments, 2).filter(_.truthy);
		}
		// 初始化一个节点实例；
		return new Element(tagName, props, children);
	}
	// 兼容没有属性的情况，没有属性的时候那么props 就是直接等于 children了。
	if(_.isArray(props)){
		children = props;
		props = {};
	}
	// 初始化节点的属性
	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.key = props ? props.key : void 666;

	var count = 0;

	// 遍历所有的节点，如果当前节点有子节点就处理下，然后count++  针对的是元素节点 还有文本节点也会来
	// 
	_.each(this.children, function(child, i){
		if(child instanceof Element){
			count += child.count;
		}else{
			children[i] = '' + child;
		}
		count++;
	});

	this.count = count;
}

Element.prototype.render = function(){
	// 创建节点
	var el = document.createElement(this.tagName);
	// 给节点把属性加上
	var props = this.props;
	// 遍历所有的属性
	for(var propName in props){
		var propVal = props[propName];
		_.setAttr(el, propName, propVal);
	}
	// 看看子节点是元素节点还是文本节点。如果是元素节点的话那么还是要把元素节点渲染出来，文本节点的话就直接生成
	// 文本节点了。
	_.each(this.children, function(child){
		var childEle = (child instanceof Element)
			? child.render()
			: document.createTextNode(child);
		el.appendChild(childEle);
	});

	return el;

}

// module.exports = function(tagName, props, children){
// 	new Element(tagName, props, children);
// }

module.exports = Element;