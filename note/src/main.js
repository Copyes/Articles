// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import config from './store/index'

import ybStores from './yb-store';
Vue.use(ybStores);
Vue.use(Vuex);

var store = new Vuex.Store(config);
//Vue.use(Vuex);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  data: {
  	 ybState: {
  	 	showModal: false,
	    global: {
	        txt: 'shared Text'
	    }
  	 }
  },
  template: '<App/>',
  components: { App }
})
