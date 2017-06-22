import _ from './util.js';

const REPLACE = 0;
const ATTRS = 1;
const TEXT = 2;
const REORDER = 3;
let key_id = 0;

const walkTree = (oldNode, newNode, index, patches) => {
	
	let currentPatch = [];
	// 当旧节点被remove的时候，换句话说就是新节点不存在的时候
	if(newNode === null || newNode === undefined){

	}
	// 比较文本节点之间的不同
	else if(_.isString(oldNode) && _.isString(newNode)){
		newNode !== oldNode && currentPatch.push({ type: TEXT, content: newNode });
	}
	// 比较attrs属性的不同
	else if(oldNode.tagName === newNode.tagName &&
			oldNode.key === newNode.key){
		// 获取节点属性不同的补丁
		let attrsPatches = diffAttrs(oldNode, newNode);
		// 节点补丁存在的话就存起来咯
		!!attrsPatches && currentPatch.push({ type: ATTRS, attrs: attrsPatches });
		// 比较子节点
		diffChildren(oldNode.children, newNode.children, index, patches);
	}
	// 直接是节点替换
	else {
		currentPatch.push({ type: REPLACE, node: newNode});
	}
	// 当前层级的补丁
	!!currentPatch.length && (patches[index] = currentPatch);
}
// 比较属性
const diffAttrs = (oldNode, newNode) => {
	let oldAttrs = oldNode.attrs || {};
	let newAttrs = newNode.attrs || {};
	let count = 0;

	let key, value, attrsPatches = {};

	for(key in oldAttrs){
		value = oldAttrs[key];
		// 如果oldAttrs中的一些属性被移除了，那么newAttrs[key] === undefined;
		if(newAttrs[key] !== value){
			count++;
			attrsPatches[key] = newAttrs[key];
		}
	}
	// 当前节点上存在新的属性了
	for(key in newAttrs){
		value = newAttrs[key];
		if(!oldAttrs.hasOwnProperty(key)){
			attrsPatches[key] = value;
		}
	}

	if(count === 0){
		return null;
	}

	return attrsPatches;

}

const diffChildren = (oldChildren, newChildren, index, patches) => {
	// 当前节点的标志，初始化值为0
	let currentNodeIndex = index;

	oldChildren.forEach((child, i) => {
		key_id++;
		let newChild = newChildren[i];
		currentNodeIndex = key_id;

		walkTree(child, newChild, currentNodeIndex, patches);
	})
}


export function diff(oldTree, newTree){
	let patches = {};
	let index = 0;
	// 遍历节点树处理那四种情况
	walkTree(oldTree, newTree, index, patches);
	return patches;
}
