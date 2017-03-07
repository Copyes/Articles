
const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
let arratAugmentations = [];


arrayMethods.forEach((method) => {
	let original =  Array.prototype[method]; 
	arratAugmentations[method] = function(){
		console.log('我被改变了');
		return original.apply(this, arguments);
	}
});


module.exports = arratAugmentations;
