import Vue from 'vue'
import App from './App.vue'

import store from './store';

Vue.use(store);

new Vue({
  el: '#app',
  data: {
  		state: {
			globe: {
				msg: 'quanju'
			}
  		}
  },
  methods: {
  		log(){
  			console.log(this.state.globe);
  		}
  },
  render: h => h(App)
})
