/**
 * dom构造器
 */
import _ from './util.js';


class Element {

	constructor(tagName, attrs, children){
		// 该元素节点只有两个参数的时候,当该节点没有attrs的时候
		if(_.isArray(attrs)){
			// 
			children = attrs;
			attrs = {};
		}

		this.tagName = tagName;
		this.attrs = attrs || {};
		this.children = children;

		this.key = attrs ?  attrs.key : '';

		console.log(this.key);

	}

	render(){
		let el = document.createElement(this.tagName);
		let attrs = this.attrs;
		// 给所有的节点赋值该节点对应的属性
		for(let attrName in attrs){
			let attrVal = attrs[attrName];
			_.setAttr(el, attrName, attrVal);
		}

		let children = this.children || [];

		children.forEach((child) => {
			let childEl = child instanceof Element
				? child.render()
				: document.createTextNode(child);
			el.appendChild(childEl);
		});

		return el;
	}
}


export default function (tagName, attrs, children){
	return new Element(tagName, attrs, children);
}
