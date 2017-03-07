import _ from './util.js';

let objectAgumentations = {};


_.define(objectAgumentations, $add, function(key, val){
	if(this.hasOwnProperty(key)){
		return ;
	}
	_.define(this, key, val, true);
	let ob = this.$observer;
	ob.observer(key, val);
	ob.convert(key, val);
});


_define(objectAgumentations, $delete, function(key, val){
	
	if(!this.hasOwnProperty(key)) return;
	delete this[key];

});

module.exports = objectAgumentations;