var _ = import './util';
// 构造dom节点对象
function Element(tagName, props, children){

	if(!(this instanceof Element)){
		if(!_.isArray(children) && children !== null){
			children = _.slice(arguments, 2).filter(_.truthy);
		}

		return new Element(tagName, props, children);
	}
	// 兼容没有属性的情况，没有属性的时候那么props 就是直接等于 children了。
	if(_.isArray(props)){
		children = props;
		props = {};
	}

	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.key = props ? props.key : void 666;

	var count = 0;

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

// module.exports = function(tagName, props, children){
// 	new Element(tagName, props, children);
// }

module.exports = Element;