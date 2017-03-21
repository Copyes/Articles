var _ = exports;

_.type = function type(obj){
	return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g,'');
}

_.isArray = function isArray(array){
	return _.type(array) === 'Array';
}

_.slice = function slice(arrayLike, index){
	return Array.prototype.slice.call(arrayLike, index);
}

_.truthy = function truthy(value){
	return !!value;
}

_.isString = function isString(str){
	return _.type(str) === 'String';
}

_.each = function each(array, fn){
	for(var i = 0; i < array.length; ++i){
		fn(array[i], i);
	}
}

_.toArray = function toArray(listLike){
	if(!listLike){
		return [];
	}

	var list =[];

	for(var i = 0; i < listLike.length; ++i){
		list.push(listLike[i]);	
	}

	return list;
}

_.setAttr = function setAttr(node, key, value){
	switch(key){
		case 'style':
			node.style.cssText = value;
			break;
		case 'value':
			var tagName = node.tagName || '';
			tagName = tagName.toLowerCase();

			if(tagName === 'input' || tagName === 'textarea'){
				node.value = value;
			} else {
				node.setAttribute(key, value);
			}
			break;
		default:
			node.setAttribute(key, value);
			break;
	}
}
