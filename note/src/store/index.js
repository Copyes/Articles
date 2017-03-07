
import * as actions from './actions.js';
// 获取今天的日期
const getDate = () => {
	const date = new Date();
	let month = parseInt(date.getMonth()) + 1;

	return date.getFullYear() + '-' + month + '-' + date.getDate();
}
// 本地存储事件
const localStorageEvent = function(item){
	this.get = function(){
		return JSON.parse(localStorage.getItem(item));
	}

	this.set = function(obj){
		localStorage.setItem(item, JSON.stringify(obj));
	}

	this.clear = function(){
		localStorage.removeItem(item);
	}
}

const local = new localStorageEvent('fc_notes');

const state = local.get() || {
	count: 0,
	events: []
}

const mutations = {
	ADDNOTE(states, obj){
		console.log(obj);
		states.count++;
        obj.items.id = states.count;
        states.events.unshift(obj.items);
        local.set(states);
	},
	EVENTDONE(states, obj){
		let item;
		for(let i = 0; i < states.events.length; ++i){
			if(states.events[i].id === obj.id){
				states.events[i].type = 2;
				item = states.events[i];
				states.events.splice(i, 1);
			}
			break;
		}
		states.events.unshift(item);
		local.set(states);
	},
	EVENTCANCEL(states, obj){
		let item;
		for(let i = 0; i < states.events.length; ++i){
			if(states.events[i].id === obj.id){
				states.events[i].type = 3;
				item = states.events[i];
				states.events.splice(i, 1);
				break;
			}
		}
		states.events.unshift(item);
		local.set(states);
	},
	CLEAREVENT(states, obj){
		states.events = [];
		local.clear();
	}

};

export default {
	state,
    actions,
    mutations
}
