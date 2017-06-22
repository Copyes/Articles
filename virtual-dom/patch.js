var _ = require('./util');
/**
 * 打补丁
 * @return {[type]} [description]
 */

const REPLACE = 0
const REORDER = 1
const ATTRS = 2
const TEXT = 3

const patch = (rootNode, patches) => {
	let walker = {index: 0};

	dfsWalk(rootNode, walker, patches);
}

//深度优先遍历
const dfsWalk = (node, walker, patches) => {
	// 当前这层需要做的修改
	let currentPatches = patches[walker.index];
	let len = node.children ? node.children.length : 0;

	for(let i = 0; i < len; i++){
		let child = node.children[i];
		walker.index++;
		dfsWalk(child, walker, patches);
	}

	if(currentPatches){
		applyPatches(node, currentPatches);
	}
}


const applyPatches = (node, currentPatches) => {
	_.each(currentPatches, (curPatch) => {
		switch(curPatch.type){
			case REPLACE:
				let newNode = (typeof curPatch.node === 'string')
					? document.createTextNode(curPatch.node)
					: curPatch.node.render();

				node.parentNode.replaceChild(newNode, node);
				break;
			case REORDER:
				reorderChildren(node, curPatch.moves);
				break;
			case ATTRS:
				setAttrs(node, curPatch.attrs);
				break;
			case TEXT:
				if(node.textContent){
					node.textContent = curPatch.content;
				}else{
					node.nodeValue = curPatch.content;
				}
				break;
			default:
				throw new Error('unknow patch type' + curPatch.type);
		}
	});
}

const setAttrs = (node, attrs) => {
	for(let key in attrs){
		if(attrs[key] === undefined){
			node.removeAttribute(key);
		}else{
			let value = attrs[key];
			_.setAttrs(node, key, value);
		}
	}
}



